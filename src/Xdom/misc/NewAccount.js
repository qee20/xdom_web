import React, { useContext, useEffect, useState } from "react";
import firebase from "firebase/app";
import { createUserWithEmailAndPassword } from "firebase/auth";
import "../misc/style.css";
import { auth } from "../../config/firebase";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Tab,
  Nav,
  Tabs,
  Card,
} from "react-bootstrap";
import { Helmet } from "react-helmet";
import { Link, useNavigate } from "react-router-dom";
import { set, update, remove, ref as RDref, onValue } from "firebase/database";
import { database } from "../../config/firebase";
import { AuthContextFM } from "./contextApp";
import serverPoint from "./server-point";

function Registration() {
  const { userInfo } = useContext(AuthContextFM);
  const navigate = useNavigate();
  const [userData, setuserData] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState(0);
  const [phone, setphone] = useState('')

  const resetForm = () => { 
    setEmail("");
    setPassword("");
    setFullName("");
    setRole(0);
    setphone("")
   }

  const handleRegistration = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password).then(
        (res) => {
          console.log(res.user);
          serverPoint.post('/userentry',{
            user_entry_id : res.user.uid,
            user_entry_name : fullName,
            Email : email,
            UserRole : role,
            Phone : phone
          }).then((res) => {
            alert("New Account has created!");
            resetForm()
          });
        }
      );
    } catch (error) {
      console.error("Error registering user:", error.message);
    }
  };

  const updateRole = ({ userParam, roleValue }) => {
    const isConfirmed = window.confirm("Update Role ?");

    if (isConfirmed) {
      console.log(userParam, roleValue);
    } else {
      console.log("Update canceled by user");
    }
  };

  const getUserData = () => {
    serverPoint.get('/userentry').then((res)=>{
      const server_response = res.data
      console.log(server_response);
      setuserData(server_response.data)
    })
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <Container>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Xdom - Register</title>
      </Helmet>
      <Tabs
        defaultActiveKey="profile"
        id="justify-tab-example"
        className="mb-3"
        justify
      >
        <Tab eventKey="home" title="Register">
          <div>
            <div style={{ padding: 10 }}>
              <h1>Xdom User Register</h1>
            </div>
            <Row>
              <Col>
                <Card>
                  <Card.Header>Masukkan data untuk akun baru</Card.Header>
                  <Card.Body>
                    <Form>
                      <Form.Group className="mb-3" controlId="formBasicName">
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control
                          name="fullName"
                          type="text"
                          placeholder="Enter Full Name"
                          onChange={(e) => setFullName(e.target.value)}
                        />
                      </Form.Group>
                      <Form.Group className="mb-3" controlId="formBasicPhoneNumber">
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control
                          name="phone"
                          type='tel'
                          placeholder="Enter Phone Number"
                          onChange={(e) => setphone(e.target.value)}
                        />
                      </Form.Group>
                      <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                          name="email"
                          type="email"
                          placeholder="Enter email"
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </Form.Group>
                      <Form.Group
                        className="mb-3"
                        controlId="formBasicPassword"
                      >
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                          name="password"
                          type="password"
                          placeholder="Password"
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </Form.Group>
                      <Form.Group className="mb-3" controlId="formBasicRole">
                        <Form.Label>Role</Form.Label>
                        <Form.Select
                          name="role"
                          onChange={(e) => setRole(e.target.value)}
                        >
                          <option value={0}>== Select One ==</option>
                          <option value={1}>Admin</option>
                          <option value={2}>Staff</option>
                        </Form.Select>
                      </Form.Group>
                      <Button variant="primary" onClick={handleRegistration}>
                        Create New Account
                      </Button>
                    </Form>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>
        </Tab>
        <Tab eventKey="profile" title="User Lists">
          <div>
            <table>
              <thead>
                <tr>
                  <th>id</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {userData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.user_entry_id}</td>
                    <td>{item.user_entry_name}</td>
                    <td>{item.Email}</td>
                    <td>{item.Phone}</td>
                    <td>
                      <Form.Select
                      disabled={userInfo.uid == item.uid ? true : false}
                        name="role"
                        onChange={(e) =>
                          updateRole({
                            userParam: item,
                            roleValue: e.target.value,
                          })
                        }
                        defaultValue={item.UserRole}
                        value={item.UserRole}
                      >
                        <option>Admin</option>
                        <option>Staff</option>
                      </Form.Select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Tab>
      </Tabs>
    </Container>
  );
}

export default Registration;
