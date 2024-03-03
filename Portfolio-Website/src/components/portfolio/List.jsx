import React, { useState } from 'react'

const List = ({ List, filterItems }) => { 
    const [active, setActive] = useState(1);

    return (
      <div className='portfolio__list'>
        {List.map((category, index) => {
          return (
            <button 
            className={`${
                active === index ? 'active-work' : ''
            } portfolio__list-item text-cs`}
             key={index} 
             onClick={() => {
                setActive(index);
                filterItems(category);
            }}
            >
              {category}
            </button>
          );
        })}
      </div>
    );
  };
  

export default List