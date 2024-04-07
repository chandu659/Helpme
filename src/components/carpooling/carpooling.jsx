import React, { useState, useEffect } from 'react';
import axios from 'axios';

export function CarPooling() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8001/carpooling');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching carpooling data:', error);
      }
    };
  
    fetchData();
  }, []);
  

  return (
    <div>
      {data.length > 0 ? (
        data.map((item) => (
          <div className="service-entry" key={item._id}>
            <h2>{item.City}</h2>
            <p>{item.Subject}</p>
            {item.HelpType && <h3>Services: {item.HelpType}</h3>}
            <address>{`${item.City}, ${item.State}`}</address>
          </div>
        ))
      ) : (
        <p>No data available.</p>
      )}
    </div>
  );
}
