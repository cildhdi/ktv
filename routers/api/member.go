package api

import (
	"ktv/models"
	"ktv/util"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
)

type addMemberParam struct {
	Name     string  `json:"Name" binding:"required"`
	Tel      string  `json:"Tel" binding:"required"`
	Cumcon   uint    `json:"Cumcon" binding:"required"`
	Sex      uint    `json:"Sex" binding:"required"`
	Discount float64 `json:"Discount" binding:"required"`
}

//CreateMember  add
func CreateMember(ctx *gin.Context) {
	param := addMemberParam{}
	if err := ctx.ShouldBindBodyWith(&param, binding.JSON); err != nil {
		util.SetError(ctx, http.StatusInternalServerError, err.Error())
		return
	}

	member := models.Member{
		Name:     param.Name,
		Tel:      param.Tel,
		Cumcon:   param.Cumcon,
		Sex:      param.Sex,
		Discount: param.Discount,
	}

	if err := models.Db().Create(&member).Error; err != nil {
		util.SetError(ctx, http.StatusInternalServerError, err.Error())
	} else {
		ctx.JSON(http.StatusOK, member)
	}
	return
}

type updateMemberParam struct {
	addMemberParam
	idParam
}

//UpdateMember  update
func UpdateMember(ctx *gin.Context) {
	param := updateMemberParam{}
	if err := ctx.ShouldBindBodyWith(&param, binding.JSON); err != nil {
		util.SetError(ctx, http.StatusInternalServerError, err.Error())
		return
	}

	member := models.Member{}
	if err := models.Db().First(&member, param.ID).Error; err != nil {
		util.SetError(ctx, http.StatusNotFound, err.Error())
		return
	}

	member.Name = param.Name
	member.Tel = param.Tel
	member.Cumcon = param.Cumcon
	member.Sex = param.Sex
	member.Discount = param.Discount

	models.Db().Save(&member)
	ctx.JSON(http.StatusOK, &member)
}

//DeteleMember delete
func DeteleMember(ctx *gin.Context) {
	param := idParam{}
	if err := ctx.ShouldBindBodyWith(&param, binding.JSON); err != nil {
		util.SetError(ctx, http.StatusInternalServerError, err.Error())
		return
	}

	member := models.Member{}
	if err := models.Db().First(&member, param.ID).Error; err != nil {
		util.SetError(ctx, http.StatusNotFound, err.Error())
		return
	}
	models.Db().Delete(&member)
	ctx.JSON(http.StatusOK, &member)
}

//GetMember  get
func GetMember(ctx *gin.Context) {
	param := idParam{}
	if err := ctx.ShouldBindBodyWith(&param, binding.JSON); err != nil {
		util.SetError(ctx, http.StatusInternalServerError, err.Error())
		return
	}

	member := models.Member{}
	if err := models.Db().First(&member, param.ID).Error; err != nil {
		util.SetError(ctx, http.StatusNotFound, err.Error())
		return
	}
	ctx.JSON(http.StatusOK, &member)
}

//GetAllMember Members
func GetAllMember(ctx *gin.Context) {
	members := []models.Member{}
	models.Db().Find(&members)
	ctx.JSON(http.StatusOK, gin.H{
		"members": members,
	})
}
