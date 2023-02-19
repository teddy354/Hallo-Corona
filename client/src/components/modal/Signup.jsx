import React, { useContext, useState } from "react";
import { Modal, Alert } from "react-bootstrap";
import { UserContext } from "../../context/userContext";
import { useMutation } from "react-query";
import { API } from "../../config/api";

export default function Signup({ signUpShow, setSignUpShow, signUpHere }) {
  const regListAs = [
    {
      value: "",
      text: "-- Choose an option --",
    },
    {
      value: "patient",
      text: "Patient",
    },
    {
      value: "doctor",
      text: "Doctor",
    },
  ];

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

  const [message, setMessage] = useState(null);
  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    listAs: "",
    gender: "",
    phone: "",
    address: "",
  });

  const {
    fullname,
    username,
    email,
    password,
    listAs,
    gender,
    phone,
    address,
  } = form;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

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
      const response = await API.post("/register", body, config);
      // console.log(response);

      // Notification
      if (response.data.code === 200) {
        const alert = (
          <Alert variant="success" className="py-1">
            Success, please login to continue..
          </Alert>
        );

        setMessage(alert);
        setForm({
          fullname: "",
          username: "",
          email: "",
          password: "",
          listAs: "",
          gender: "",
          phone: "",
          address: "",
        });
      } else {
        const alert = (
          <Alert variant="danger" className="py-1">
            Failed
          </Alert>
        );
        setMessage(alert);
      }
    } catch (error) {
      console.log(error);

      if (error) {
        const alertPassword = (
          <Alert variant="danger" className="py-1">
            Something wrong..
          </Alert>
        );
        setMessage(alertPassword);
      }

      if (error.message == "Request failed with status code 400") {
        const alertPassword = (
          <Alert variant="danger" className="py-1">
            Failed, please fill all fields..
          </Alert>
        );
        setMessage(alertPassword);
      }

      if (error.response.data.code == 402) {
        const alertPassword = (
          <Alert variant="danger" className="py-1">
            Username not available!
          </Alert>
        );
        setMessage(alertPassword);
      }

      if (error.response.data.code == 403) {
        const alertPassword = (
          <Alert variant="danger" className="py-1">
            Email has already been registered!
          </Alert>
        );
        setMessage(alertPassword);
      }
    }
  });

  function ShowPass() {
    let x = document.getElementById("ShowPass");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  }
  return (
    <div>
      <Modal
        size="md"
        show={signUpShow}
        onHide={() => setSignUpShow(false)}
        centered
      >
        <Modal.Body className="bg-Modal">
          <div>
            <div
              style={{
                fontSize: "30px",
                lineHeight: "49px",
                fontWeight: "700",
                color: "black",
              }}
              className="mb-2 text-center"
            >
              Sign Up
            </div>
            {message && message}
            <form onSubmit={(e) => handleSubmit.mutate(e)}>
              <div className="mt-3 form">
                <label className="label">Full Name</label>
                <input
                  type="text"
                  name="fullname"
                  value={fullname}
                  onChange={handleChange}
                  className="px-3 py-2 mb-2"
                />
                <label className="label">Username</label>
                <input
                  type="text"
                  name="username"
                  value={username}
                  onChange={handleChange}
                  className="px-3 py-2 mb-2"
                />
                <label className="label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  className="px-3 py-2 mb-2"
                />
                <label className="label">Password</label>
                <input
                  type="password"
                  name="password"
                  id="ShowPass"
                  value={password}
                  onChange={handleChange}
                  className="px-3 py-2 mb-2"
                />
                <label className="label">List As</label>
                <select
                  name="listAs"
                  value={listAs}
                  onChange={handleChange}
                  className="px-3 py-2 mb-2"
                >
                  {regListAs.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.text}
                    </option>
                  ))}
                </select>
                <label className="label">Gender</label>
                <select
                  name="gender"
                  value={gender}
                  onChange={handleChange}
                  className="px-3 py-2 mb-2"
                >
                  {regGender.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.text}
                    </option>
                  ))}
                </select>
                <label className="label">Phone</label>
                <input
                  type="number"
                  name="phone"
                  value={phone}
                  onChange={handleChange}
                  className="px-3 py-2 mb-2"
                />
                <label className="label">Address</label>
                <input
                  type="text"
                  name="address"
                  value={address}
                  onChange={handleChange}
                  className="px-3 py-2 mb-2"
                />
              </div>
              <div className="d-grid gap-2 mt-3">
                <button type="submit" className="btnauth">
                  Sign Up
                </button>
                <p className="warning">
                  Already have an account?
                  <button onClick={signUpHere} className="btnHere">
                    Click here
                  </button>
                </p>
              </div>
            </form>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
