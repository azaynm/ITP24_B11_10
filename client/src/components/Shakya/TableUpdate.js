import {React ,useState }from 'react'

function TableUpdate({onSelectTable}) {
  const [activeButton, setActiveButton] = useState(null);

  const handleButtonClick = (event) => {
   const buttonValue = event.target.value;
   onSelectTable(buttonValue);
   setActiveButton(buttonValue); 
  };


  return (
    <div>
      <div className="row justify-content-around">
        <div className="col-6 col-md-3">
          <button 
            type="button" 
            value="1"
            className={`btn btn-outline-success p-4 w-100 ${activeButton === "1" ? "active" : ""}`}
            onClick={handleButtonClick}>
            1
          </button>
        </div>
        <div className="col-6 col-md-3">
          <button 
            type="button" 
            value="2"
            className={`btn btn-outline-success p-4 w-100 ${activeButton === "2" ? "active" : ""}`}
            onClick={handleButtonClick}>
            2
          </button>
        </div>
        <div className="col-6 col-md-3">
          <button 
            type="button" 
            className={`btn btn-outline-success p-4 w-100 ${activeButton === "3" ? "active" : ""}`}
            value="3"
            onClick={handleButtonClick}>
            3
          </button>
        </div>
        <div className="col-6 col-md-3">
          <button 
            type="button" 
            className={`btn btn-outline-success p-4 w-100 ${activeButton === "4" ? "active" : ""}`}
            value="4"
            onClick={handleButtonClick}>
            4
          </button>
        </div>
      </div>
    </div>
  )
}

export default TableUpdate