import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { auth } from "./firebase";
import { set, remove, ref as RDref, onValue, push } from "firebase/database";
import { storage, database } from "../config/firebase";

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [email, setemail] = useState("");
  const [noHP, setnoHP] = useState("");
  const [displayIT, setdisplayIT] = useState("block");
  const [urlDocument, seturlDocument] = useState("");
  const [officeAddr, setOfficeAddr] = useState("");
  const [officeAddr2, setofficeAddr2] = useState("");
  const [compName, setcompName] = useState("");
  const [rumahBG, setrumahBG] = useState("");
  const [cafeBG, setcafeBG] = useState("");
  const [koantorBG, setkoantorBG] = useState("");

  useEffect(() => {
    auth.onAuthStateChanged(setCurrentUser);
    getData();
  }, []);

  const getData = () => {
    const dbRefGal = RDref(database, "/Info_Situs/SItusXX");

    onValue(
      dbRefGal,
      (snapshot) => {
        const data = [];
        snapshot.forEach((childSnapshot) => {
          const childKey = childSnapshot.key;
          const childData = childSnapshot.val();
          data.push(childData);
        });
        console.log(data);
        setOfficeAddr(data[0]);
        setofficeAddr2(data[1]);
        setcafeBG(data[2]);
        setkoantorBG(data[3]);
        setrumahBG(data[4]);
        setcompName(data[5]);
        setemail(data[6]);
        seturlDocument(data[7]);
        setnoHP(data[8]);
      },
      { onlyOnce: false }
    );
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        displayIT,
        setdisplayIT,
        email,
        setemail,
        noHP,
        setnoHP,
        urlDocument,
        officeAddr,
        officeAddr2,
        compName,
        cafeBG,
        rumahBG,
        koantorBG,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
