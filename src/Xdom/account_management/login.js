import "../misc/style.css";
import React, { useCallback, useContext, useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Card,
  Spinner,
} from "react-bootstrap";
import { Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import serverPoint from "../misc/server-point";
import bycrpt from "bcryptjs";
import { AuthContextFM } from "../misc/contextApp";
import Logo from "../Resources/logo.png";
import useAuth from "../misc/useAuth";
import Cookies from "js-cookie";

function Login({ history }) {
  const [password, setPassword] = useState("");
  const [username, setusername] = useState("");
  const [loading, setloading] = useState(false);
  const { userinfo, setuserInfo, setloginstatus, loginstatus } = useContext(AuthContextFM);
  const { setauth } = useAuth();
  const [userlogin, setuserlogin] = useState(false);

  const login_account = async () => {
    setloading(true);
    await serverPoint
      .post("/userentry/login", {
        username: username,
      })
      .then((res) => {
        if (res.data.userdata) {
          const userdata = res.data.userdata;
          bycrpt.compare(password, userdata.password, function (err, isMatch) {
            if (err) {
              throw err;
            } else if (!isMatch) {
              alert("Password salah!!");
            } else {
              console.log("Password Match!!");
              setuserInfo(userdata)
              setloginstatus(true);
              Cookies.set("username", userdata.username);
            }
          });
        } else {
          alert("User Not Found");
        }
        setloading(false);
      })
      .catch((err) => {
        if (err.code == "ERR_NETWORK") {
          alert("Server tidak terhubung!");
        } else {
          alert(err);
        }
        setloading(false);
      });
  };

  if (loginstatus) {
    return <Navigate to={"/transaction"} />;
  }

  return (
    <div className="centered-content">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Xdom - Login</title>
      </Helmet>
      <div>
        <div className="logo">
          <img style={{ height: 100 }} src={Logo} alt="" />
        </div>
      </div>
      <div className="contentlogin">
        <Form>
          <Form.Group className="mb-3" controlId="formBasicuserName">
            <Form.Label>Username</Form.Label>
            <Form.Control
              name="username"
              type="text"
              placeholder="Enter User Name"
              onChange={(e) => setusername(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              name="password"
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          {loading ? (
            <Button variant="primary" disabled>
              <Spinner
                as="span"
                animation="grow"
                size="sm"
                role="status"
                aria-hidden="true"
              />
              Loading...
            </Button>
          ) : (
            <Button variant="primary" onClick={login_account}>
              Login
            </Button>
          )}
          {/* <p>
            Forgot password ? <a href="/account/confirm">Reset your Password</a>
          </p> */}
        </Form>
      </div>
    </div>
  );
}

export default Login;
