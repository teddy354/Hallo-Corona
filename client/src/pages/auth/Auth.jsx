import React, { useState } from "react";
import { Container, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import Logo from "../../assets/logo.png";
import Signup from "../../components/modal/Signup";
import Signin from "../../components/modal/Signin";
import bgImg from "../../assets/Jumbotron.png";
import iconbtn from "../../assets/iconbtn.png";
// import artikel from "../../assets/artikel.png";
import Article from "../../components/article/Article";

export default function Auth() {
  

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
      <Navbar bg="white" expand="lg" fixed="top" >
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
      <div
        style={{
          marginTop: "10vh",
          backgroundImage: `url(${bgImg})`,
          height: "58vh",
          width: "auto",
          backgroundPosition: "center top",
          backgroundSize: "100%",
          backgroundRepeat: "no-repeat",
        }}
      >
        <button
          onClick={() => setSignInShow(true)}
          style={{
            // margin: "12rem",
            // padding: "2rem",
            border: "0px",
            backgroundColor: "white",
            height: "55px",
            marginTop: "15.5rem",
            marginLeft: "11.5rem",
            backgroundImage: `url(${iconbtn})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "15%",
            // backgroundPosition: "left center ",
            backgroundPositionX: "10px",
            backgroundPositionY: "center",
          }}
        >
          <span
            style={{
              fontWeight: "700",
              color: "#ff6185",
              fontSize: "20px",
              marginLeft: "4rem",
            }}
            className="py-5"
          >
            Konsultasi Dengan Dokter
          </span>
        </button>
      </div>
      <Article />

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
