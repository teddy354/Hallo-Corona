package routes

import (
	"hallo-corona-be/handlers"
	"hallo-corona-be/pkg/middleware"
	"hallo-corona-be/pkg/mysql"
	"hallo-corona-be/repositories"

	"github.com/gorilla/mux"
)

func UserRoutes(r *mux.Router) {
	userRepository := repositories.RepositoryUser(mysql.DB)
	h := handlers.HandlerUser(userRepository)

	r.HandleFunc("/users", middleware.Auth(h.FindUsers)).Methods("GET")
	r.HandleFunc("/user/{id}", h.GetUser).Methods("GET")
	r.HandleFunc("/user", middleware.Auth(h.CreateUser)).Methods("POST")
	r.HandleFunc("/user/{id}", middleware.Auth(h.UpdateUser)).Methods("PATCH")
	r.HandleFunc("/user/{id}", middleware.Auth(h.DeleteUser)).Methods("DELETE")
	// r.HandleFunc("/user/{id}/ChangeImage", middleware.UploadFile(h.ChangeImage)).Methods("PATCH")
	r.HandleFunc("/change-image/{id}", middleware.UploadFile(h.ChangeImage)).Methods("PATCH")
}
