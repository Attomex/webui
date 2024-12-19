import React from "react";
import c from "./NavBar.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "@inertiajs/react";

const NavBar = () => {
  return (
    <div className={c.navbar}>
      <div className={c.main}>
        <Link href={route("home")} className={c.text}>
          Web UI ScanOVAL
        </Link>
      </div>
      <div className={c.adminpanel}>
        <Link href={route("admin")} className={c.text}>
          Админ панель
        </Link>
      </div>
    </div>
  );
};

export default NavBar;
