package models

import (
	"fmt"

	"github.com/go-redis/redis/v8"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB = Init()

var RDB = InitRedisDB()

func Init() *gorm.DB {
	dsn := "root:123456789@tcp(127.0.0.1:3306)/credits?charset=utf8mb4&parseTime=True&loc=Local"
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		fmt.Printf("err: %v\n", err)
	}
	return db
}

func InitRedisDB() *redis.Client {
	return redis.NewClient(&redis.Options{
		Addr:     "192.168.1.54:6379",
		Password: "", // no password set
		DB:       0,  // use default DB
	})
}
