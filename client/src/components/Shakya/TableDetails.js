import React from "react";
import { Link, useNavigate } from "react-router-dom";
import ReservationForm from "./ReservationForm";

function TableDetails() {


  const navigate = useNavigate();

  const handleBookNowClick = (tableType) => {
    navigate("/ReservationForm", { state: { tableType } });
  };


  return (
    <div>
      <div className="card-group">
        <div className="card m-5">
          <img
            src="./indoor.jpg"
            className="card-img-top"
            alt=""
            width="250px"
            height="350px"
          />
          <div className="card-body">
            <h5 className="card-title">Indoor Table</h5>
            <p className="card-text">
              This is a wider card with supporting text below as a natural
              lead-in to additional content. This content is a little bit
              longer.
            </p>
            <button
              type="button"
              className="btn btn-warning"
              onClick={() => handleBookNowClick("Indoor")}
            >
              BOOK NOW
            </button>
          </div>
        </div>
        <div className="card m-5">
          <img
            src="./outdoor.jpg"
            className="card-img-top"
            alt=""
            width="250px"
            height="350px"
          />
          <div className="card-body">
            <h5 className="card-title">Outdoor Table</h5>
            <p className="card-text">
              This card has supporting text below as a natural lead-in to
              additional content.
            </p>
            <button
              type="button"
              className="btn btn-warning"
              onClick={() => handleBookNowClick("Outdoor")}
            >
              BOOK NOW
            </button>
          </div>
        </div>
      </div>
    </div>
  );

}

export default TableDetails;
