import React from 'react';

import onlineIcon from '../../icons/onlineIcon.png';

import './TextContainer.css';

const TextContainer = ({ users }) => (
  <div className="textContainer">
    
    {
      users
        ? (
          <div>
            <h5>Leader Board</h5>
            <div className="activeContainer">
              <h2>
                {users.map(({name , score}) => (
                  <div key={name} className="activeItem">
                    <p>{name}</p>
                <p>{score}</p>
                  </div>
                ))}
              </h2>
            </div>
          </div>
        )
        : null
    }
  </div>
);

export default TextContainer;