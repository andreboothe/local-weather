import React from 'react';
import './Temperature.css';

const Temperature = ({temp , unit , tempChange}) => {
    
   
    return (
        <div className=" ">
            <h1 className="temp-display">{temp} <sup>o</sup> {unit.charAt(0)} </h1>
            <button className="btn" onClick={tempChange}>{unit}</button>
        </div>
    );

}

export default Temperature;