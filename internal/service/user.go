package service

import (
	"fmt"
	"log"
	"net/http"
	"time"

	"getcharzp.cn/helper"
	"getcharzp.cn/models"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// AddTeacher 根据钱包地址将用户标记为教师
// @Tags 管理员私有方法
// @Summary 移除老师

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
			"msg":  "用户唯一标识不能为空",
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

	token, err := helper.GenerateToken(data.Identity, data.Name, data.IsAdmin, data.IsTeacher)
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
			"token":      token,
			"is_admin":   data.IsAdmin,
			"is_teacher": data.IsTeacher,
			"is_top":     data.IsTop,
		},
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
	if mail == "" || userCode == "" || name == "" || password == "" {
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
		Identity:   userIdentity,
		Name:       name,
		Password:   helper.GetMd5(password),
		Phone:      phone,
		Mail:       mail,
		PrivateKey: privateKey,
		PublicKey:  walletAddress,
		CreatedAt:  models.MyTime(time.Now()),
		UpdatedAt:  models.MyTime(time.Now()),
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
	token, err := helper.GenerateToken(userIdentity, name, data.IsAdmin, data.IsTeacher)
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
			"token": token,
		},
	})
}
