package main

import (
	"ktv/routers/api"

	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()

	box := router.Group("/box")
	{
		box.POST("/create", api.CreateBox)
		box.POST("/delete", api.DeteleBox)
		box.POST("/update", api.UpdateBox)
		box.POST("/get", api.GetBox)
	}
	router.Run(":8080")
}
