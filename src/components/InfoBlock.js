import React from 'react';
import './InfoBlock.css';

const InfoBlock = ({location, weatherCondition, windData, iconUrl,
                    weatherIcon, unit, temp, tempChange, humidity}) => {

    return (
        <div className="info-block">
            <div>
                <p><span>Location:</span> {location}</p>
            </div>
            <div className="condition">
                <p><span>Conditions:</span> {weatherCondition}</p>
                <img src={iconUrl} alt="weather icon"/>
            </div>
            <div>
                <p><span>Wind Speed:</span> {windData}</p>
            </div>
            <div>
                <p><span>Humidity:</span> {humidity}</p>
            </div>
            <div className="temp">
                <p><span>Temperature:</span> {temp}<sup>o</sup> {unit.charAt(0)} </p>
                <button className="btn" onClick={tempChange}>{unit}</button><br />
            </div>
            
            
            
            
        </div>
        
    );
}

export default InfoBlock;