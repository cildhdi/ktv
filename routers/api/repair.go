package api

import (
	"ktv/models"
	"ktv/util"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
)

type addRepairParam struct {
	BoxID  uint   `json:"BoxID" binding:"required"`
	Reason string `json:"Reason"  binding:"required"`
}

//CreateRepair add
func CreateRepair(ctx *gin.Context) {
	param := addRepairParam{}
	if err := ctx.ShouldBindBodyWith(&param, binding.JSON); err != nil {
		util.SetError(ctx, http.StatusInternalServerError, err.Error())
		return
	}
	
	repair := models.Repair{
		BoxID:  param.BoxID,
		Reason: param.Reason,
		Date:   time.Now(),
		UserID: 1,
	}

	if err := models.Db().Create(&repair).Error; err != nil {
		util.SetError(ctx, http.StatusInternalServerError, err.Error())
	} else {
		ctx.JSON(http.StatusOK, repair)
	}
	return
}

//DeteleRepair delete
func DeteleRepair(ctx *gin.Context) {
	param := idParam{}
	if err := ctx.ShouldBindBodyWith(&param, binding.JSON); err != nil {
		util.SetError(ctx, http.StatusInternalServerError, err.Error())
		return
	}

	repair := models.Repair{}
	if err := models.Db().First(&repair, param.ID).Error; err != nil {
		util.SetError(ctx, http.StatusNotFound, err.Error())
		return
	}
	models.Db().Delete(&repair)
	ctx.JSON(http.StatusOK, &repair)
}

//GetRepair get
func GetRepair(ctx *gin.Context) {
	param := idParam{}
	if err := ctx.ShouldBindBodyWith(&param, binding.JSON); err != nil {
		util.SetError(ctx, http.StatusInternalServerError, err.Error())
		return
	}

	repair := models.Repair{}
	if err := models.Db().First(&repair, param.ID).Error; err != nil {
		util.SetError(ctx, http.StatusNotFound, err.Error())
		return
	}
	ctx.JSON(http.StatusOK, &repair)
}

//GetAllRepair repairs
func GetAllRepair(ctx *gin.Context) {
	repairs := []models.Repair{}
	models.Db().Find(&repairs)
	ctx.JSON(http.StatusOK, gin.H{
		"repairs": repairs,
	})
}
