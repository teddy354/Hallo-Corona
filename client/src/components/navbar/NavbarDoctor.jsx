import React, { useContext } from "react";
import { Container, Navbar, Nav, NavDropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../assets/logo.png";
import doctor from "../../assets/dropdown/doctor.png";
import Profile from "../../assets/dropdown/profile.png";
import Article from "../../assets/dropdown/article.png";
import LogoutIcon from "../../assets/dropdown/logout.png";
import { UserContext } from "../../context/userContext";
import ListArticle from "../../assets/article.png";
import { useQuery } from "react-query";
import { API } from "../../config/api";
import jwt from "jwt-decode"

export default function NavbarDoctor() {

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
          <Navbar.Brand as={Link} to="/doctor">
            <img src={Logo} alt="Halo corona" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse
            id="basic-navbar-nav"
            className="justify-content-end"
          >
            <Nav style={{ marginRight: "5%" }}>
              <NavDropdown
                title={
                  <img
                    className="rounded-circle"
                    src={userId?.image ? userId?.image : doctor}
                    alt="User"
                    style={{ width: "50px", marginTop: "15px", height: "50px"}}
                  />
                }
                id="nav-dropdown"
              >
                <NavDropdown.Item
                  bg="dark"
                  variant="dark"
                  as={Link}
                  to="/doctor/profile"
                >
                  <img
                    src={Profile}
                    alt="icon"
                    style={{ width: "35px", marginRight: "5px" }}
                  />
                  Profile
                </NavDropdown.Item>
                <NavDropdown.Item
                  bg="dark"
                  variant="dark"
                  as={Link}
                  to="/doctor/list-article"
                >
                  <img
                    src={ListArticle}
                    alt="icon"
                    style={{ width: "35px", marginRight: "5px" }}
                  />
                  List Article
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/doctor/add-article">
                  <img
                    src={Article}
                    alt="icon"
                    style={{ width: "35px", marginRight: "5px" }}
                  />
                  Add Article
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
