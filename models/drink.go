package models

import (
	"github.com/jinzhu/gorm"
)

//Drink model
type Drink struct {
	gorm.Model
	Name  string  `json:"Name"`
	Price float32 `json:"Price"`
	Stock uint    `json:"Stock"`
}
