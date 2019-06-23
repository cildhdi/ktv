package api

import (
	"ktv/models"
	"ktv/util"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
	uuid "github.com/satori/go.uuid"
)

type loginParam struct {
	Username string `json:"Username" binding:"required"`
	Password string `json:"Password" binding:"required"`
}

//Login login
func Login(ctx *gin.Context) {
	param := loginParam{}
	if err := ctx.ShouldBindBodyWith(&param, binding.JSON); err != nil {
		util.SetError(ctx, http.StatusInternalServerError, err.Error())
		return
	}

	user := models.User{}
	models.Db().First(&user, "login_name = ?", param.Username)
	if user.ID == 0 || user.Password != param.Password {
		util.SetError(ctx, http.StatusUnauthorized, "incorrect username or password")
		return
	}

	token, err := uuid.NewV4()
	if err != nil {
		util.SetError(ctx, http.StatusInternalServerError, err.Error())
		return
	}

	user.Token = token.String()
	models.Db().Save(&user)

	ctx.SetCookie("token", user.Token, 0, "", "localhost", false, true)
	ctx.JSON(http.StatusOK, user)
}
