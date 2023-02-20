package main

import (
	"fmt"
	"hallo-corona-be/database"
	"hallo-corona-be/pkg/mysql"
	"hallo-corona-be/routes"
	"net/http"
	"os"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
)

func main() {

	// env
    errEnv := godotenv.Load()
    if errEnv != nil {
      panic("Failed to load env file")
    } else {
		fmt.Println("Env success loaded.")
	}

	// initial DB
	mysql.DatabaseInit()

	// run migration
	database.RunMigration()
	
	r := mux.NewRouter()

	routes.RouteInit(r.PathPrefix("/api/v1").Subrouter())

	r.PathPrefix("/uploads").Handler(http.StripPrefix("/uploads/", http.FileServer(http.Dir("./uploads"))))

	var AllowedHeaders = handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type", "Authorization"})
	var AllowedMethods = handlers.AllowedMethods([]string{"GET", "POST", "PUT", "HEAD", "OPTIONS", "PATCH", "DELETE"})
	var AllowedOrigins = handlers.AllowedOrigins([]string{"*"})
	

	var port = os.Getenv("PORT")
	fmt.Println("Server running on localhost port:"+port)
	http.ListenAndServe("localhost:"+port, handlers.CORS(AllowedHeaders, AllowedMethods, AllowedOrigins)(r))
}