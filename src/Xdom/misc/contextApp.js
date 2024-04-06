import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import serverPoint from "./server-point";

export const AuthContextFM = React.createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userInfo, setuserInfo] = useState([]);
  const [loginstatus, setloginstatus] = useState(false)
  const [playersData, setplayersData] = useState([])
  const [bankData, setbankData] = useState([])
  const [formData, setformData] = useState([])
  const [auth, setauth] = useState({})

  const getUserInfo = async (username) => { 
    await serverPoint
    .post("/userentry/login", {
      username: username,
    }).then((res)=>{
      const userdata = res.data.userdata;
      setuserInfo(userdata);
    })
   }

  useEffect(() => {
    const username = Cookies.get('username');
    if (username == undefined) {
      setloginstatus(false)
      console.log('Gk ada data!');
    }
    else{
      getUserInfo(username)
      setloginstatus(true)
      console.log('data ada!');
    }
  }, []);

  return (
    <AuthContextFM.Provider value={{ currentUser, userInfo, setuserInfo, bankData, setbankData, playersData, setplayersData, formData, setformData, loginstatus, setloginstatus, auth, setauth }}>
      {children}
    </AuthContextFM.Provider>
  );
};
