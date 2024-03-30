package service

import (
	"fmt"
	"log"
	"net/http"
	"strconv"
	"time"

	"getcharzp.cn/helper"
	"getcharzp.cn/models"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// AddTeacher 根据钱包地址将用户标记为管理员
// @Tags 顶级管理员私有方法
// @Summary 添加管理员

func AddAdmin(c *gin.Context) {
	adminWallet := c.PostForm("adminWallet")

	if adminWallet == "" {

		c.JSON(http.StatusOK, gin.H{

			"code": -1,

			"msg": "钱包地址不能为空",
		})
		return
	}

	user := new(models.UserBasic)

	result := models.DB.Where("public_key = ?", adminWallet).First(&user)

	fmt.Printf("user: %v\n", user)

	if result.Error == gorm.ErrRecordNotFound {
		c.JSON(http.StatusOK, gin.H{
			"code": -1,
			"msg":  "找不到对应的用户",
		})
		return
	}

	if user.IsAdmin == 1 {
		c.JSON(http.StatusOK, gin.H{
			"code": -1,
			"msg":  "用户已经是管理员",
		})
		return
	}

	// 更新用户为管理员
	result = models.DB.Model(&user).Update("is_admin", 1)
	fmt.Printf("result: %v\n", result)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{

			"code": -1,
			"msg":  "更新管理员状态失败",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"code": 0,
		"msg":  "用户成功标记为管理员",
	})
}

// RemoveTeacher
// @Tags 顶级管理员私有方法
// @Summary 移除管理员

func RemoveAdmin(c *gin.Context) {
	adminWallet := c.PostForm("adminWallet")
	if adminWallet == "" {
		c.JSON(http.StatusOK, gin.H{
			"code": -1,
			"msg":  "钱包地址不能为空",
		})
		return
	}

	user := new(models.UserBasic)
	result := models.DB.Where("public_key = ?", adminWallet).First(&user)

	if result.Error == gorm.ErrRecordNotFound {
		c.JSON(http.StatusOK, gin.H{
			"code": -1,
			"msg":  "找不到对应的用户",
		})
		return
	}

	if user.IsAdmin == 0 {
		c.JSON(http.StatusOK, gin.H{
			"code": -1,
			"msg":  "用户不是管理员",
		})
		return
	}

	// 更新用户为管理员
	result = models.DB.Model(&user).Update("is_admin", 0)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"code": -1,
			"msg":  "更新管理员状态失败",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"code": 0,
		"msg":  "用户成功移除管理员身份",
	})
}

// AddTeacher 根据钱包地址将用户标记为教师
// @Tags 管理员私有方法
// @Summary 添加老师

func AddTeacher(c *gin.Context) {
	teacherWallet := c.PostForm("teacherWallet")

	if teacherWallet == "" {

		c.JSON(http.StatusOK, gin.H{

			"code": -1,
			"msg":  "钱包地址不能为空",
		})
		return
	}

	user := new(models.UserBasic)

	result := models.DB.Where("public_key = ?", teacherWallet).First(&user)

	fmt.Printf("user: %v\n", user)

	if result.Error == gorm.ErrRecordNotFound {
		c.JSON(http.StatusOK, gin.H{
			"code": -1,
			"msg":  "找不到对应的用户",
		})
		return
	}

	if user.IsTeacher == 1 {
		c.JSON(http.StatusOK, gin.H{
			"code": -1,
			"msg":  "用户已经是老师",
		})
		return
	}

	// 更新用户为教师
	result = models.DB.Model(&user).Update("is_teacher", 1)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{

			"code": -1,
			"msg":  "更新教师状态失败",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"code": 0,
		"msg":  "用户成功标记为教师",
	})
}

// RemoveTeacher
// @Tags 管理员私有方法
// @Summary 移除老师

func RemoveTeacher(c *gin.Context) {
	teacherWallet := c.PostForm("teacherWallet")
	if teacherWallet == "" {
		c.JSON(http.StatusOK, gin.H{
			"code": -1,
			"msg":  "钱包地址不能为空",
		})
		return
	}

	user := new(models.UserBasic)
	result := models.DB.Where("public_key = ?", teacherWallet).First(&user)

	if result.Error == gorm.ErrRecordNotFound {
		c.JSON(http.StatusOK, gin.H{
			"code": -1,
			"msg":  "找不到对应的用户",
		})
		return
	}

	if user.IsTeacher == 0 {
		c.JSON(http.StatusOK, gin.H{
			"code": -1,
			"msg":  "用户不是老师",
		})
		return
	}

	// 更新用户为教师
	result = models.DB.Model(&user).Update("is_teacher", 0)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"code": -1,
			"msg":  "更新教师状态失败",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"code": 0,
		"msg":  "用户成功移除教师身份",
	})
}

// GetUserDetail
// @Tags 公共方法
// @Summary 用户详情
// @Param publicKey query string false "publicKey"
// @Success 200 {string} json "{"code":"200","data":""}"
// @Router /user-detail [get]
func GetUserDetail(c *gin.Context) {
	publicKey := c.Query("publicKey")
	if publicKey == "" {
		c.JSON(http.StatusOK, gin.H{
			"code": -1,
			"msg":  "用户钱包地址不能为空",
		})
		return
	}
	data := new(models.UserBasic)
	err := models.DB.Omit("password").Where("public_key = ? ", publicKey).Find(&data).Error
	if err != nil {
		c.JSON(http.StatusOK, gin.H{
			"code": -1,
			"msg":  "Get User Detail By publicKey:" + publicKey + " Error:" + err.Error(),
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"code": 200,
		"data": data,
	})
}

func IsUser(c *gin.Context) {
	publicKey := c.Query("publicKey")
	if publicKey == "" {
		c.JSON(http.StatusOK, gin.H{
			"code": -1,
			"msg":  "用户钱包地址不能为空",
		})
		return
	}

	var count int64
	err := models.DB.Model(&models.UserBasic{}).Where("public_key = ?", publicKey).Count(&count).Error
	if err != nil {
		c.JSON(http.StatusOK, gin.H{
			"code": -1,
			"msg":  "查询用户详情时发生错误: " + err.Error(),
		})
		return
	}

	if count == 0 {
		c.JSON(http.StatusOK, gin.H{
			"code": -1,
			"msg":  "用户不存在",
		})
	} else {
		c.JSON(http.StatusOK, gin.H{
			"code": 200,
			"msg":  "用户存在",
		})
	}
}

// Login
// @Tags 公共方法
// @Summary 用户登录
// @Param username formData string false "username"
// @Param password formData string false "password"
// @Success 200 {string} json "{"code":"200","data":""}"
// @Router /login [post]
func Login(c *gin.Context) {
	username := c.PostForm("username")
	password := c.PostForm("password")
	if username == "" || password == "" {
		c.JSON(http.StatusOK, gin.H{
			"code": -1,
			"msg":  "必填信息为空",
		})
		return
	}
	password = helper.GetMd5(password)

	data := new(models.UserBasic)
	err := models.DB.Where("name = ? AND password = ? ", username, password).First(&data).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusOK, gin.H{
				"code": -1,
				"msg":  "用户名或密码错误",
			})
			return
		}
		c.JSON(http.StatusOK, gin.H{
			"code": -1,
			"msg":  "Get UserBasic Error:" + err.Error(),
		})
		return
	}
	fmt.Printf("data: %v\n", data.IsAdmin)

	token, err := helper.GenerateToken(data.Identity, data.Name, data.IsAdmin, data.IsTeacher, data.IsTop, data.IsMechanism, data.IsStudent)
	if err != nil {
		c.JSON(http.StatusOK, gin.H{
			"code": -1,
			"msg":  "GenerateToken Error:" + err.Error(),
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"code": 200,
		"data": map[string]interface{}{
			"token":        token,
			"is_admin":     data.IsAdmin,
			"is_teacher":   data.IsTeacher,
			"is_top":       data.IsTop,
			"is_mechanism": data.IsMechanism,
			"is_student":   data.IsStudent,
		},
		"msg": "恭喜你 登录成功",
	})
}

// SendCode
// @Tags 公共方法
// @Summary 发送验证码
// @Param email formData string true "email"
// @Success 200 {string} json "{"code":"200","data":""}"
// @Router /send-code [post]
func SendCode(c *gin.Context) {
	email := c.PostForm("email")
	if email == "" {
		c.JSON(http.StatusOK, gin.H{
			"code": -1,
			"msg":  "参数不正确",
		})
		return
	}
	code := helper.GetRand()
	models.RDB.Set(c, email, code, time.Second*300)
	err := helper.SendCode(email, code)
	if err != nil {
		c.JSON(http.StatusOK, gin.H{
			"code": -1,
			"msg":  "Send Code Error:" + err.Error(),
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"code": 200,
		"msg":  "验证码发送成功",
	})
}

// Register
// @Tags 公共方法
// @Summary 用户注册
// @Param mail formData string true "mail"
// @Param code formData string true "code"
// @Param name formData string true "name"
// @Param password formData string true "password"
// @Param phone formData string false "phone"
// @Success 200 {string} json "{"code":"200","data":""}"
// @Router /register [post]
func Register(c *gin.Context) {
	mail := c.PostForm("mail")
	userCode := c.PostForm("code")
	name := c.PostForm("name")
	password := c.PostForm("password")
	phone := c.PostForm("phone")
	IsMechanism := c.PostForm("IsMechanism")
	IsStudent := c.PostForm("IsStudent")

	newIsMechanism, err1 := strconv.Atoi(IsMechanism)
	fmt.Printf("IsMechanism: %v\n", IsMechanism)
	newIsStudent, err2 := strconv.Atoi(IsStudent)
	fmt.Printf("IsStudent: %v\n", IsStudent)

	if err1 != nil {
		log.Printf("Get Code Error:%v \n", err1)
		c.JSON(http.StatusOK, gin.H{
			"code": -1,
			"msg":  "系统错误",
		})
		return
	}

	if err2 != nil {
		log.Printf("Get Code Error:%v \n", err2)
		c.JSON(http.StatusOK, gin.H{
			"code": -1,
			"msg":  "系统错误",
		})
		return
	}

	if mail == "" || userCode == "" || name == "" || password == "" || IsMechanism == "" || IsStudent == "" {
		c.JSON(http.StatusOK, gin.H{
			"code": -1,
			"msg":  "参数不正确",
		})
		return
	}
	// 验证验证码是否正确
	sysCode, err := models.RDB.Get(c, mail).Result()
	if err != nil {
		log.Printf("Get Code Error:%v \n", err)
		c.JSON(http.StatusOK, gin.H{
			"code": -1,
			"msg":  "验证码不正确，请重新获取验证码",
		})
		return
	}
	if sysCode != userCode {
		c.JSON(http.StatusOK, gin.H{
			"code": -1,
			"msg":  "验证码不正确",
		})
		return
	}
	// 判断邮箱是否已存在
	var cnt int64
	err = models.DB.Where("mail = ?", mail).Model(new(models.UserBasic)).Count(&cnt).Error
	if err != nil {
		c.JSON(http.StatusOK, gin.H{
			"code": -1,
			"msg":  "Get User Error:" + err.Error(),
		})
		return
	}
	if cnt > 0 {
		c.JSON(http.StatusOK, gin.H{
			"code": -1,
			"msg":  "该邮箱已被注册",
		})
		return
	}

	// 数据的插入
	userIdentity := helper.GetUUID()
	privateKey, walletAddress := helper.CreatePrivateKey()
	data := &models.UserBasic{
		Identity:    userIdentity,
		Name:        name,
		Password:    helper.GetMd5(password),
		Phone:       phone,
		Mail:        mail,
		PrivateKey:  privateKey,
		PublicKey:   walletAddress,
		IsMechanism: newIsMechanism,
		IsStudent:   newIsStudent,
		CreatedAt:   models.MyTime(time.Now()),
		UpdatedAt:   models.MyTime(time.Now()),
	}
	fmt.Printf("data: %v\n", &data)
	err = models.DB.Create(data).Error
	if err != nil {
		c.JSON(http.StatusOK, gin.H{
			"code": -1,
			"msg":  "Crete User Error:" + err.Error(),
		})
		return
	}

	// 生成 token
	token, err := helper.GenerateToken(userIdentity, name, data.IsAdmin, data.IsTeacher, data.IsTop, data.IsMechanism, data.IsStudent)
	if err != nil {
		c.JSON(http.StatusOK, gin.H{
			"code": -1,
			"msg":  "Generate Token Error:" + err.Error(),
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"code": 200,
		"data": map[string]interface{}{
			"token":      token,
			"privateKey": privateKey,
		},
		"msg": "注册成功",
	})
}
