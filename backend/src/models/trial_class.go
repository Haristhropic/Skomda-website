package models

import (
	"time"

	"gorm.io/gorm"
)

// TrialClassRegistration merepresentasikan data pendaftaran peserta Trial Class SMK Telkom Sidoarjo.
type TrialClassRegistration struct {
	ID           uint           `gorm:"primaryKey" json:"id"`
	TicketCode   string         `gorm:"size:64;uniqueIndex;not null" json:"ticketCode"`
	FullName     string         `gorm:"size:255;not null;index" json:"fullName"`
	SchoolOrigin string         `gorm:"size:255;not null" json:"schoolOrigin"`
	Whatsapp     string         `gorm:"size:50;not null;index" json:"whatsapp"`
	Email        string         `gorm:"size:255" json:"email"`
	Major        string         `gorm:"size:100;not null" json:"major"`
	Status       string         `gorm:"size:50;not null;default:'registered'" json:"status"` // registered, verified, attended
	Notes        string         `gorm:"type:text" json:"notes"`
	CreatedAt    time.Time      `json:"createdAt"`
	UpdatedAt    time.Time      `json:"updatedAt"`
	DeletedAt    gorm.DeletedAt `gorm:"index" json:"-"`
}
