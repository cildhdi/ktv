package models

import (
	"github.com/jinzhu/gorm"
)

const (
	_ = iota
	Men
	Women
)

//Member model
type Member struct {
	gorm.Model
	Name     string  `json:"Name"`
	Tel      string  `json:"Tel"`
	Cumcon   uint    `json:"Cumcon"`
	Sex      uint    `json:"Sex"`
	Discount float64 `json:"Discount"`
}
