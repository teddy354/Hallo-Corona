import React, { useState } from "react";
import { Container, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import Logo from "../../assets/logo.png";
import Signup from "../../components/modal/Signup";
import Signin from "../../components/modal/Signin";
import DetailArticle from "../../components/article/DetailArticle";

export default function DetailArticleAuth() {

  const [signUpShow, setSignUpShow] = useState(false);
  const [signInShow, setSignInShow] = useState(false);

  const signInHere = (e) => {
    e.preventDefault();
    setSignInShow(false);
    setSignUpShow(true);
  };

  const signUpHere = (e) => {
    e.preventDefault();
    setSignUpShow(false);
    setSignInShow(true);
  };
  return (
    <div>
      <Navbar bg="white" expand="lg" fixed="top">
        <Container>
          <Navbar.Brand as={Link} to="/">
            <img src={Logo} alt="Halo corona" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse
            id="basic-navbar-nav"
            className="justify-content-end"
          >
            <button
              className="btnlogin me-2" style={{height:"3rem"}}
              onClick={() => setSignUpShow(true)}
            >
              Sign Up
            </button>
            <button className="btnregist" style={{height:"3rem"}} onClick={() => setSignInShow(true)}>
              Sign In
            </button>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <DetailArticle />

      {/* modal */}
      <Signup
        signUpHere={signUpHere}
        signUpShow={signUpShow}
        setSignUpShow={setSignUpShow}
      />
      <Signin
        signInHere={signInHere}
        signInShow={signInShow}
        setSignInShow={setSignInShow}
      />
    </div>
  );
}
