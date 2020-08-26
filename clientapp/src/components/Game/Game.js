import React from 'react';
import './Game.css'

export default function Game({actor , actress , movie , song , btnfn}) {
    return (
        <div className="game-container">
            <div className="actor">
                {
                    actor.length===1 ? <h4>{actor}</h4> : <h4 className = 'small'>{actor}</h4>
                }
            </div>
            <div className="actress">
                {
                    actress.length===1 ? <h4>{actress}</h4> : <h4 className = 'small'>{actress}</h4>
                }  
            </div>
            <div className="movie ">
                {
                    movie.length===1 ? <h4>{movie}</h4> : <h4 className = 'small'>{movie}</h4>
                }
            </div>
            <div className="song">
                {
                    song.length===1 ? <h4>{song}</h4> : <h4 className = 'small'>{song}</h4>
                }
            </div>
            <button className= 'buttonstyle' onClick={btnfn}>New Challenge</button>
        </div>
    )
};