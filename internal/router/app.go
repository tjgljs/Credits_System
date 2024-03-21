package router

import (
	_ "getcharzp.cn/docs"
	"getcharzp.cn/middlewares"
	"getcharzp.cn/service"
	"github.com/gin-gonic/gin"
	swaggerfiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

func Router() *gin.Engine {
	r := gin.Default()
	r.Use(middlewares.Cors())

	// Swagger 配置
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerfiles.Handler))

	// 用户
	r.GET("/user-detail", service.GetUserDetail)
	r.POST("/login", service.Login)
	r.POST("/send-code", service.SendCode)
	r.POST("/register", service.Register)

	// 管理员私有方法
	authAdmin := r.Group("/admin", middlewares.AuthAdminCheck())
	//authAdmin := r.Group("/admin")

	authAdmin.POST("/add_teacher", service.AddTeacher)
	authAdmin.POST("/remove_teacher", service.RemoveTeacher)

	//顶级管理员的私有方法
	authTopAdmin := r.Group("/topAdmin", middlewares.AuthTopAdminCheck())
	authTopAdmin.POST("add_admin", service.AddAdmin)
	authTopAdmin.POST("remove_admin", service.RemoveAdmin)

	return r
}
