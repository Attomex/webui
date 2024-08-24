import React from "react";
import { PiSealWarningDuotone } from "react-icons/pi";
import Card from "react-bootstrap/Card";
import c from './Card.module.css'

const CardM = ({ data }) => {

  return (
    <Card style={{ minWidth: "16rem", maxWidth: "18rem" }} className={c.card}>
      <Card.Body>
        <Card.Title>Компьютер: {data.computer.identifier}</Card.Title>
        <Card.Subtitle>Количество ошибок: {data.criticalErrors + data.highErrors + data.mediumErrors + data.lowErrors}</Card.Subtitle>
        <p className={c.p_style}>
          <PiSealWarningDuotone style={{ color: "#FF0000" }} />
          Критических: <b>{data.criticalErrors}</b>

        </p>
        <p className={c.p_style}>
          <PiSealWarningDuotone style={{ color: "#FF5000" }} />
          Высоких: <b>{data.highErrors}</b>
        </p>
        <p className={c.p_style}>
          <PiSealWarningDuotone style={{ color: "#FFAF00" }} />
          Средних: <b>{data.mediumErrors}</b>
        </p>
        <p className={c.p_style}>
          <PiSealWarningDuotone style={{ color: "#008000" }} />
          Низких: <b>{data.lowErrors}</b>
        </p>
      </Card.Body>
    </Card>
  );
};

export default CardM;