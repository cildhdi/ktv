package util

import (
	"github.com/gin-gonic/gin"
)

//HTTPError 错误
type HTTPError struct {
	Code int    `json:"code"`
	Msg  string `json:"msg"`
}

//SetError 设置标准错误结构
func SetError(ctx *gin.Context, statusCode int, err string) {
	ctx.AbortWithStatusJSON(statusCode, HTTPError{
		Code: statusCode,
		Msg:  err,
	})
}
