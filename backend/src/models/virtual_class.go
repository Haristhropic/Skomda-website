package models

import "time"

// VirtualClassModuleEN menyimpan terjemahan Inggris opsional untuk satu modul.
// Field kosong berarti tampilan Inggris memakai teks Indonesia.
type VirtualClassModuleEN struct {
	Title       string   `json:"title"`
	Desc        string   `json:"desc"`
	Duration    string   `json:"duration"`
	LessonTitle string   `json:"lessonTitle"`
	LessonDesc  string   `json:"lessonDesc"`
	Mentor      string   `json:"mentor"`
	Topics      []string `json:"topics"`
}

// VirtualClassQuizEN menyimpan terjemahan Inggris opsional untuk satu kuis.
type VirtualClassQuizEN struct {
	Question    string   `json:"question"`
	Options     []string `json:"options"`
	Explanation string   `json:"explanation"`
}

// VirtualClassModule adalah satu materi video pada halaman Virtual Class.
// Kuis di dalam video disimpan terpisah pada VirtualClassQuiz.
type VirtualClassModule struct {
	ID             uint                  `gorm:"primaryKey" json:"id"`
	Slug           string                `gorm:"size:120;uniqueIndex;not null" json:"slug"`
	Title          string                `gorm:"size:200;not null" json:"title"`
	Description    string                `gorm:"column:description;type:text" json:"desc"`
	Icon           string                `gorm:"size:500" json:"icon"`
	Duration       string                `gorm:"size:50" json:"duration"`
	DriveVideoID   string                `gorm:"column:drive_video_id;size:200" json:"driveVideoId"`
	VideoURL       string                `gorm:"column:video_url;size:500" json:"videoUrl"`
	LessonTitle    string                `gorm:"size:255" json:"lessonTitle"`
	LessonDesc     string                `gorm:"type:text" json:"lessonDesc"`
	Mentor         string                `gorm:"size:255" json:"mentor"`
	Topics         []string              `gorm:"type:text;serializer:json" json:"topics"`
	TranslationsEN *VirtualClassModuleEN `gorm:"column:translations_en;type:text;serializer:json" json:"translationsEn,omitempty"`
	OrderIndex     int                   `gorm:"default:0;index" json:"orderIndex"`
	IsActive       bool                  `gorm:"default:true;index" json:"isActive"`
	Quizzes        []VirtualClassQuiz    `gorm:"foreignKey:ModuleID;constraint:OnDelete:CASCADE" json:"quizzes"`
	CreatedAt      time.Time             `json:"createdAt"`
	UpdatedAt      time.Time             `json:"updatedAt"`
}

// VirtualClassQuiz adalah satu pertanyaan yang muncul saat video mencapai TriggerSeconds.
type VirtualClassQuiz struct {
	ID             uint                `gorm:"primaryKey" json:"id"`
	ModuleID       uint                `gorm:"not null;index" json:"moduleId"`
	TriggerSeconds int                 `gorm:"not null;default:0" json:"triggerSeconds"`
	Question       string              `gorm:"type:text;not null" json:"question"`
	Options        []string            `gorm:"type:text;serializer:json" json:"options"`
	CorrectIndex   int                 `gorm:"not null;default:0" json:"correctIndex"`
	Explanation    string              `gorm:"type:text" json:"explanation"`
	TranslationsEN *VirtualClassQuizEN `gorm:"column:translations_en;type:text;serializer:json" json:"translationsEn,omitempty"`
	CreatedAt      time.Time           `json:"createdAt"`
	UpdatedAt      time.Time           `json:"updatedAt"`
}
