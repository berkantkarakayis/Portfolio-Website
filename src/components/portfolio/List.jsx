"use client";

import React, { useState } from "react";

const List = ({ List, filterItems }) => { 
    const [active, setActive] = useState(1);

    return (
      <div className="flex justify-center flex-wrap gap-x-10 gap-y-4 mb-[60px]">
        {List.map((category, index) => {
          return (
            <button 
            className={`${
                active === index
                  ? "text-primary before:w-10"
                  : "text-title"
              } relative text-[var(--tiny-font-size)] font-bold text-cs transition-colors duration-700 ease-in-out before:content-[''] before:absolute before:left-0 before:-bottom-3 before:h-0.5 before:bg-primary before:w-0 before:transition-all before:duration-300 hover:text-primary hover:before:w-10`}
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
