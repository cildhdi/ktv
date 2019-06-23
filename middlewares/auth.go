package middlewares

import (
	"ktv/models"
	"ktv/util"
	"net/http"

	"github.com/gin-gonic/gin"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		token, err := ctx.Cookie("token")
		if err != nil {
			util.SetError(ctx, http.StatusUnauthorized, err.Error())
		}

		var user models.User
		models.Db().First(&user, "token = ?", token)

		if user.ID == 0 {
			util.SetError(ctx, http.StatusUnauthorized, "no such user")
			return
		}
		ctx.Set("user", user)
		ctx.Next()
	}
}
