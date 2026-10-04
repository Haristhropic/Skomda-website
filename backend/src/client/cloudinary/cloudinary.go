// Package cloudinary menyediakan helper integrasi ke Cloudinary API
// untuk backend Go (Gin & Fiber).
//
// Mendukung pemrosesan signed upload, transformasi URL aman, dan upload langsung.
package cloudinary

import (
	"bytes"
	"context"
	"crypto/sha1"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"net/url"
	"sort"
	"strings"
	"time"
)

// Client menyimpan kredensial Cloudinary yang diparse dari CLOUDINARY_URL.
type Client struct {
	CloudName string
	APIKey    string
	APISecret string
	BaseURL   string
}

// UploadResult menyimpan respons dari Cloudinary setelah upload berhasil.
type UploadResult struct {
	PublicID     string `json:"public_id"`
	SecureURL    string `json:"secure_url"`
	Format       string `json:"format"`
	Width        int    `json:"width"`
	Height       int    `json:"height"`
	Bytes        int64  `json:"bytes"`
	ResourceType string `json:"resource_type"`
	Eager        []struct {
		SecureURL string `json:"secure_url"`
		Format    string `json:"format"`
		Bytes     int64  `json:"bytes"`
	} `json:"eager"`
}

// NewClient menginisialisasi Client dari string CLOUDINARY_URL
// format: cloudinary://<api_key>:<api_secret>@<cloud_name>
func NewClient(rawURL string) (*Client, error) {
	if rawURL == "" {
		return &Client{
			BaseURL: "https://res.cloudinary.com",
		}, nil
	}

	u, err := url.Parse(rawURL)
	if err != nil {
		return nil, fmt.Errorf("format CLOUDINARY_URL tidak valid: %w", err)
	}
	if u.Scheme != "cloudinary" || u.User == nil || u.Host == "" {
		return nil, fmt.Errorf("format CLOUDINARY_URL tidak valid")
	}

	password, _ := u.User.Password()
	return &Client{
		CloudName: u.Host,
		APIKey:    u.User.Username(),
		APISecret: password,
		BaseURL:   "https://res.cloudinary.com",
	}, nil
}

// GenerateSignature membuat signature SHA-1 untuk signed client-side upload.
// Sesuai spesifikasi Cloudinary API: https://cloudinary.com/documentation/signatures
func (c *Client) GenerateSignature(params map[string]string) string {
	var keys []string
	for k := range params {
		if k != "api_key" && k != "signature" && k != "resource_type" && k != "file" {
			keys = append(keys, k)
		}
	}
	sort.Strings(keys)

	var pairs []string
	for _, k := range keys {
		pairs = append(pairs, fmt.Sprintf("%s=%s", k, params[k]))
	}

	toSign := strings.Join(pairs, "&") + c.APISecret
	h := sha1.New()
	h.Write([]byte(toSign))
	return hex.EncodeToString(h.Sum(nil))
}

// GetSignedUploadParams menghasilkan parameter lengkap untuk upload aman dari frontend.
func (c *Client) GetSignedUploadParams(folder string) map[string]string {
	timestamp := fmt.Sprintf("%d", time.Now().Unix())
	params := map[string]string{
		"timestamp": timestamp,
		"folder":    folder,
	}

	signature := c.GenerateSignature(params)
	params["signature"] = signature
	params["api_key"] = c.APIKey
	params["cloud_name"] = c.CloudName

	return params
}

// UploadImage mengunggah stream/byte gambar langsung dari backend ke Cloudinary.
func (c *Client) UploadImage(ctx context.Context, fileReader io.Reader, filename, folder string) (*UploadResult, error) {
	if c.CloudName == "" || c.APIKey == "" || c.APISecret == "" {
		return nil, fmt.Errorf("kredensial Cloudinary belum lengkap di backend .env")
	}

	uploadURL := fmt.Sprintf("https://api.cloudinary.com/v1_1/%s/image/upload", c.CloudName)

	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)

	part, err := writer.CreateFormFile("file", filename)
	if err != nil {
		return nil, fmt.Errorf("gagal membuat form file: %w", err)
	}
	if _, err := io.Copy(part, fileReader); err != nil {
		return nil, fmt.Errorf("gagal menyalin stream file: %w", err)
	}

	timestamp := fmt.Sprintf("%d", time.Now().Unix())
	paramsToSign := map[string]string{
		"timestamp": timestamp,
		"folder":    folder,
		"eager":     "f_webp,q_90",
	}
	signature := c.GenerateSignature(paramsToSign)

	_ = writer.WriteField("api_key", c.APIKey)
	_ = writer.WriteField("timestamp", timestamp)
	_ = writer.WriteField("signature", signature)
	_ = writer.WriteField("folder", folder)
	_ = writer.WriteField("eager", "f_webp,q_90")
	_ = writer.Close()

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, uploadURL, body)
	if err != nil {
		return nil, fmt.Errorf("gagal membuat http request ke Cloudinary: %w", err)
	}
	req.Header.Set("Content-Type", writer.FormDataContentType())

	httpClient := &http.Client{Timeout: 30 * time.Second}
	resp, err := httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("gagal menghubungi Cloudinary: %w", err)
	}
	defer resp.Body.Close()

	respBody, _ := io.ReadAll(resp.Body)
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("cloudinary upload error (%d): %s", resp.StatusCode, string(respBody))
	}

	var res UploadResult
	if err := json.Unmarshal(respBody, &res); err != nil {
		return nil, fmt.Errorf("gagal decode response Cloudinary: %w", err)
	}
	// The original stays in Cloudinary; the derivative preserves dimensions.
	if len(res.Eager) > 0 && res.Eager[0].SecureURL != "" {
		res.SecureURL = res.Eager[0].SecureURL
		res.Format = res.Eager[0].Format
		res.Bytes = res.Eager[0].Bytes
	}

	return &res, nil
}

// UploadRaw mengunggah stream/byte file dokumen atau arsip ke Cloudinary (resource_type: raw).
func (c *Client) UploadRaw(ctx context.Context, fileReader io.Reader, filename, folder string) (*UploadResult, error) {
	if c.CloudName == "" || c.APIKey == "" || c.APISecret == "" {
		return nil, fmt.Errorf("kredensial Cloudinary belum lengkap di backend .env")
	}

	uploadURL := fmt.Sprintf("https://api.cloudinary.com/v1_1/%s/raw/upload", c.CloudName)

	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)

	part, err := writer.CreateFormFile("file", filename)
	if err != nil {
		return nil, fmt.Errorf("gagal membuat form file: %w", err)
	}
	if _, err := io.Copy(part, fileReader); err != nil {
		return nil, fmt.Errorf("gagal menyalin stream file: %w", err)
	}

	timestamp := fmt.Sprintf("%d", time.Now().Unix())
	paramsToSign := map[string]string{
		"timestamp": timestamp,
		"folder":    folder,
	}
	signature := c.GenerateSignature(paramsToSign)

	_ = writer.WriteField("api_key", c.APIKey)
	_ = writer.WriteField("timestamp", timestamp)
	_ = writer.WriteField("signature", signature)
	_ = writer.WriteField("folder", folder)
	_ = writer.Close()

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, uploadURL, body)
	if err != nil {
		return nil, fmt.Errorf("gagal membuat http request ke Cloudinary: %w", err)
	}
	req.Header.Set("Content-Type", writer.FormDataContentType())

	httpClient := &http.Client{Timeout: 60 * time.Second}
	resp, err := httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("gagal menghubungi Cloudinary: %w", err)
	}
	defer resp.Body.Close()

	respBody, _ := io.ReadAll(resp.Body)
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("cloudinary raw upload error (%d): %s", resp.StatusCode, string(respBody))
	}

	var res UploadResult
	if err := json.Unmarshal(respBody, &res); err != nil {
		return nil, fmt.Errorf("gagal decode response Cloudinary: %w", err)
	}

	return &res, nil
}
