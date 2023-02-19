import React from "react";
import BgNotfound from "../../assets/notfound.svg";

export default function Notfound() {
  return (
    <div
      style={{
        backgroundImage: `url(${BgNotfound})`,
        height: "100vh",
        width: "100%",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
      }}
    ></div>
  );
}
