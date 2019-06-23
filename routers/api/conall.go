package api

import (
	"ktv/models"
	"ktv/util"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
)

type addConAllParam struct {
	BoxID uint    `json:"BoxID" binding:"required"`
	Drink float64 `json:"Drink" binding:"required"`
	Box   float64 `json:"Box" binding:"required"`
	Date  int64   `json:"Date" binding:"required"`
}

//CreateConAll conall add
func CreateConAll(ctx *gin.Context) {
	param := addConAllParam{}
	if err := ctx.ShouldBindBodyWith(&param, binding.JSON); err != nil {
		util.SetError(ctx, http.StatusInternalServerError, err.Error())
		return
	}

	conall := models.ConAll{
		BoxID: param.BoxID,
		Drink: param.Drink,
		Box:   param.Box,
		Date:  time.Unix(param.Date, 0),
	}

	if err := models.Db().Create(&conall).Error; err != nil {
		util.SetError(ctx, http.StatusInternalServerError, err.Error())
	} else {
		ctx.JSON(http.StatusOK, conall)
	}
	return
}

//GetConAll conall get
func GetConAll(ctx *gin.Context) {
	param := idParam{}
	if err := ctx.ShouldBindBodyWith(&param, binding.JSON); err != nil {
		util.SetError(ctx, http.StatusInternalServerError, err.Error())
		return
	}

	conall := models.ConAll{}
	if err := models.Db().First(&conall, param.ID).Error; err != nil {
		util.SetError(ctx, http.StatusNotFound, err.Error())
		return
	}
	ctx.JSON(http.StatusOK, &conall)
}

//GetAllConall conalls
func GetAllConall(ctx *gin.Context) {
	conalls := []models.ConAll{}
	models.Db().Find(&conalls)
	ctx.JSON(http.StatusOK, gin.H{
		"conalls": conalls,
	})
}
