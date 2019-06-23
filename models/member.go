package models

import (
	"github.com/jinzhu/gorm"
)

//Member model
type Member struct {
	gorm.Model
	Name     string  `json:"Name"`
	Tel      string  `json:"Tel"`
	Cumcon   uint    `json:"Cumcon"`
	Sex      bool    `json:"Sex"`
	Discount float64 `json:"Discount"`
}
