package models

import (
	"time"

	"github.com/jinzhu/gorm"
)

//Consume model
type Consume struct {
	gorm.Model
	BoxID   uint      `json:"BoxID"`
	DrinkID uint      `json:"DrinkID"`
	Num     uint      `json:"Num"`
	Date    time.Time `json:"Date"`
}
