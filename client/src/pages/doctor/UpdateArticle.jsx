import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { API } from "../../config/api";
import { useMutation, useQuery } from "react-query";
import { useNavigate, useParams } from "react-router";

export default function UpdateArticle() {

  let navigate = useNavigate();
  const { id } = useParams();

  const [preview, setPreview] = useState(null); //For image preview
  const [article, setArticle] = useState({}); //Store Article data

  const [form, setForm] = useState({
    title: "",
    image: "",
    desc: "",
  });

  let { articleRefetch } = useQuery("articleCache", async () => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.token,
      },
    };
    const response = await API.get("/article/" + id, config);
    setForm({
      title: response.data.data.title,
      image: response.data.data.image,
      desc: response.data.data.desc,
    });
    setArticle(response.data.data);
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.type === "file" ? e.target.files : e.target.value,
    });
    // Create image url for preview
    if (e.target.type === "file") {
      setPreview(e.target.files);
    }
  };
  // console.log(form);

  const handleSubmit = useMutation(async (e) => {
    try {
      e.preventDefault();

      // Configuration
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      // Store data with FormData as object
      const formDataa = new FormData();
      formDataa.set("title", form.title);
      if (preview) {
        formDataa.set("image", preview[0], preview[0]?.name);
      }
      formDataa.set("desc", form.desc);

      // update article data
      const response = await API.patch(
        `/article/${article.id}`,
        formDataa,
        config
      );
      console.log(response);
      navigate("/doctor/list-article");
    } catch (error) {
      console.log(error);
    }
  });

  return (
    <div>
      <div
        className="container p-5"
        style={{ marginTop: "10vh", marginRight: "50px" }}
      >
        <h2 style={{ color: "#FF6185", fontWeight: "700" }}>Edit Article</h2>
      </div>
      <div className="container" style={{ marginRight: "50px" }}>
        <Form onSubmit={(e) => handleSubmit.mutate(e)}>
          <Form.Group className="mb-3">
            <Form.Label className="label">Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              id="title"
              value={form.title}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            {!preview ? (
              <div>
                <img
                  src={form.image}
                  alt={preview}
                  style={{
                    width: "1110px",
                    height: "500px",
                    objectFit: "cover",
                  }}
                />
              </div>
            ) : (
              <div>
                <img
                  src={URL.createObjectURL(preview[0])}
                  alt=""
                  style={{
                    width: "1110px",
                    height: "500px",
                    objectFit: "cover",
                  }}
                />
              </div>
            )}
            <Form.Label for="image" className="label">
              Upload Image
            </Form.Label>
            <Form.Control
              type="file"
              id="image"
              name="image"
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="label">Description</Form.Label>
            <Form.Control
              type="text"
              as="textarea"
              name="desc"
              onChange={handleChange}
              value={form.desc}
              style={{ height: "200px" }}
            />
          </Form.Group>
          <div className="d-flex justify-content-center align-items-center mb-5 mt-4">
            <Button
              style={{
                background: "#ff6185",
                border: "1px solid #ff6185",
                height: "35px",
                width: "15rem",
                fontWeight: "700",
              }}
              type="submit"
            >
              Post
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
