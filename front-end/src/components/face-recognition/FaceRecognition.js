import React from 'react';
import './FaceRecognition.css';

const FaceRecognition = ({ imgUrl, boxes }) => {
    return (
        <div className="center">
            <div className="absolute mt2">
                <img id="inputimage" src={imgUrl} alt="alt-text" width="500px" height="auto" />
                {
                    boxes.map((box, id) => <div className="bounding-box" key={id} style={{ top: box.topRow, left: box.leftCol, bottom: box.bottomRow, right: box.rightCol }} />)
                }
            </div>
        </div>
    );
}

export default FaceRecognition;