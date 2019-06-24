package api

import (
	"ktv/models"
	"ktv/util"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
)

type addConsumeParam struct {
	BoxID   uint  `json:"BoxID" binding:"required"`
	DrinkID uint  `json:"DrinkID" binding:"required"`
	Num     uint  `json:"Num" binding:"required"`
	Date    int64 `json:"Date" binding:"required"`
}

//CreateConsume add
func CreateConsume(ctx *gin.Context) {
	param := addConsumeParam{}
	if err := ctx.ShouldBindBodyWith(&param, binding.JSON); err != nil {
		util.SetError(ctx, http.StatusInternalServerError, err.Error())
		return
	}

	consume := models.Consume{
		BoxID:   param.BoxID,
		DrinkID: param.DrinkID,
		Num:     param.Num,
		Date:    time.Unix(param.Date, 0),
	}

	if err := models.Db().Create(&consume).Error; err != nil {
		util.SetError(ctx, http.StatusInternalServerError, err.Error())
	} else {
		ctx.JSON(http.StatusOK, consume)
	}
	return
}

type updateConsumeParam struct {
	addConsumeParam
	idParam
}

//UpdateConsume update
func UpdateConsume(ctx *gin.Context) {
	param := updateConsumeParam{}
	if err := ctx.ShouldBindBodyWith(&param, binding.JSON); err != nil {
		util.SetError(ctx, http.StatusInternalServerError, err.Error())
		return
	}

	consume := models.Consume{}
	if err := models.Db().First(&consume, param.ID).Error; err != nil {
		util.SetError(ctx, http.StatusNotFound, err.Error())
		return
	}

	consume.BoxID = param.BoxID
	consume.DrinkID = param.DrinkID
	consume.Num = param.Num
	consume.Date = time.Unix(param.Date, 0)

	if err := models.Db().Save(&consume).Error; err != nil {
		util.SetError(ctx, http.StatusInternalServerError, err.Error())
	} else {
		ctx.JSON(http.StatusOK, &consume)
	}
}

//DeteleConsume delete
func DeteleConsume(ctx *gin.Context) {
	param := idParam{}
	if err := ctx.ShouldBindBodyWith(&param, binding.JSON); err != nil {
		util.SetError(ctx, http.StatusInternalServerError, err.Error())
		return
	}

	consume := models.Consume{}
	if err := models.Db().First(&consume, param.ID).Error; err != nil {
		util.SetError(ctx, http.StatusNotFound, err.Error())
		return
	}
	models.Db().Delete(&consume)
	ctx.JSON(http.StatusOK, &consume)
}

//GetConsume get
func GetConsume(ctx *gin.Context) {
	param := idParam{}
	if err := ctx.ShouldBindBodyWith(&param, binding.JSON); err != nil {
		util.SetError(ctx, http.StatusInternalServerError, err.Error())
		return
	}

	consume := models.Consume{}

	if err := models.Db().First(&consume, param.ID).Error; err != nil {
		util.SetError(ctx, http.StatusNotFound, err.Error())
		return
	}
	ctx.JSON(http.StatusOK, &consume)
}

//GetAllConsume consumes
func GetAllConsume(ctx *gin.Context) {
	consumes := []models.Consume{}
	models.Db().Find(&consumes)
	ctx.JSON(http.StatusOK, gin.H{
		"consumes": consumes,
	})
}
