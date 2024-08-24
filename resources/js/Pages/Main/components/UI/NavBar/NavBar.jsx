import React from "react";
import c from "./NavBar.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "@inertiajs/inertia-react";

const NavBar = () => {
  return (
    <div className={c.navbar}>
      <div className={c.main}>
        <Link href="/" className={c.text}>
          Web UI ScanOVAL
        </Link>
      </div>
      <div className={c.adminpanel}>
        <Link href="/admin" className={c.text}>
          Админ панель
        </Link>
      </div>
    </div>
  );
};

export default NavBar;
