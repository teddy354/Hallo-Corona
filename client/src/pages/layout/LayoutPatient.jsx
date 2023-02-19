import React from "react";
import { Outlet } from "react-router-dom";
import NavbarPatient from "../../components/navbar/NavbarPatient";

export default function LayoutPatient() {
  return (
    <div>
      <NavbarPatient />
      <Outlet />
    </div>
  );
}
