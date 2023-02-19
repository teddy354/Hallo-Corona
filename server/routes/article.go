package routes

import (
	"hallo-corona-be/handlers"
	"hallo-corona-be/pkg/middleware"
	"hallo-corona-be/pkg/mysql"
	"hallo-corona-be/repositories"

	"github.com/gorilla/mux"
)

func ArticleRoutes(r *mux.Router) {
	articleRepository := repositories.RepositoryArticle(mysql.DB)
	h := handlers.HandlerArticle(articleRepository)

	r.HandleFunc("/articles", h.FindArticles).Methods("GET")
	r.HandleFunc("/article/{id}", h.GetArticle).Methods("GET")
	r.HandleFunc("/article", middleware.Auth(middleware.UploadFile(h.CreateArticle))).Methods("POST")
	r.HandleFunc("/article/{id}", middleware.Auth(middleware.UploadFile(h.UpdateArticle))).Methods("PATCH")
	r.HandleFunc("/article/{id}", middleware.Auth(h.DeleteArticle)).Methods("DELETE")
}
