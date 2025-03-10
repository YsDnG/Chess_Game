import React from "react";

const Card = ({ children, className = "" }) => {
  return (
    <div className={`${className}`}>
      {children}
    </div>
  );
};

const CardContent = ({ children, className = "" }) => {
  return <div className={`text-white ${className}`}>{children}</div>;
};

export { Card, CardContent };
