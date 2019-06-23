package api

import (
	"ktv/models"
	"ktv/util"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
)

type addBoxParam struct {
	No    string  `json:"No" binding:"required"`
	Type  int     `json:"Type" binding:"required"`
	Price float32 `json:"Price" binding:"required"`
	State int     `json:"State" binding:"required"`
}

//CreateBox box add
func CreateBox(ctx *gin.Context) {
	param := addBoxParam{}
	if err := ctx.ShouldBindBodyWith(&param, binding.JSON); err != nil {
		util.SetError(ctx, http.StatusInternalServerError, err.Error())
		return
	}

	box := models.Box{
		No:    param.No,
		Type:  param.Type,
		Price: param.Price,
		State: param.State,
	}

	if err := models.Db().Create(&box).Error; err != nil {
		util.SetError(ctx, http.StatusInternalServerError, err.Error())
	} else {
		ctx.JSON(http.StatusOK, box)
	}
	return
}

type updateBoxParam struct {
	addBoxParam
	idParam
	BookTime int64         `json:"BookTime" binding:"required"`
	OpenTime int64         `json:"OpenTime" binding:"required"`
	Duration time.Duration `json:"Duration" binding:"required"`
}

//UpdateBox box update
func UpdateBox(ctx *gin.Context) {
	param := updateBoxParam{}
	if err := ctx.ShouldBindBodyWith(&param, binding.JSON); err != nil {
		util.SetError(ctx, http.StatusInternalServerError, err.Error())
		return
	}

	box := models.Box{}
	if err := models.Db().First(&box, param.ID).Error; err != nil {
		util.SetError(ctx, http.StatusNotFound, err.Error())
		return
	}

	box.No = param.No
	box.Price = param.Price
	box.State = param.State
	box.Type = param.Type
	box.BookTime = time.Unix(param.BookTime, 0)
	box.OpenTime = time.Unix(param.OpenTime, 0)
	box.Duration = param.Duration

	models.Db().Save(&box)
	ctx.JSON(http.StatusOK, &box)
}

type idParam struct {
	ID uint `json:"ID" binding:"required"`
}

//DeteleBox box delete
func DeteleBox(ctx *gin.Context) {
	param := idParam{}
	if err := ctx.ShouldBindBodyWith(&param, binding.JSON); err != nil {
		util.SetError(ctx, http.StatusInternalServerError, err.Error())
		return
	}

	box := models.Box{}
	if err := models.Db().First(&box, param.ID).Error; err != nil {
		util.SetError(ctx, http.StatusNotFound, err.Error())
		return
	}
	models.Db().Delete(&box)
	ctx.JSON(http.StatusOK, &box)
}

//GetBox box get
func GetBox(ctx *gin.Context) {
	param := idParam{}
	if err := ctx.ShouldBindBodyWith(&param, binding.JSON); err != nil {
		util.SetError(ctx, http.StatusInternalServerError, err.Error())
		return
	}

	box := models.Box{}
	if err := models.Db().First(&box, param.ID).Error; err != nil {
		util.SetError(ctx, http.StatusNotFound, err.Error())
		return
	}
	ctx.JSON(http.StatusOK, &box)
}

//GetAllBox boxes
func GetAllBox(ctx *gin.Context) {
	boxes := []models.Box{}
	models.Db().Find(&boxes)
	ctx.JSON(http.StatusOK, gin.H{
		"boxes": boxes,
	})
}
