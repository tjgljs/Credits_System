package models

import (
	"gorm.io/gorm"
)

type UserBasic struct {
	ID         uint           `gorm:"primarykey;" json:"id"`
	CreatedAt  MyTime         `gorm:"type:timestamp;" json:"created_at"`
	UpdatedAt  MyTime         `json:"updated_at"`
	DeletedAt  gorm.DeletedAt `gorm:"index;" json:"deleted_at"`
	Identity   string         `gorm:"column:identity;type:varchar(36);" json:"identity"`        // 用户的唯一标识
	Name       string         `gorm:"column:name;type:varchar(100);" json:"name"`               // 用户名
	Password   string         `gorm:"column:password;type:varchar(32);" json:"-"`               // 密码
	Phone      string         `gorm:"column:phone;type:varchar(20);" json:"phone"`              // 手机号
	Mail       string         `gorm:"column:mail;type:varchar(100);" json:"mail"`               // 邮箱
	PrivateKey string         `gorm:"column:private_key;type:varchar(100);" json:"private_key"` // 私钥
	PublicKey  string         `gorm:"column:public_key;type:varchar(100);" json:"public_key"`   // 公钥
	IsTeacher  int            `gorm:"column:is_teacher;type:tinyint(1);" json:"is_teacher"`     // 是否老师【0-否，1-是】
	IsAdmin    int            `gorm:"column:is_admin;type:tinyint(1);" json:"is_admin"`         // 是否是管理员【0-否，1-是】
	IsTop      int            `gorm:"column:is_top;type:tinyint(1);" json:"is_top"`             // 是否是顶级管理员【0-否，1-是】

}

func (table *UserBasic) TableName() string {
	return "user_basic"
}
