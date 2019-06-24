package models

import (
	"time"

	"github.com/jinzhu/gorm"
)

//types
const (
	_ = iota
	MiniBox
	Small
	Middle
	Big
	Super
)

//states
const (
	_ = iota
	Reserved
	Empty
	Using
)

//Box model
type Box struct {
	gorm.Model
	No       string    `json:"No"`
	Type     int       `json:"Type"`
	Price    float32   `json:"Price"`
	State    int       `json:"State"`
	BookTime time.Time `json:"BookTime"`
	OpenTime time.Time `json:"OpenTime"`
	Duration int64     `json:"Duration"`
}
