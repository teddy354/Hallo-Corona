import React, { useContext, useState } from "react";
import patient from "../../assets/dropdown/patient.png";
import doctor from "../../assets/dropdown/doctor.png";
import name from "../../assets/profile/name.png";
import address from "../../assets/profile/address.png";
import email from "../../assets/profile/email.png";
import gender from "../../assets/profile/gender.png";
import phone from "../../assets/profile/phone.png";
import status from "../../assets/profile/status.png";
import { UserContext } from "../../context/userContext";
import Changeimage from "./ChangeImage"
import { useQuery } from "react-query";
import { API } from "../../config/api";
import jwt from "jwt-decode";

export default function Profile() {

  const token = localStorage.getItem("token")
  const tkn = jwt(token)
  
  // const [state] = useContext(UserContext);
  // const[show, setShow] = useState(false)
  // console.log(state.user);
  // const [modalShow, setModalShow] = useState(false);

  // console.log(state);

  const [state, dispatch] = useContext(UserContext);
  const id = state.user.id

  let { data: userId } = useQuery("userCache", async () => {
    const response = await API.get("/user/" + tkn.id);
    return response.data.data;
  });
  console.log("userrrrrrrrrrr", userId)
  console.log("ini id", tkn)

  const [modalShowImage, setModalShowImage] = React.useState(false);

  const [modalShow, setModalShow] = React.useState(false);

  return (
    <div className="profile-container">
      <div className="profile-card shadow">
        <div className="profile-desc">
          <div className="profile-data">
            <h2>Personal Info</h2>
          </div>
          <div className="profile-data">
            <div className="profile-icon">
              <img src={name} alt="" />
            </div>
            <div className="profile-details">
              <span style={{ fontSize: "18px", fontWeight: "bold" }}>
                {state.user.username}
              </span>
              <span>Username</span>
            </div>
          </div>
          <div className="profile-data">
            <div className="profile-icon">
              <img src={email} alt="" />
            </div>
            <div className="profile-details">
              <span style={{ fontSize: "18px", fontWeight: "bold" }}>
                {state.user.email}
              </span>
              <span>Email</span>
            </div>
          </div>
          <div className="profile-data">
            <div className="profile-icon">
              <img src={status} alt="" />
            </div>
            <div className="profile-details">
              <span style={{ fontSize: "18px", fontWeight: "bold" }}>
                {state.user.listAs}
              </span>
              <span>Status</span>
            </div>
          </div>
          <div className="profile-data">
            <div className="profile-icon">
              <img src={gender} alt="" />
            </div>
            <div className="profile-details">
              <span style={{ fontSize: "18px", fontWeight: "bold" }}>Male</span>
              <span>{state.user.gender}</span>
            </div>
          </div>
          <div className="profile-data">
            <div className="profile-icon">
              <img src={phone} alt="" />
            </div>
            <div className="profile-details">
              <span style={{ fontSize: "18px", fontWeight: "bold" }}>
                {state.user.phone}
              </span>
              <span>Mobile Phone</span>
            </div>
          </div>
          <div className="profile-data">
            <div className="profile-icon">
              <img src={address} alt="" />
            </div>
            <div className="profile-details">
              <span style={{ fontSize: "18px", fontWeight: "bold" }}>
                {state.user.address}
              </span>
              <span>Address</span>
            </div>
          </div>
        </div>
        {/* <div className="profile-img" >
          {state.user.listAs === "patient" ? (
            <img src={patient} alt="avatar" className="profile-avatar me-5" />
          ) : (
            <img src={doctor} alt="avatar" className="profile-avatar me-5" />
          )}
          <button className="profile-button me-5" onClick={() => setShow(true)} style={{width:"17.5rem"}}>Change Photo Profile</button>
        </div> */}
          <div className="profile-img d-flex flex-column align-items-center">
            {state.user.listAs === "patient" ? (
              <img className="profile-avatar" style={{ width: "310px", height: "430px", objectFit: "cover" }} src={userId?.image !== "" ? "http://localhost:5000/uploads/"+userId?.image : patient} alt="" />
            ) : (
              <img className="profile-avatar" style={{ width: "310px", height: "430px", objectFit: "cover" }} src={userId?.image !== "" ? "http://localhost:5000/uploads/"+userId?.image : doctor} alt="" />
            )}
              <button className="profile-button ms-0" onClick={() => setModalShowImage(true)} style={{width:"20rem"}}>Change Photo Profile</button>
          </div>
              <Changeimage show={modalShowImage} onHide={() => setModalShowImage(false)}/>
      </div>
    </div>
  );
}
