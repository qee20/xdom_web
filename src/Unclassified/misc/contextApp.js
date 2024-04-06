import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { auth } from "../../config/firebase";
import {
  set,
  remove,
  ref as RDref,
  onValue,
  push,
  get,
} from "firebase/database";
import { storage, database } from "../../config/firebase";

export const AuthContextFM = React.createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userInfo, setuserInfo] = useState([]);
  const [playersData, setplayersData] = useState([])
  const [bankData, setbankData] = useState([])

  const getDatabank = () => {
    const dbRefBank = RDref(database, "/dataBank");

    onValue(
      dbRefBank,
      (snapshot) => {
        const data = [];
        snapshot.forEach((childSnapshot) => {
          const childKey = childSnapshot.key;
          const childData = childSnapshot.val();
          data.push(childData);
        });
        console.log(data);
        setbankData(data);
      },
      { onlyOnce: false }
    );
  };

  const getDataPlayer = () => {
    const dbRefPlayer = RDref(database, "/dataPlayer");

    onValue(
      dbRefPlayer,
      (snapshot) => {
        const data = [];
        snapshot.forEach((childSnapshot) => {
          const childKey = childSnapshot.key;
          const childData = childSnapshot.val();
          data.push(childData);
        });
        console.log(data);
        setplayersData(data);
      },
      { onlyOnce: false }
    );
  };
 

  useEffect(() => {
    auth.onAuthStateChanged(setCurrentUser);
    getDataPlayer()
    getDatabank()
  }, []);

  return (
    <AuthContextFM.Provider value={{ currentUser, userInfo, setuserInfo, bankData, setbankData, playersData, setplayersData }}>
      {children}
    </AuthContextFM.Provider>
  );
};
