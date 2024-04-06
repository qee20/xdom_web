import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import CryptoJS from "crypto-js";

function Home() {
  const initialData = [
    { id: 1, name: "Sony" },
    { id: 4, name: "Motorolla" },
    { id: 5, name: "Samsung" },
    { id: 2, name: "Iphone" },
    { id: 3, name: "Xiaomi" },
  ];

  const [newData, setnewData] = useState([]);

  const updateOrder = ({ e, currentPos }) => {
    console.log(`current : ${currentPos} ,  target : ${e.target.value}`);

    // Get the new position from the select value
    const newPos = e.target.value;
    // Update the state of the newData array
    setnewData((prevState) => {
      // Make a copy of the previous state
      const newState = [...prevState];
      // Find the index of the item in the newState array
      const index = newState.findIndex((item) => item.id === currentPos);
      // Remove the item from its current position
      const [item] = newState.splice(index, 1);
      // Insert the item to the new position
      newState.splice(newPos - 1, 0, item);
      // Return the newState array
      return newState;
    });

    console.log("original", initialData);
    console.log("new", newData);
  };
  

  useEffect(() => {
    setnewData(initialData);
  }, []);

  initialData.sort((a, b) => a.id - b.id);

  return (
    <div>
      <h1>Thunder</h1>
      {newData.map((item) => (
        <div
          key={item.id}
          style={{
            margin: 5,
            border: "1px solid black",
            borderRadius: "15px",
            width: "100px",
            height: "auto",
            padding: 5,
          }}
        >
          <select
            value={item.id}
            onChange={(e) => updateOrder({ e, currentPos: item.id })}
          >
            {newData.map((item2) => (
              <option>{item2.id}</option>
            ))}
          </select>
          <div>{item.name}</div>
        </div>
      ))}
    </div>
  );
}

export default Home;
