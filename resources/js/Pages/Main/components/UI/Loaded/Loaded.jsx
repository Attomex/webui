import React from "react";
import c from "./Loaded.module.css";
import CardM from "../Card/Card";

const Loaded = ({ data }) => {
  const sortedData = data.sort(
    (a, b) => new Date(b.report_date) - new Date(a.report_date)
  );

  const groupedData = sortedData.reduce((acc, current) => {
    const date = current.report_date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(current);
    return acc;
  }, {});

  return (
    <>
      <div>
        {Object.keys(groupedData).map((date) => (
          <div key={date}>
            <hr style={{ marginTop: "10px" }} className={c.hr_date} />
            <h2 style={{ textAlign: "center" }}>{date}</h2>
            <hr className={c.hr_date} />
            <div className={c.LoadedXML}>
              {groupedData[date].map((item, index) => (
                <CardM key={index} data={item} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Loaded;