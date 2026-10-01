package models

import (
	"time"

	"gorm.io/gorm"
)

// BKKJob merepresentasikan lowongan kerja atau magang industri yang dikelola BKK SKOMDA.
type BKKJob struct {
	ID           uint           `gorm:"primaryKey" json:"id"`
	Title        string         `gorm:"size:255;not null" json:"title"`
	Company      string         `gorm:"size:200;not null" json:"company"`
	Location     string         `gorm:"size:150;not null" json:"location"`
	JobType      string         `gorm:"size:50;not null;default:'Full-time'" json:"jobType"` // Full-time, Magang, Kontrak
	Deadline     string         `gorm:"size:50" json:"deadline"`
	Salary       string         `gorm:"size:100" json:"salary"`
	Requirements string         `gorm:"type:text" json:"requirements"`
	Description  string         `gorm:"type:text" json:"description"`
	CompanyLogo  string         `gorm:"size:500" json:"companyLogo"`
	ApplyURL     string         `gorm:"size:500" json:"applyUrl"`
	Status        string         `gorm:"size:20;not null;default:'active'" json:"status"` // active, pending, rejected, closed
	ContactPerson string         `gorm:"size:150" json:"contactPerson"`
	EmailOrWa     string         `gorm:"size:150" json:"emailOrWa"`
	Jurusan       string         `gorm:"size:100" json:"jurusan"`
	Source        string         `gorm:"size:50;default:'admin'" json:"source"` // 'admin' atau 'mitra'
	CreatedAt     time.Time      `json:"created_at"`
	UpdatedAt     time.Time      `json:"updated_at"`
	DeletedAt     gorm.DeletedAt `gorm:"index" json:"-"`
}

// BKKPartner merepresentasikan mitra industri yang bekerja sama dengan SMK Telkom Sidoarjo.
type BKKPartner struct {
	ID          uint           `gorm:"primaryKey" json:"id"`
	Name        string         `gorm:"size:200;not null" json:"name"`
	Category    string         `gorm:"size:100;not null" json:"category"`
	Logo        string         `gorm:"size:500;not null" json:"logo"`
	Description string         `gorm:"type:text" json:"description"`
	Website     string         `gorm:"size:500" json:"website"`
	OrderIndex  int            `gorm:"default:0;index" json:"orderIndex"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`
}

// BKKAlumni merepresentasikan kisah sukses dan testimoni karier lulusan SKOMDA.
type BKKAlumni struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	Name      string         `gorm:"size:150;not null" json:"name"`
	GradYear  string         `gorm:"size:10;not null" json:"gradYear"`
	Company   string         `gorm:"size:200;not null" json:"company"`
	Role      string         `gorm:"size:150;not null" json:"role"`
	Quote     string         `gorm:"type:text;not null" json:"quote"`
	Photo     string         `gorm:"size:500" json:"photo"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}
