import React, { useContext, useState } from "react";
import { UserContext } from "../../context/userContext";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { API } from "../../config/api";
import { Modal, Alert } from "react-bootstrap";

export default function Signin({ signInShow, setSignInShow, signInHere }) {
  let navigate = useNavigate();

  const [state, dispatch] = useContext(UserContext);

  const [message, setMessage] = useState(null);
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const { username, password } = form;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = useMutation(async (e) => {
    try {
      e.preventDefault();

      // Configuration
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      // Data body
      const body = JSON.stringify(form);

      // Insert data for login process
      const response = await API.post("/login", body, config);
      // Checking process

      if (response.status === 200) {
        // Send data to useContext
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: response.data.data,
        });
        // console.log(response);
        // Status check
        if (response.data.data.listAs === "doctor") {
          navigate("/doctor");
        } else {
          navigate("/patient");
        }

        const alert = (
          <Alert variant="success" className="py-1">
            Login success
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

      if (error.response.data.code === 403) {
        const alertPassword = (
          <Alert variant="danger" className="py-1">
            Username not found!
          </Alert>
        );
        setMessage(alertPassword);
      }
      if (error.response.data.code === 404) {
        const alertPassword = (
          <Alert variant="danger" className="py-1">
            Password not match!
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
        show={signInShow}
        onHide={() => setSignInShow(false)}
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
              className="mb-3 text-center"
            >
              Sign In
            </div>
            {message && message}
            <form onSubmit={(e) => handleSubmit.mutate(e)}>
              <div className="mt-3 form">
                <label className="label">Username</label>
                <input
                  type="text"
                  name="username"
                  value={username}
                  onChange={handleChange}
                  className="px-3 py-2 mb-3"
                />
                <label className="label">Password</label>
                <input
                  type="password"
                  name="password"
                  id="ShowPass"
                  value={password}
                  onChange={handleChange}
                  className="px-3 py-2 mb-3"
                />
              </div>
              <div>
                <input
                  type="checkbox"
                  id="Show"
                  onClick={ShowPass}
                  className="mt-3"
                />
                <label for="Show" className="ms-1">
                  Show Password
                </label>
              </div>
              <div className="d-grid gap-2 mt-3">
                <button type="submit" className="btnauth">
                  Sign In
                </button>
                <p className="warning">
                  Don't have an account?
                  <button onClick={signInHere} className="btnHere">
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
