package handlers

import (
	"encoding/json"
	"fmt"
	articledto "hallo-corona-be/dto/article"
	dto "hallo-corona-be/dto/result"
	"hallo-corona-be/models"
	"hallo-corona-be/repositories"
	"net/http"
	"os"
	"strconv"

	"github.com/go-playground/validator/v10"
	"github.com/golang-jwt/jwt/v4"
	"github.com/gorilla/mux"

	"context"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
)

type handlerArticle struct {
	ArticleRepository repositories.ArticleRepository
}

func HandlerArticle(ArticleRepository repositories.ArticleRepository) *handlerArticle {
	return &handlerArticle{ArticleRepository}
}

func (h *handlerArticle) FindArticles(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	articles, err := h.ArticleRepository.FindArticles()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		response := dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()}
		json.NewEncoder(w).Encode(response)
		return
	}

	// Create Embed Path File on Image property here...
	for i, p := range articles {
		articles[i].Image = os.Getenv("PATH_FILE") + p.Image
	}

	w.WriteHeader(http.StatusOK)
	response := dto.SuccessResult{Code: http.StatusOK, Data: articles}
	json.NewEncoder(w).Encode(response)
}

func (h *handlerArticle) GetArticle(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	id, _ := strconv.Atoi(mux.Vars(r)["id"])

	var article models.Article
	article, err := h.ArticleRepository.GetArticle(id)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		response := dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()}
		json.NewEncoder(w).Encode(response)
		return
	}

	// Create Embed Path File on Image property here ...
	article.Image = os.Getenv("PATH_FILE") + article.Image

	w.WriteHeader(http.StatusOK)
	response := dto.SuccessResult{Code: http.StatusOK, Data: convertResponseArticle(article)}
	json.NewEncoder(w).Encode(response)
}

func (h *handlerArticle) CreateArticle(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// get data user token
	userInfo := r.Context().Value("userInfo").(jwt.MapClaims)
	userId := int(userInfo["id"].(float64))

	// Get dataFile from midleware and store to filename variable here ...
	dataContex := r.Context().Value("dataFile")
	filename := dataContex.(string)

	request := articledto.CreateArticleRequest{
		Title:    r.FormValue("title"),
		Image:    r.FormValue("image"),
		UserID:   userId,
		Desc:     r.FormValue("desc"),
		Category: r.FormValue("category"),
	}

	validation := validator.New()
	err := validation.Struct(request)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		response := dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()}
		json.NewEncoder(w).Encode(response)
		return
	}

	var ctx = context.Background()
	var CLOUD_NAME = os.Getenv("CLOUD_NAME")
	var API_KEY = os.Getenv("API_KEY")
	var API_SECRET = os.Getenv("API_SECRET")

	// Add your Cloudinary credentials ...
	cld, _ := cloudinary.NewFromParams(CLOUD_NAME, API_KEY, API_SECRET)

	// Upload file to Cloudinary ...
	resp, err := cld.Upload.Upload(ctx, filename, uploader.UploadParams{Folder: "hallocorona"})

	if err != nil {
		fmt.Println(err.Error())
	}

	article := models.Article{
		Title:    request.Title,
		Image:    resp.SecureURL,
		UserID:   userId,
		User:     models.UserResponse{},
		Desc:     request.Desc,
		Category: request.Category,
	}

	// err := mysql.DB.Create(&article).Error
	article, err = h.ArticleRepository.CreateArticle(article)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		response := dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()}
		json.NewEncoder(w).Encode(response)
		return
	}

	article, _ = h.ArticleRepository.GetArticle(article.ID)

	w.WriteHeader(http.StatusOK)
	response := dto.SuccessResult{Code: http.StatusOK, Data: convertResponseArticle(article)}
	json.NewEncoder(w).Encode(response)
}

func (h *handlerArticle) UpdateArticle(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// get article id
	id, _ := strconv.Atoi(mux.Vars(r)["id"])

	// get image filename
	dataContex := r.Context().Value("dataFile")
	filename := dataContex.(string)

	request := articledto.UpdateArticleRequest{
		Title: r.FormValue("title"),
		Desc:  r.FormValue("desc"),
	}

	validation := validator.New()
	err := validation.Struct(request)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		response := dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()}
		json.NewEncoder(w).Encode(response)
		return
	}

	var ctx = context.Background()
	var CLOUD_NAME = os.Getenv("CLOUD_NAME")
	var API_KEY = os.Getenv("API_KEY")
	var API_SECRET = os.Getenv("API_SECRET")

	// Add your Cloudinary credentials ...
	cld, _ := cloudinary.NewFromParams(CLOUD_NAME, API_KEY, API_SECRET)

	// Upload file to Cloudinary ...
	resp, err := cld.Upload.Upload(ctx, filename, uploader.UploadParams{Folder: "hallocorona"})

	if err != nil {
		fmt.Println(err.Error())
	}

	article, _ := h.ArticleRepository.GetArticle(id)

	article.Title = request.Title
	article.Desc = request.Desc

	if filename != "false" {
		article.Image = resp.SecureURL
	}

	article, err = h.ArticleRepository.UpdateArticle(article)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		response := dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()}
		json.NewEncoder(w).Encode(response)
		return
	}

	w.WriteHeader(http.StatusOK)
	response := dto.SuccessResult{Code: http.StatusOK, Data: article}
	json.NewEncoder(w).Encode(response)
}

func (h *handlerArticle) DeleteArticle(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	id, _ := strconv.Atoi(mux.Vars(r)["id"])
	article, err := h.ArticleRepository.GetArticle(id)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		response := dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()}
		json.NewEncoder(w).Encode(response)
		return
	}

	data, err := h.ArticleRepository.DeleteArticle(article)
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

func convertResponseArticle(t models.Article) articledto.ArticleResponse {
	return articledto.ArticleResponse{
		ID:        t.ID,
		Title:     t.Title,
		Image:     t.Image,
		User:      t.User,
		Desc:      t.Desc,
		CreatedAt: t.CreatedAt,
		UpdatedAt: t.UpdatedAt,
		Category:  t.Category,
	}
}
