package test

import (
	"context"
	"fmt"
	"testing"
	"time"

	"getcharzp.cn/models"
	"github.com/go-redis/redis/v8"
)

var ctx = context.Background()

var rdb = redis.NewClient(&redis.Options{
	Addr:     "192.168.1.54:6379",
	Password: "", // no password set
	DB:       0,  // use default DB
})

func TestRedisSet(t *testing.T) {
	rdb.Set(ctx, "name", "mmc", time.Second*10)
}

func TestRedisGet(t *testing.T) {
	v, err := rdb.Get(ctx, "name").Result()
	if err != nil {
		t.Fatal(err)
	}
	fmt.Println(v)
}

func TestRedisGetByModels(t *testing.T) {
	v, err := models.RDB.Get(ctx, "name").Result()
	if err != nil {
		t.Fatal(err)
	}
	fmt.Println(v)
}
