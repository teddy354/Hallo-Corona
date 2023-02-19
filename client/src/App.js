import React, { useContext, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Auth from "./pages/auth/Auth";
import LayoutPatient from "./pages/layout/LayoutPatient";
import LayoutDoctor from "./pages/layout/LayoutDoctor";
import HomePage from "./pages/patient/HomePage";
import DetailArticleAuth from "./pages/auth/DetailArticle";
import DetailArticle from "./components/article/DetailArticle";
import Profile from "./components/profile/Profile";
import Reservation from "./pages/doctor/Reservation";
import ReservationPage from "./pages/patient/ReservationPage";
import Inbox from "./pages/patient/Inbox";
import Notfound from "./components/404/Notfound";
import AddArticle from "./pages/doctor/AddArticle";

import { UserContext } from "./context/userContext";
import { API, setAuthToken } from "./config/api";
import Article from "./components/article/Article";
import DetReserv from "./pages/doctor/DetReserv";
import UpdateArticle from "./pages/doctor/UpdateArticle";

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

function App() {
  let navigate = useNavigate();
  const [state, dispatch] = useContext(UserContext);

  useEffect(() => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }

    // Redirect Auth
    if (state.isLogin === false) {
      navigate("/");
    } else {
      if (state.user.listAs === "doctor") {
        navigate("/doctor");
      } else if (state.user.listAs === "patient") {
        navigate("/patient");
      }
    }
  }, [state]);

  const checkUser = async () => {
    try {
      const response = await API.get("/check-auth");

      // If the token incorrect
      if (response.status === 404) {
        return dispatch({
          type: "AUTH_ERROR",
        });
      }

      // Get user data
      let payload = response.data.data;
      // Get token from local storage
      payload.token = localStorage.token;

      // Send data to useContext
      dispatch({
        type: "USER_SUCCESS",
        payload,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (localStorage.token) {
      checkUser();
    }
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/detailarticle/:id" element={<DetailArticleAuth />} />
        <Route path="/patient" element={<LayoutPatient />}>
          <Route index element={<HomePage />} />
          <Route
            path="/patient/detailarticle/:id"
            element={<DetailArticle />}
          />
          <Route path="/patient/profile" element={<Profile />} />
          <Route path="/patient/consultation" element={<ReservationPage />} />
          <Route path="/patient/inbox" element={<Inbox />} />
        </Route>
        <Route path="/doctor" element={<LayoutDoctor />}>
          <Route index element={<Reservation />} />
          <Route path="/doctor/reservation/:id" element={<DetReserv />} />
          <Route path="/doctor/add-article" element={<AddArticle />} />
          <Route path="/doctor/list-article" element={<Article />} />
          <Route path="/doctor/detailarticle/:id" element={<DetailArticle />} />
          <Route
            path="/doctor/update-article/:id"
            element={<UpdateArticle />}
          />
          <Route path="/doctor/profile" element={<Profile />} />
        </Route>
        <Route path="*" element={<Notfound />} />
      </Routes>
    </>
  );
}

export default App;
