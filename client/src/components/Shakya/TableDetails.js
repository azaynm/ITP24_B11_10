import React from "react";
import { Link, useNavigate } from "react-router-dom";
import ReservationForm from "./ReservationForm";
import "./style.css"


function TableDetails() {


  const navigate = useNavigate();

  const handleBookNowClick = (tableType) => {
    navigate("/ReservationForm", { state: { tableType } });
  };


  return (
    <div className="tabs-container mx-5 mb-5 rounded">
      <div className="card-group">
      <div className="col-12 col-md-6">
        <div className="card p-3 rounded m-2 custom-card">
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
        </div>
        <div className="col-12 col-md-6">
        <div className="card p-3 rounded m-2 custom-card">
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
    </div>
  );

}

export default TableDetails;
