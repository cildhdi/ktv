package api

import (
	"ktv/models"
	"ktv/util"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
)

type addDrinkParam struct {
	Name  string  `json:"Name" binding:"required"`
	Price float32 `json:"Price" binding:"required"`
	Stock uint    `json:"Stock" binding:"required"`
}

//CreateDrink drink add
func CreateDrink(ctx *gin.Context) {
	param := addDrinkParam{}
	if err := ctx.ShouldBindBodyWith(&param, binding.JSON); err != nil {
		util.SetError(ctx, http.StatusInternalServerError, err.Error())
		return
	}

	drink := models.Drink{
		Name:  param.Name,
		Price: param.Price,
		Stock: param.Stock,
	}

	if err := models.Db().Create(&drink).Error; err != nil {
		util.SetError(ctx, http.StatusInternalServerError, err.Error())
	} else {
		ctx.JSON(http.StatusOK, drink)
	}
	return
}

type updateDrinkParam struct {
	addDrinkParam
	idParam
}

//UpdateDrink Drink update
func UpdateDrink(ctx *gin.Context) {
	param := updateDrinkParam{}
	if err := ctx.ShouldBindBodyWith(&param, binding.JSON); err != nil {
		util.SetError(ctx, http.StatusInternalServerError, err.Error())
		return
	}

	drink := models.Drink{}
	if err := models.Db().First(&drink, param.ID).Error; err != nil {
		util.SetError(ctx, http.StatusNotFound, err.Error())
		return
	}

	drink.Name = param.Name
	drink.Price = param.Price
	drink.Stock = param.Stock

	models.Db().Save(&drink)
	ctx.JSON(http.StatusOK, &drink)
}

//DeteleDrink Drink delete
func DeteleDrink(ctx *gin.Context) {
	param := idParam{}
	if err := ctx.ShouldBindBodyWith(&param, binding.JSON); err != nil {
		util.SetError(ctx, http.StatusInternalServerError, err.Error())
		return
	}

	drink := models.Drink{}
	if err := models.Db().First(&drink, param.ID).Error; err != nil {
		util.SetError(ctx, http.StatusNotFound, err.Error())
		return
	}
	models.Db().Delete(&drink)
	ctx.JSON(http.StatusOK, &drink)
}

//GetDrink drink get
func GetDrink(ctx *gin.Context) {
	param := idParam{}
	if err := ctx.ShouldBindBodyWith(&param, binding.JSON); err != nil {
		util.SetError(ctx, http.StatusInternalServerError, err.Error())
		return
	}

	drink := models.Drink{}
	if err := models.Db().First(&drink, param.ID).Error; err != nil {
		util.SetError(ctx, http.StatusNotFound, err.Error())
		return
	}
	ctx.JSON(http.StatusOK, &drink)
}

//GetAllDrink drinks
func GetAllDrink(ctx *gin.Context) {
	drinks := []models.Drink{}
	models.Db().Find(&drinks)
	ctx.JSON(http.StatusOK, gin.H{
		"drinks": drinks,
	})
}
