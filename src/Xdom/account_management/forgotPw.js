import "../misc/style.css";
import React, { useCallback, useContext, useState, useEffect } from "react";
import { Container, Row, Col, Button, Form, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import serverPoint from "../misc/server-point";
import bycrpt from "bcryptjs";
import { AuthContextFM } from "../misc/contextApp";
import Logo from "../Resources/logo.png";
import useAuth from "../misc/useAuth";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const Confirm = () => {
  const navigate = useNavigate();
  const [username, setusername] = useState("");
  const [passwd, setpasswd] = useState('')
  const [passwd2, setpasswd2] = useState('')
  const [userData, setuserData] = useState([]);
  const [allowresetpw, setallowresetpw] = useState(false);
  const [userId, setuserId] = useState("");

  const chkUser = () => {
    let user = userData.find((user) => user.username === username);
    if (user) {
      setuserId(user.user_entry_id);
      setallowresetpw(true);
    } else {
      alert("username tidak valid!");
    }
  };

  const resetPw = () => {
    console.log(`Reset pw for ${userId}`);
    const hashedPW = bycrpt.hashSync(passwd, 10)
    if (passwd == passwd2) {
      serverPoint.patch(`/userentry/password/${userId}`,{
        newPassword: hashedPW
      }).then((res)=>{
        console.log(res.data);
        alert(res.data.message)
        navigate('/login')
      })
    } else {
      alert('Password does not match!')
    }
  };

  const getUserData = () => {
    serverPoint.get("/userentry").then((res) => {
      const server_response = res.data;
      console.log(server_response);
      setuserData(server_response.data);
    });
  };

  useEffect(() => {
    getUserData();
  }, []);

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
          {allowresetpw ? (
            <div>
              <Form.Group className="mb-3" controlId="formBasicpasswd">
              <Form.Label>Enter New Password</Form.Label>
              <Form.Control
                name="passwd"
                type="password"
                placeholder="Enter Password"
                onChange={(e) => setpasswd(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
            <Form.Label>Confirm New Password</Form.Label>
              <Form.Control
                name="passwd2"
                type="password"
                placeholder="Confirm New Password"
                onChange={(e) => setpasswd2(e.target.value)}
              />
            </Form.Group>
            <Button onClick={resetPw}>Reset Password</Button>
            </div>
          ) : (
            <Form.Group className="mb-3" controlId="formBasicuserName">
              <Form.Label>Username</Form.Label>
              <Form.Control
                name="username"
                type="text"
                placeholder="Enter User Name"
                onChange={(e) => setusername(e.target.value)}
              />
              <Button onClick={chkUser}>Confirm</Button>
            </Form.Group>
          )}
        </Form>
      </div>
    </div>
  );
};

export default Confirm;
