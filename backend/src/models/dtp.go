package models

import (
	"time"

	"gorm.io/gorm"
)

// DigitalTalent merepresentasikan program spesialisasi Digital Talent Program (DTP) di SMK Telkom Sidoarjo.
type DigitalTalent struct {
	ID               uint           `gorm:"primaryKey" json:"id"`
	Slug             string         `gorm:"size:120;uniqueIndex;not null" json:"slug"`
	Number           string         `gorm:"size:10;default:'01'" json:"number"`
	Title            string         `gorm:"size:200;not null" json:"title"`
	Category         string         `gorm:"size:100;not null;index" json:"category"` // Software & AI, Network & Cloud, Hardware & Security, Design & Creative
	Image            string         `gorm:"size:500" json:"image"`
	ShortDesc        string         `gorm:"type:text" json:"shortDesc"`
	FullDesc         string         `gorm:"type:text" json:"fullDesc"`
	CoreSkills       string         `gorm:"type:text" json:"coreSkills"`       // Comma separated atau list
	SupportingSkills string         `gorm:"type:text" json:"supportingSkills"` // Comma separated atau list
	CareerProspects  string         `gorm:"type:text" json:"careerProspects"`  // Comma separated atau list
	Tools            string         `gorm:"type:text" json:"tools"`            // Comma separated atau list
	BadgeText        string         `gorm:"size:100" json:"badgeText"`
	OrderIndex       int            `gorm:"default:0;index" json:"orderIndex"`
	IsActive         bool           `gorm:"default:true;index" json:"isActive"`
	CreatedAt        time.Time      `json:"created_at"`
	UpdatedAt        time.Time      `json:"updated_at"`
	DeletedAt        gorm.DeletedAt `gorm:"index" json:"-"`
}
