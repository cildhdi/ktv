package models

import (
	"github.com/jinzhu/gorm"
)

//depart
const (
	_ = iota
	Reception
	Logistics
	Finance
	Manager
)

// User model
type User struct {
	gorm.Model
	LoginName string `json:"LoginName"`
	Password  string `json:"Password"`
	Depart    int    `json:"Depart"`
	Sex       uint   `json:"Sex"`
	UserName  string `json:"UserName"`
	Tel       string `json:"Tel"`
	Token     string `json:"Token"`
}
