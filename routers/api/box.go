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
}

//CreateBox box add
func CreateBox(ctx *gin.Context) {
	param := addBoxParam{}
	if err := ctx.ShouldBindBodyWith(&param, binding.JSON); err != nil {
		util.SetError(ctx, http.StatusInternalServerError, err.Error())
		return
	}

	box := models.Box{
		No:       param.No,
		Type:     param.Type,
		Price:    param.Price,
		State:    models.Empty,
		OpenTime: time.Now(),
		BookTime: time.Now(),
		Duration: 1,
	}

	if err := models.Db().Create(&box).Error; err != nil {
		util.SetError(ctx, http.StatusInternalServerError, err.Error())
	} else {
		ctx.JSON(http.StatusOK, box)
	}
	return
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
	for _, box := range boxes {
		if box.State == models.Using && time.Unix(box.Duration, box.OpenTime.UnixNano()).Before(time.Now()) {
			box.State = models.Empty
			models.Db().Save(box)
		}
	}

	ctx.JSON(http.StatusOK, gin.H{
		"boxes": boxes,
	})
}

type bookBoxParam struct {
	idParam
	OpenTime int64 `json:"OpenTime" binding:"required"`
	Duration int64 `json:"Duration" binding:"required"`
}

//BookBox bookbox
func BookBox(ctx *gin.Context) {
	param := bookBoxParam{}
	if err := ctx.ShouldBindBodyWith(&param, binding.JSON); err != nil {
		util.SetError(ctx, http.StatusInternalServerError, err.Error())
		return
	}

	box := models.Box{}
	if err := models.Db().First(&box, param.ID).Error; err != nil {
		util.SetError(ctx, http.StatusNotFound, err.Error())
		return
	}

	box.BookTime = time.Now()
	box.Duration = param.Duration
	box.OpenTime = time.Unix(param.OpenTime, 0)
	box.State = models.Reserved

	if err := models.Db().Save(box).Error; err != nil {
		util.SetError(ctx, http.StatusInternalServerError, err.Error())
		return
	}
	ctx.JSON(http.StatusOK, &box)
}

//OpenBox openbox
func OpenBox(ctx *gin.Context) {
	param := bookBoxParam{}
	if err := ctx.ShouldBindBodyWith(&param, binding.JSON); err != nil {
		util.SetError(ctx, http.StatusInternalServerError, err.Error())
		return
	}

	box := models.Box{}
	if err := models.Db().First(&box, param.ID).Error; err != nil {
		util.SetError(ctx, http.StatusNotFound, err.Error())
		return
	}

	box.BookTime = time.Now()
	box.Duration = param.Duration
	box.OpenTime = time.Now()
	box.State = models.Using

	if err := models.Db().Save(box).Error; err != nil {
		util.SetError(ctx, http.StatusInternalServerError, err.Error())
		return
	}
	ctx.JSON(http.StatusOK, &box)
}
