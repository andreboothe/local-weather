import React from 'react';
import './InfoBlock.css';
const InfoBlock = ({data}) => {

    return (
        <div className="block">
            <h1>{data}</h1>
        </div>
        
    );
}

export default InfoBlock;