package models

import (
	"time"

	"github.com/jinzhu/gorm"
)

//types
const (
	MiniBox = iota
	Small
	Middle
	Big
	Super
)

//states
const (
	Reserved = iota
	Empty
	Using
)

//Box model
type Box struct {
	gorm.Model
	No       string        `json:"No"`
	Type     int           `json:"Type"`
	Price    float32       `json:"Price"`
	State    int           `json:"State"`
	BookTime time.Time     `json:"BookTime"`
	OpenTime time.Time     `json:"OpenTime"`
	Duration time.Duration `json:"Duration"`
}
