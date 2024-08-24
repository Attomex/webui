import React from "react";
import Button from "react-bootstrap/Button";
import 'bootstrap/dist/css/bootstrap.min.css';
import c from "./ButtonLoadMain.module.css";
import { Link } from "@inertiajs/inertia-react";

const ButtonLoadMain = () => {
  return (
    <div>
      <div className="d-grid gap-2">
      <Button className={c.LoadButton} variant="primary" size="lg" onClick={() => window.location.href = "admin/upload"}>
        <a style={{textDecoration: "none", color: "black"}}>Загрузить XML-отчёт</a>
      </Button>
    </div>
    </div>
  );
};

export default ButtonLoadMain;