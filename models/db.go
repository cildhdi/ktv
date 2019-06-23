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

	user := User{}
	db.First(&user, "depart = ?", Manager)
	if user.ID == 0 {
		user.Depart = Manager
		user.LoginName = config.DbName
		user.Password = config.DbPassword
		user.Sex = Men
		user.Tel = "13344445555"
		user.UserName = "磊磊"
		db.Save(&user)
	}
}

// Db Get db
func Db() *gorm.DB {
	return db
}
