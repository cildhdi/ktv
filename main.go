package main

import (
	"ktv/routers/api"

	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()
	ktvapi := router.Group("/ktvapi")
	ktvapi.POST("/login", api.Login)

	box := ktvapi.Group("/box")
	{
		box.POST("/create", api.CreateBox)
		box.POST("/delete", api.DeteleBox)
		box.POST("/get", api.GetBox)
		box.POST("/all", api.GetAllBox)
		box.POST("/book", api.BookBox)
		box.POST("/open", api.OpenBox)
	}

	conall := ktvapi.Group("/conall")
	{
		conall.POST("/create", api.CreateConAll)
		conall.POST("/get", api.GetConAll)
		conall.POST("/all", api.GetAllConall)
	}

	consume := ktvapi.Group("/consume")
	{
		consume.POST("/create", api.CreateConsume)
		consume.POST("/update", api.UpdateConsume)
		consume.POST("/delete", api.DeteleConsume)
		consume.POST("get", api.GetConsume)
		consume.POST("/consumes", api.GetAllConsume)
	}

	drink := ktvapi.Group("/drink")
	{
		drink.POST("/create", api.CreateDrink)
		drink.POST("/update", api.UpdateDrink)
		drink.POST("/delete", api.DeteleDrink)
		drink.POST("/get", api.GetDrink)
		drink.POST("/all", api.GetAllDrink)
	}

	member := ktvapi.Group("/member")
	{
		member.POST("/create", api.CreateMember)
		member.POST("/update", api.UpdateMember)
		member.POST("/delete", api.DeteleMember)
		member.POST("/get", api.GetMember)
		member.POST("/all", api.GetAllMember)
	}

	repair := ktvapi.Group("/repair")
	{
		repair.POST("/create", api.CreateRepair)
		repair.POST("/delete", api.DeteleRepair)
		repair.POST("/get", api.GetRepair)
		repair.POST("/all", api.GetAllRepair)
	}

	user := ktvapi.Group("/user")
	{
		user.POST("/create", api.CreateUser)
		user.POST("/delete", api.DeteleUser)
		user.POST("/update", api.UpdateUser)
		user.POST("/get", api.GetUser)
		user.POST("/all", api.GetAllUser)
	}
	router.Run(":8080")
}
