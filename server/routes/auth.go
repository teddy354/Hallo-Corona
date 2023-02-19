package routes

import (
	"hallo-corona-be/handlers"
	"hallo-corona-be/pkg/middleware"
	"hallo-corona-be/pkg/mysql"
	"hallo-corona-be/repositories"

	"github.com/gorilla/mux"
)

func AuthRoutes(r *mux.Router) {
  userRepository := repositories.RepositoryUser(mysql.DB)
  h := handlers.HandlerAuth(userRepository)

  r.HandleFunc("/register", h.Register).Methods("POST")
  r.HandleFunc("/login", h.Login).Methods("POST")
  r.HandleFunc("/check-auth", middleware.Auth(h.CheckAuth)).Methods("GET")
}