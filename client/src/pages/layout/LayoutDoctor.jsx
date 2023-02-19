import React from "react";
import { Outlet } from "react-router-dom";
import NavbarDoctor from "../../components/navbar/NavbarDoctor";

export default function LayoutDoctor() {
  return (
    <div>
      <NavbarDoctor />
      <Outlet />
    </div>
  );
}
