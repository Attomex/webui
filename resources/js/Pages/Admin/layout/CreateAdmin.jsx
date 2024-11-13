import React, { useState, useEffect } from "react";
import {
    AppContent,
    AppSidebar,
    AppFooter,
    AppHeader,
} from "../components/index";
import "../scss/style.scss";
import { Button, Table } from "react-bootstrap";

import { useForm } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";

import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

const CreateAdmin = () => {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const [users, setUsers] = useState([]);

    useEffect(() => {
        return () => {
            reset("password", "password_confirmation");
        };
    }, []);

    useEffect(() => {
        const getUsers = async () => {
            await axios
                .get("/admin/createadmin/getUsers")
                .then((response) => {
                    setUsers(response.data);
                })
                .catch((error) => {
                    console.error("Error loading users", error);
                });
        };

        getUsers();
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route("register"), {
            onSuccess: () => {
                // Обработка успешного создания пользователя
                alert("Адмнистратор успешно добавлен!");
                window.location.reload();
            },
        });
    };

    const handleDelete = (userId) => {
        confirmAlert({
            title: "Подтверждение удаления",
            message: "Вы уверены, что хотите удалить этого администратора?",
            buttons: [
                {
                    label: "Да",
                    onClick: async () => {
                        await axios
                            .delete(`/admin/createadmin/${userId}`)
                            .then((response) => {
                                alert(response.data.message);
                            })
                            .catch((error) => {
                                console.error("Error deleting user", error);
                            });
                        window.location.reload(true);
                    },
                    
                },
                {
                    label: "Нет",
                    onClick: () => {},
                },
            ],
        });
    };

    return (
        <div>
            <AppSidebar />
            <div className="wrapper d-flex flex-column min-vh-100">
                <AppHeader />
                <div className="body flex-grow-1">
                    <AppContent />
                    <div style={{ marginLeft: "10px" }}>
                        <h2>Создание нового администратора</h2>
                        <div style={{ width: "600px" }}>
                            <form onSubmit={submit}>
                                <div>
                                    <InputLabel htmlFor="name" value="Имя" />

                                    <TextInput
                                        id="name"
                                        name="name"
                                        value={data.name}
                                        className="mt-1 block w-full"
                                        autoComplete="name"
                                        isFocused={true}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                        required
                                    />

                                    <InputError
                                        message={errors.name}
                                        className="mt-2"
                                    />
                                </div>

                                <div className="mt-4">
                                    <InputLabel htmlFor="email" value="Почта" />

                                    <TextInput
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        className="mt-1 block w-full"
                                        autoComplete="username"
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                        required
                                    />

                                    <InputError
                                        message={errors.email}
                                        className="mt-2"
                                    />
                                </div>

                                <div className="mt-4">
                                    <InputLabel
                                        htmlFor="password"
                                        value="Пароль"
                                    />

                                    <TextInput
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={data.password}
                                        className="mt-1 block w-full"
                                        autoComplete="new-password"
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                        required
                                    />

                                    <InputError
                                        message={errors.password}
                                        className="mt-2"
                                    />
                                </div>

                                <div className="mt-4">
                                    <InputLabel
                                        htmlFor="password_confirmation"
                                        value="Подтверждение пароля"
                                    />

                                    <TextInput
                                        id="password_confirmation"
                                        type="password"
                                        name="password_confirmation"
                                        value={data.password_confirmation}
                                        className="mt-1 block w-full"
                                        autoComplete="new-password"
                                        onChange={(e) =>
                                            setData(
                                                "password_confirmation",
                                                e.target.value
                                            )
                                        }
                                        required
                                    />

                                    <InputError
                                        message={errors.password_confirmation}
                                        className="mt-2"
                                    />
                                </div>

                                <div className="flex items-center justify-center mt-4">
                                    <PrimaryButton
                                        className="ms-4"
                                        disabled={processing}
                                    >
                                        Зарегистрировать нового администратора
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                        { users.length > 0 &&
                        <div>
                            <h1>Список администраторов</h1>
                            <div style={{ marginRight: "30px" }}>
                                <Table>
                                    <thead>
                                        <tr>
                                            <th>Имя</th>
                                            <th>Почта</th>
                                            <th>Роль</th>
                                            <th>Возможности</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((user) => (
                                            <tr key={user.id}>
                                                <td>{user.name}</td>
                                                <td>{user.email}</td>
                                                <td>{user.role}</td>
                                                <td>
                                                    <Button
                                                        onClick={() =>
                                                            handleDelete(
                                                                user.id
                                                            )
                                                        }
                                                    >
                                                        Удалить
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateAdmin;
