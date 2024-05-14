import {React ,useState ,useEffect}from 'react'

function TableUpdate({onSelectTable, reservations,selectedDate,selectedTime}) {
  const [activeButton, setActiveButton] = useState(null);
  const[disabledButton,setDisabledButton]=useState(null);

  const handleButtonClick = (event) => {
   const buttonValue = event.target.value;
   onSelectTable(buttonValue);
   setActiveButton(buttonValue); 
  };

  
  useEffect(() => {
    if (reservations && reservations.length > 0 && selectedDate && selectedTime) {
      const reservationForSelectedDateTime = reservations.find(
        (reservation) =>
          new Date(reservation.selectedDate).toISOString().split('T')[0] === selectedDate.toISOString().split('T')[0] &&
        reservation.selectedTime === selectedTime
      );

      if (reservationForSelectedDateTime) {
        const tableNumber = String(reservationForSelectedDateTime.tableNumber);
        console.log('Disabled Table:', tableNumber);
        setDisabledButton(tableNumber);
      } else {
        setDisabledButton(null);
      }
    } else {
      setDisabledButton(null);
    }
  }, [reservations, selectedDate, selectedTime]);
  return (
    <div>
      <div className="row justify-content-around">
        <div className="col-6 col-md-3">
          <button 
            type="button" 
            value="1"
            className={`btn btn-outline-success p-4 w-100 ${activeButton === "1" ? "active" : ""}`}
            onClick={handleButtonClick}
            disabled={disabledButton === "1"}>
            1
          </button>
        </div>
        <div className="col-6 col-md-3">
          <button 
            type="button" 
            value="2"
            className={`btn btn-outline-success p-4 w-100 ${activeButton === "2" ? "active" : ""}`}
            onClick={handleButtonClick}
            disabled={disabledButton === "2"}>
            2
          </button>
        </div>
        <div className="col-6 col-md-3">
          <button 
            type="button" 
            className={`btn btn-outline-success p-4 w-100 ${activeButton === "3" ? "active" : ""}`}
            value="3"
            onClick={handleButtonClick}
            disabled={disabledButton === "3"}>
            3
          </button>
        </div>
        <div className="col-6 col-md-3">
          <button 
            type="button" 
            className={`btn btn-outline-success p-4 w-100 ${activeButton === "4" ? "active" : ""}`}
            value="4"
            onClick={handleButtonClick}
            disabled={disabledButton === "4"}>
            4
          </button>
        </div>
      </div>
    </div>
  )
}

export default TableUpdate