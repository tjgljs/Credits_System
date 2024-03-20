package test

import (
	"fmt"
	"net/smtp"
	"testing"

	"github.com/jordan-wright/email"
)

func TestSendEmail(t *testing.T) {
	e := email.NewEmail()
	e.From = "Cowhorse<1539994641@qq.com>"
	e.To = []string{"1539994641@qq.com"}
	e.Subject = "验证码已发送，请查收"
	e.HTML = []byte("您的验证码：<b>" + "ddd" + "</b>")
	// 返回 EOF 时，关闭SSL重试
	err := e.Send("smtp.qq.com:587",
		smtp.PlainAuth("", "1539994641@qq.com", "bxnosulklsqkiief", "smtp.qq.com"))
	if err != nil {
		fmt.Printf("err: %v\n", err)
	}

}
