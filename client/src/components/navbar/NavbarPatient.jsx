import React, { useContext } from "react";
import { Container, Navbar, Nav, NavDropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../assets/logo.png";
import patient from "../../assets/dropdown/patient.png";
import Profile from "../../assets/dropdown/profile.png";
import Consult from "../../assets/dropdown/consult.png";
import LogoutIcon from "../../assets/dropdown/logout.png";
import { UserContext } from "../../context/userContext";
import { useQuery } from "react-query";
import { API } from "../../config/api";
import jwt from "jwt-decode";

export default function NavbarPatient() {

  const token = localStorage.getItem("token")
  const tkn = jwt(token)


  const [state, dispatch] = useContext(UserContext);

  let navigate = useNavigate();

  const logout = () => {
    dispatch({
      type: "LOGOUT",
    });
    navigate("/");
  };

  const id = state.user.id;

  let { data: userId } = useQuery("userChache", async() => {
    const response = await API.get("/user/" + tkn.id);
    return response.data.data;
  })



  return (
    <div>
      <Navbar bg="white" expand="lg" fixed="top" >
        <Container>
          <Navbar.Brand as={Link} to="/patient">
            <img src={Logo} alt="Halo corona" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse
            id="basic-navbar-nav"
            className="justify-content-end"
          >
            <Nav>
              <NavDropdown
                title={
                  <img
                    className="rounded-circle"
                    src={userId?.image ? userId?.image : patient}
                    alt="Patient"
                    style={{ width: "50px", marginTop: "15px", height: "50px"}}
                  />
                }
                id="nav-dropdown"
              >
                <NavDropdown.Item
                  bg="dark"
                  variant="dark"
                  as={Link}
                  to="/patient/profile"
                >
                  <img
                    src={Profile}
                    alt="icon"
                    style={{ width: "35px", marginRight: "10px" }}
                  />
                  Profile
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/patient/inbox">
                  <img
                    src={Consult}
                    alt="icon"
                    style={{ width: "35px", marginRight: "5px" }}
                  />
                  Consultation
                </NavDropdown.Item>
                <NavDropdown.Divider
                  style={{ backgroundColor: "grey", color: "white" }}
                />
                <NavDropdown.Item onClick={logout}>
                  <img
                    src={LogoutIcon}
                    alt="icon"
                    style={{ width: "35px", marginRight: "5px" }}
                  />
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}
