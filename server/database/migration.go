package database

import (
	"fmt"
	"hallo-corona-be/models"
	"hallo-corona-be/pkg/mysql"
)

func RunMigration() {
	err := mysql.DB.AutoMigrate(
		&models.User{},
		&models.Article{},
		&models.Consultation{},
	)

	if err != nil {
		fmt.Println(err)
		panic("Migration Failed")
	}

	fmt.Println("Migration Success")
}
