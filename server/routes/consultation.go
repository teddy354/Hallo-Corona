package routes

import (
	"hallo-corona-be/handlers"
	"hallo-corona-be/pkg/middleware"
	"hallo-corona-be/pkg/mysql"
	"hallo-corona-be/repositories"

	"github.com/gorilla/mux"
)

func ConsultationRoutes(r *mux.Router) {
	consultationRepository := repositories.RepositoryConsultation(mysql.DB)
	h := handlers.HandlerConsultation(consultationRepository)

	r.HandleFunc("/consultations", middleware.Auth(h.FindConsultations)).Methods("GET")
	r.HandleFunc("/consultation/{id}", middleware.Auth(h.GetConsultation)).Methods("GET")
	r.HandleFunc("/consultation", middleware.Auth(h.CreateConsultation)).Methods("POST")
	r.HandleFunc("/consultation/{id}", middleware.Auth(h.UpdateConsultation)).Methods("PATCH")
	r.HandleFunc("/consultation/{id}", middleware.Auth(h.DeleteConsultation)).Methods("DELETE")
}
