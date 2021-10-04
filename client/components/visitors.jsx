import React from 'react';

const Visitors = ({ site, visitors }) => {
  return (
    <div>
      <h1>{site} visitors</h1>
      <div className="table">
        <div className="header">IP</div>
        <div className="header">Time Zone</div>
        <div className="header">City</div>
        <div className="header">Region</div>
        <div className="header">Country</div>
        <div className="header">Latitude</div>
        <div className="header">Longitude</div>
      </div>
      {visitors.map((visitor, index) => (
        <div key={index} className="table">
          <div className={index % 2 === 0 ? 'dark' : 'light'}>{visitor.ip}</div>
          <div className={index % 2 === 0 ? 'dark' : 'light'}>{visitor.timezone}</div>
          <div className={index % 2 === 0 ? 'dark' : 'light'}>{visitor.city}</div>
          <div className={index % 2 === 0 ? 'dark' : 'light'}>{visitor.region}</div>
          <div className={index % 2 === 0 ? 'dark' : 'light'}>{visitor.country}</div>
          <div className={index % 2 === 0 ? 'dark' : 'light'}>{visitor.ll[0]}</div>
          <div className={index % 2 === 0 ? 'dark' : 'light'}>{visitor.ll[1]}</div>
        </div>
      ))}
    </div>
  );
};

export default Visitors;
