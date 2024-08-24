import React, { useState } from "react";
import { Button } from "react-bootstrap";
import c from "../layout/layoutModules/Uploading.module.css"; // Предполагается, что у вас есть файл стилей

const UploadingOptions = ({
    computerOptions,
    handleIdentifierChange,
    computerIdentifier,
    setterComputerIdentifier,
    newIdentifier,
    setNewIdentifier
}) => {
    const [isAddingNew, setIsAddingNew] = useState(false);

    const swapVariant = () => {
        setIsAddingNew(!isAddingNew);
        setNewIdentifier(""); // Очищаем поле ввода при переключении
        setterComputerIdentifier("");
    };

    function clearSelect() {
        setterComputerIdentifier("");
    }

    return (
        <>
            <td>
                <label htmlFor="computer_identifier" className={c.form__label}>
                    Идентификатор компьютера:
                </label>
            </td>
            <td>
                {isAddingNew ? (
                    <input
                        type="text"
                        id="computer_identifier"
                        value={newIdentifier}
                        onChange={(e) => {
                            setNewIdentifier(e.target.value);
                            handleIdentifierChange(e);
                        }}
                        className={`${c.form__input} ${c.form__input__text}`}
                        required
                    />
                ) : (
                    <select
                        className={c.select__field}
                        id="computer_identifier"
                        value={computerIdentifier}
                        onChange={handleIdentifierChange}
                        required
                    >
                        <option value="">Выберите компьютер</option>
                        {computerOptions.map((computer) => (
                            <option
                                key={computer.id}
                                value={computer.identifier}
                            >
                                {computer.identifier}
                            </option>
                        ))}
                    </select>
                )}
            </td>
            <td>
                <Button
                    style={{
                        marginTop: "10px",
                        marginBottom: "10px",
                        marginLeft: "10px",
                        width: "200px",
                    }}
                    variant="secondary"
                    onClick={swapVariant}
                >
                    {isAddingNew ? "Вернуться к списку" : "Добавить новое"}
                </Button>
            </td>
        </>
    );
};

export default UploadingOptions;
