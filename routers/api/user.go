package api

import (
	"ktv/models"
	"ktv/util"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
	uuid "github.com/satori/go.uuid"
)

type addUserParam struct {
	LoginName string `json:"LoginName" binding:"required"`
	Password  string `json:"Password" binding:"required"`
	Depart    int    `json:"Depart" binding:"required"`
	Sex       uint   `json:"Sex" binding:"required"`
	UserName  string `json:"UserName" binding:"required"`
	Tel       string `json:"Tel" binding:"required"`
}

//CreateUser add
func CreateUser(ctx *gin.Context) {
	param := addUserParam{}
	if err := ctx.ShouldBindBodyWith(&param, binding.JSON); err != nil {
		util.SetError(ctx, http.StatusInternalServerError, err.Error())
		return
	}

	token, err := uuid.NewV4()
	if err != nil {
		util.SetError(ctx, http.StatusInternalServerError, err.Error())
		return
	}

	user := models.User{
		LoginName: param.LoginName,
		Password:  param.Password,
		Depart:    param.Depart,
		Sex:       param.Sex,
		UserName:  param.UserName,
		Tel:       param.Tel,
		Token:     token.String(),
	}

	if err := models.Db().Create(&user).Error; err != nil {
		util.SetError(ctx, http.StatusInternalServerError, err.Error())
	} else {
		ctx.JSON(http.StatusOK, user)
	}
	return
}

type updateUserParam struct {
	addUserParam
	idParam
}

//UpdateUser  update
func UpdateUser(ctx *gin.Context) {
	param := updateUserParam{}
	if err := ctx.ShouldBindBodyWith(&param, binding.JSON); err != nil {
		util.SetError(ctx, http.StatusInternalServerError, err.Error())
		return
	}

	user := models.User{}
	if err := models.Db().First(&user, param.ID).Error; err != nil {
		util.SetError(ctx, http.StatusNotFound, err.Error())
		return
	}

	user.LoginName = param.LoginName
	user.Password = param.Password
	user.Depart = param.Depart
	user.Sex = param.Sex
	user.UserName = param.UserName
	user.Tel = param.Tel

	if err := models.Db().Save(&user).Error; err != nil {
		util.SetError(ctx, http.StatusInternalServerError, err.Error())
	} else {
		ctx.JSON(http.StatusOK, &user)
	}
}

//DeteleUser delete
func DeteleUser(ctx *gin.Context) {
	param := idParam{}
	if err := ctx.ShouldBindBodyWith(&param, binding.JSON); err != nil {
		util.SetError(ctx, http.StatusInternalServerError, err.Error())
		return
	}

	user := models.User{}
	if err := models.Db().First(&user, param.ID).Error; err != nil {
		util.SetError(ctx, http.StatusNotFound, err.Error())
		return
	}
	models.Db().Delete(&user)
	ctx.JSON(http.StatusOK, &user)
}

//GetUser get
func GetUser(ctx *gin.Context) {
	param := idParam{}
	if err := ctx.ShouldBindBodyWith(&param, binding.JSON); err != nil {
		util.SetError(ctx, http.StatusInternalServerError, err.Error())
		return
	}

	user := models.User{}

	if err := models.Db().First(&user, param.ID).Error; err != nil {
		util.SetError(ctx, http.StatusNotFound, err.Error())
		return
	}
	ctx.JSON(http.StatusOK, &user)
}

//GetAllUser users
func GetAllUser(ctx *gin.Context) {
	users := []models.User{}
	models.Db().Find(&users)
	ctx.JSON(http.StatusOK, gin.H{
		"users": users,
	})
}
