package models

import (
	"ktv/config"

	"github.com/jinzhu/gorm"

	//mysql dialects
	_ "github.com/jinzhu/gorm/dialects/mysql"
)

var db *gorm.DB

func init() {
	var err error
	db, err = gorm.Open("mysql", config.DbUser+":"+config.DbPassword+"@/"+config.DbName+"?charset=utf8&parseTime=True&loc=Local")
	if err != nil {
		panic("fail to open database")
	}

	db.AutoMigrate(&User{})
	db.AutoMigrate(&Box{})
	db.AutoMigrate(&ConAll{})
	db.AutoMigrate(&Consume{})
	db.AutoMigrate(&Drink{})
	db.AutoMigrate(&Member{})
	db.AutoMigrate(&Repair{})
	db.AutoMigrate(&User{})
}

// Db Get db
func Db() *gorm.DB {
	return db
}
