import React, { useContext } from "react";
import { Outlet, Navigate, Link } from "react-router-dom";
import { AuthContextFM } from "./contextApp";
import { Button } from "react-bootstrap";
import { auth } from "../../config/firebase";

const Navbar = () => {
  const { currentUser, userInfo } = useContext(AuthContextFM);
  React.useEffect(() => {
    console.log("Role : ", userInfo.role);
  }, []);

  const logOutHandling = () => {
    auth
      .signOut()
      .then(() => {
        alert("Berhasil keluar!");
      })
      .catch((error) => {
        // An error occurred while logging out
        console.error("Error logging out:", error);
      });
  };

  return (
    <nav>
      <div className="logo">X-Dom</div>
      <div className="tabs">
        <div className="tab">
          <Link to="/transaction">Transaction</Link>
        </div>
        <div className="tab">
          <Link to="/players">Players</Link>
        </div>
        <div className="tab">
          <Link to="/banks">Banks</Link>
        </div>
        {userInfo.role == "Admin" ? (
          <div className="tab">
            <Link to="/accountcenter">Account Management</Link>
          </div>
        ) : (
          <div></div>
        )}
      </div>
      <div className="tab">
        <div>Login As : {userInfo.fullName}</div>
        <Button onClick={logOutHandling}>Logout</Button>
      </div>
    </nav>
  );
};

const PrivateRoutes = () => {
  const { currentUser } = useContext(AuthContextFM);
  return currentUser ? (
    <div>
      <Navbar />
      <Outlet />
    </div>
  ) : (
    <Navigate to="/login" />
  );
};

export default PrivateRoutes;
