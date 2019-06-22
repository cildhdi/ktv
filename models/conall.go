package models

import (
	"time"

	"github.com/jinzhu/gorm"
)

//ConAll model
type ConAll struct {
	gorm.Model
	BoxID uint      `json:"BoxID"`
	Drink float64   `json:"Drink"`
	Box   float64   `json:"Box"`
	Date  time.Time `json:"Date"`
}
