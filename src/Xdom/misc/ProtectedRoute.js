import React, { useContext } from "react";
import { Outlet, Navigate, Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { AuthContextFM } from "./contextApp";
import { Button } from "react-bootstrap";
import { auth } from "../../config/firebase";
import UserImage from "../Resources/defaultuser.png";
import "../misc/style.css";
import useAuth from "./useAuth";
import Cookies from "js-cookie";
import Dashboard from '../mainpage/index'

const PrivateRoutes = () => {
  const navigate = useNavigate()
  const location = useLocation();
  const { auth } = useAuth();
  const { hash, pathname, search } = location;
  const { currentUser, userInfo, setuserInfo, loginstatus, setloginstatus } =
    useContext(AuthContextFM);
  React.useEffect(() => {
    console.log("Role : ", userInfo.role);
    console.log(location);
  }, []);
  const logOutHandling = () => {
    Cookies.remove('username')
    setloginstatus(false);
    navigate('/login')
  };
  return loginstatus ? (
    <div id="app" className="row">
      <Dashboard/>
    </div>
  ) : (
    <Navigate to="/login" />
  );
};

export default PrivateRoutes;
