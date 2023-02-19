package handlers

import (
	"encoding/json"
	"fmt"
	consultationdto "hallo-corona-be/dto/consultation"
	dto "hallo-corona-be/dto/result"
	"hallo-corona-be/models"
	"hallo-corona-be/repositories"
	"log"
	"net/http"
	"os"
	"strconv"

	"github.com/go-playground/validator/v10"
	"github.com/golang-jwt/jwt/v4"
	"github.com/gorilla/mux"
	"gopkg.in/gomail.v2"
)

type handlerConsultation struct {
	ConsultationRepository repositories.ConsultationRepository
}

func HandlerConsultation(ConsultationRepository repositories.ConsultationRepository) *handlerConsultation {
	return &handlerConsultation{ConsultationRepository}
}

func (h *handlerConsultation) FindConsultations(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	consultations, err := h.ConsultationRepository.FindConsultations()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(err.Error())
	}

	w.WriteHeader(http.StatusOK)
	response := dto.SuccessResult{Code: http.StatusOK, Data: consultations}
	json.NewEncoder(w).Encode(response)
}

func (h *handlerConsultation) GetConsultation(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	id, _ := strconv.Atoi(mux.Vars(r)["id"])

	consultation, err := h.ConsultationRepository.GetConsultation(id)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		response := dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()}
		json.NewEncoder(w).Encode(response)
		return
	}

	w.WriteHeader(http.StatusOK)
	response := dto.SuccessResult{Code: http.StatusOK, Data: convertResponseConsultation(consultation)}
	json.NewEncoder(w).Encode(response)
}

func (h *handlerConsultation) CreateConsultation(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// get data user token
	userInfo := r.Context().Value("userInfo").(jwt.MapClaims)
	userId := int(userInfo["id"].(float64))

	request := new(consultationdto.CreateConsultationRequest)
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		response := dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()}
		json.NewEncoder(w).Encode(response)
		return
	}

	validation := validator.New()
	err := validation.Struct(request)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		response := dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()}
		json.NewEncoder(w).Encode(response)
		return
	}

	consultation := models.Consultation{
		Fullname:     request.Fullname,
		Phone: request.Phone,
		BornDate: request.BornDate,
		Age: request.Age,
		Height: request.Height,
		Weight: request.Weight,
		Gender: request.Gender,
		Subject: request.Subject,
		LiveConsul: request.LiveConsul,
		Desc: request.Desc,
		UserID: userId,
		User: models.UserResponse{},
		Status: "pending",
	}

	data, err := h.ConsultationRepository.CreateConsultation(consultation)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		response := dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()}
		json.NewEncoder(w).Encode(response)
	}

	w.WriteHeader(http.StatusOK)
	response := dto.SuccessResult{Code: http.StatusOK, Data: data}
	json.NewEncoder(w).Encode(response)
}

func (h *handlerConsultation) UpdateConsultation(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	request := new(consultationdto.UpdateConsultationRequest)
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		response := dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()}
		json.NewEncoder(w).Encode(response)
		return
	}

	id, _ := strconv.Atoi(mux.Vars(r)["id"])
	consultation, err := h.ConsultationRepository.GetConsultation(int(id))
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		response := dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()}
		json.NewEncoder(w).Encode(response)
		return
	}

	if request.Fullname != "" {
		consultation.Fullname = request.Fullname
	}

	if request.Phone != "" {
		consultation.Phone = request.Phone
	}

	if request.BornDate != "" {
		consultation.BornDate = request.BornDate
	}

	if request.Age != 0 {
		consultation.Age = request.Age
	}

	if request.Height != 0 {
		consultation.Height = request.Height
	}

	if request.Weight != 0 {
		consultation.Weight = request.Weight
	}

	if request.Gender != "" {
		consultation.Gender = request.Gender
	}

	if request.Subject != "" {
		consultation.Subject = request.Subject
	}

	if request.LiveConsul != "" {
		consultation.LiveConsul = request.LiveConsul
	}


	if request.Desc != "" {
		consultation.Desc = request.Desc
	}

	if request.Reply != "" {
		consultation.Reply = request.Reply
	}

	if request.Reply != "" {
		consultation.Status = "waiting"
	}

	if request.LinkLive != "" {
		consultation.LinkLive = request.LinkLive
	}


	if consultation.Status  == "waiting" {
		var CONFIG_SMTP_HOST = "smtp.gmail.com"
		var CONFIG_SMTP_PORT = 587
		var CONFIG_SENDER_NAME = "teddyadjip@gmail.com"
		var CONFIG_AUTH_EMAIL = os.Getenv("EMAIL_SYSTEM")
		var CONFIG_AUTH_PASSWORD = os.Getenv("PASSWORD_SYSTEM")
	
		var subject = consultation.Subject
		var link = consultation.LinkLive
	
		mailer := gomail.NewMessage()
		mailer.SetHeader("From", CONFIG_SENDER_NAME)
		mailer.SetHeader("To", consultation.User.Email)
		mailer.SetHeader("Subject", "Consultation Status")
		mailer.SetBody("text/html", fmt.Sprintf(`<!DOCTYPE html>
		<html lang="en">
		  <head>
		  <meta charset="UTF-8" />
		  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
		  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
		  <title>Document</title>
		  <style>
			h1 {
			color: brown;
			}
		  </style>
		  </head>
		  <body>
		  <h2>Hallo Corona, Reminder Your Consultation :</h2>
		  <ul style="list-style-type:none;">
			<li>Subject consultation : %s</li>
			<li>Link live consultation: %s</li>
			<li>Status : <b>%s</b></li>
		  </ul>
		  </body>
		</html>`, subject, link, consultation.Status))
	
		dialer := gomail.NewDialer(
		  CONFIG_SMTP_HOST,
		  CONFIG_SMTP_PORT,
		  CONFIG_AUTH_EMAIL,
		  CONFIG_AUTH_PASSWORD,
		)
	
		err := dialer.DialAndSend(mailer)
		if err != nil {
		  log.Fatal(err.Error())
		}
	
		log.Println("Mail sent! to " + consultation.User.Email)
	  }

	data, err := h.ConsultationRepository.UpdateConsultation(consultation)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		response := dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()}
		json.NewEncoder(w).Encode(response)
		return
	}

	w.WriteHeader(http.StatusOK)
	response := dto.SuccessResult{Code: http.StatusOK, Data: data}
	json.NewEncoder(w).Encode(response)
}

func (h *handlerConsultation) DeleteConsultation(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	id, _ := strconv.Atoi(mux.Vars(r)["id"])
	consultation, err := h.ConsultationRepository.GetConsultation(id)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		response := dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()}
		json.NewEncoder(w).Encode(response)
		return
	}

	data, err := h.ConsultationRepository.DeleteConsultation(consultation)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		response := dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()}
		json.NewEncoder(w).Encode(response)
		return
	}

	w.WriteHeader(http.StatusOK)
	response := dto.SuccessResult{Code: http.StatusOK, Data: convertResponseConsultation(data)}
	json.NewEncoder(w).Encode(response)
}

func convertResponseConsultation(u models.Consultation) consultationdto.ConsultationResponse {
	return consultationdto.ConsultationResponse{
		ID: u.ID,
		Fullname: u.Fullname,
		Phone: u.Phone,
		Age: u.Age,
		Height: u.Height,
		Weight: u.Weight,
		Gender: u.Gender,
		LiveConsul: u.LiveConsul,
		Desc: u.Desc,
		User: u.User,
		Subject: u.Subject,
		Status: u.Status,
		Reply: u.Reply,
		LinkLive: u.LinkLive,
		// Reservation: u.Reservation,
		CreatedAt: u.CreatedAt,
		UpdatedAt: u.UpdatedAt,
	}
}
