import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { API } from "../../config/api";
import { useMutation } from "react-query";

export default function ReservationPage() {

  let navigate = useNavigate();

  const regGender = [
    {
      value: "",
      text: "-- Choose an option --",
    },
    {
      value: "male",
      text: "Male",
    },
    {
      value: "female",
      text: "Female",
    },
  ];

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    bornDate: Date,
    age: "",
    height: "",
    weight: "",
    gender: "",
    subject: "",
    liveConsul: Date,
    desc: "",
  });

  const {
    fullname,
    phone,
    bornDate,
    age,
    height,
    weight,
    gender,
    subject,
    liveConsul,
    desc,
  } = form;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
  console.log(form);

  const handleSubmit = useMutation(async (e) => {
    try {
      e.preventDefault();

      // Configuration Content-type
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      // Data body
      const body = JSON.stringify(form);

      // Insert data user to database
      const response = await API.post("/consultation", body, config);
      console.log(response);
      navigate("/patient/inbox");
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
        <h2 style={{ color: "#FF6185", fontWeight: "700" }}>
          Reservasi Consultation
        </h2>
      </div>
      <div className="container" style={{ marginRight: "50px" }}>
        <Form onSubmit={(e) => handleSubmit.mutate(e)}>
          <Form.Group className="mb-3">
            <Form.Label className="label">Full Name</Form.Label>
            <Form.Control
              type="text"
              name="fullname"
              value={fullname}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="label">Phone</Form.Label>
            <Form.Control
              type="number"
              name="phone"
              value={phone}
              onChange={handleChange}
            />
          </Form.Group>
          <div className="d-flex">
            <Form.Group className="mb-3 col-4">
              <Form.Label className="label">Born Date</Form.Label>
              <Form.Control
                type="date"
                name="bornDate"
                value={bornDate}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3 col-2 ms-5">
              <Form.Label className="label">Age</Form.Label>
              <Form.Control
                type="number"
                name="age"
                value={age}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3 col-3 ms-4">
              <Form.Label className="label">Height</Form.Label>
              <Form.Control
                type="number"
                name="height"
                value={height}
                onChange={handleChange}
              />
              {/* <Form.Text muted>in .Cm</Form.Text> */}
            </Form.Group>
            <Form.Group className="mb-3 col-2 ms-3">
              <Form.Label className="label">Weight</Form.Label>
              <Form.Control
                type="number"
                name="weight"
                value={weight}
                onChange={handleChange}
              />
              {/* <Form.Text muted>in .Kg</Form.Text> */}
            </Form.Group>
          </div>
          <Form.Group className="mb-3">
            <Form.Label className="label">Gender</Form.Label>
            <Form.Select value={gender} onChange={handleChange} name="gender">
              {regGender.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.text}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="label">Subject</Form.Label>
            <Form.Control
              type="text"
              name="subject"
              value={subject}
              onChange={handleChange}
            />
            {/* <Form.Text muted>contoh: "Sakit kepala"</Form.Text> */}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="label">Live Consultation Date</Form.Label>
            <Form.Control
              type="date"
              name="liveConsul"
              value={liveConsul}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="label">Description</Form.Label>
            <Form.Control
              type="text"
              as="textarea"
              style={{ height: "200px" }}
              name="desc"
              value={desc}
              onChange={handleChange}
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
              Send
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
