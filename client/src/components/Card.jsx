import React from "react";

const Card = ({ children, className = "",onClick }) => {
  return (
    
      <div className={`${className}`} onClick={onClick}>
        {children}
      </div>
   
  );
};

const CardContent = ({ children, className = "" }) => {
  return <div className={`text-white ${className}`}>{children}</div>;
};

export { Card, CardContent };
