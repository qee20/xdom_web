import React, { useContext } from "react";
import { Outlet, Navigate, Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { AuthContextFM } from "./contextApp";
import { Button } from "react-bootstrap";
import { auth } from "../../config/firebase";
import Logo from "../Resources/logo.png";
import UserImage from "../Resources/defaultuser.png";
import "../misc/style.css";
import useAuth from "./useAuth";
import Cookies from "js-cookie";

const Navbar = () => {
  const { userInfo } = useContext(AuthContextFM);
  React.useEffect(() => {
    console.log("Role : ", userInfo.role);
  }, []);

  return (
    <nav>
      <div class="sidenav">
        <div class="row">
          <div className="logo">
            <img style={{ height: 100 }} src={Logo} alt="" />
          </div>
          <div>
            <div
              class="nav flex-column nav-pills"
              id="v-pills-tab"
              role="tablist"
              aria-orientation="vertical"
            >
              <div className="tab">
                <NavLink
                  exact
                  to="/transaction"
                  className="nav-link"
                  activeClassName="active"
                  role="tab"
                  aria-controls="v-pills-home"
                  aria-selected="true"
                >
                  Transaction
                </NavLink>
              </div>
              <div className="tab">
                <NavLink
                  exact
                  to="/players"
                  className="nav-link"
                  activeClassName="active"
                  role="tab"
                  aria-controls="v-pills-home"
                  aria-selected="true"
                >
                  Players
                </NavLink>
              </div>
              <div className="tab">
                <NavLink
                  exact
                  to="/banks"
                  className="nav-link"
                  activeClassName="active"
                  role="tab"
                  aria-controls="v-pills-home"
                  aria-selected="true"
                >
                  Banks
                </NavLink>
              </div>
              {userInfo.username == "admin" ? (
                <div className="tab">
                  <NavLink
                    exact
                    to="/accountcenter"
                    className="nav-link"
                    activeClassName="active"
                    role="tab"
                    aria-controls="v-pills-home"
                    aria-selected="true"
                  >
                    Account Management
                  </NavLink>
                </div>
              ) : (
                <div></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

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
      <div class="col-md-3">
        <Navbar />
      </div>
      <div style={{ backgroundColor: "#427D9D" }} class="col-md-9">
        <div
          className="row"
          style={{ padding: "20px", backgroundColor: "white" }}
        >
          <div className="col-md-6">
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ margin: "5px" }}>
                <img
                  style={{
                    border: "1px solid black",
                    borderRadius: 50,
                    height: 100,
                  }}
                  src={UserImage}
                  alt="user image"
                />
              </div>
              <div style={{ margin: "5px" }}>
                <h3>Anda login sebagai :</h3>
                <h3>{userInfo.user_entry_name}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-6" style={{ textAlign: "right" }}>
            <Button onClick={logOutHandling}>Logout</Button>
          </div>
        </div>
        <div style={{ margin: "5px", color: "white" }}>
          {pathname == "/transaction"
            ? "Transaction"
            : pathname == "/players"
            ? "Player"
            : pathname == "/banks"
            ? "Banks"
            : pathname == "/accountcenter"
            ? "Account Management"
            : ""}
        </div>
        <div
          style={{
            backgroundColor: "white",
            boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.3)",
            borderRadius: 5,
            margin: "20px",
          }}
        >
          <Outlet />
        </div>
      </div>
    </div>
  ) : (
    <Navigate to="/login" />
  );
};

export default PrivateRoutes;
