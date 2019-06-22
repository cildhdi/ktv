package models

import (
	"time"

	"github.com/jinzhu/gorm"
)

//Repair model
type Repair struct {
	gorm.Model
	BoxID  uint      `json:"BoxID"`
	Reason string    `json:"Reason" gorm:"size:100"`
	Date   time.Time `json:"Time"`
	UserID uint      `json:"UserID"`
}
