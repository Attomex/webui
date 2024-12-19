import React from "react";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import c from "./ButtonLoadMain.module.css";
import { Head, Link } from "@inertiajs/react";

const ButtonLoadMain = () => {
    return (
        <div>
            <Head title="Home" />
            <div className="d-grid gap-2">
                <Link
                    href={route("admin.upload")}
                    style={{
                        textDecoration: "none",
                        textAlign: "center",
                        margin: "0 auto",
                        color: "black",
                        fontSize: "18px",
                        padding: "10px",
                        // marginLeft: "10px",
                        // marginTop: "20px",
                        width: "30%",
                        borderRadius: "10px",
                        borderColor: "rgb(255, 255, 255)",
                        borderWidth: "3px",
                        borderStyle: "solid",
                        transition: "background-color 0.3s ease", // Добавляем плавный переход
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor =
                            "rgba(51, 58, 76, 0.4)"; // Изменяем цвет с прозрачностью
                        e.currentTarget.style.cursor = "pointer"; // Изменяем курсор мыши
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = ""; // Возвращаем исходный цвет
                        e.currentTarget.style.cursor = ""; // Возвращаем исходный курсор мыши
                    }}
                    onClick={(e) => {
                        e.currentTarget.style.backgroundColor = ""; // Возвращаем исходный цвет
                        e.currentTarget.style.cursor = ""; // Возвращаем исходный курсор мыши
                        // handleClick(e, item.href);
                    }}
                >
                    Загрузить HTML-отчёт
                </Link>
            </div>
        </div>
    );
};

export default ButtonLoadMain;
