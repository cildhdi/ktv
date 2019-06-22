package models

import (
	"github.com/jinzhu/gorm"
)

//depart
const (
	Reception = iota
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
	Sex       bool   `json:"Sex"`
	UserName  string `json:"UserName"`
	Tel       string `json:"Tel"`
	Token     string `json:"Token"`
}
