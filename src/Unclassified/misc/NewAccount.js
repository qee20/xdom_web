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

function Registration() {
  const { userInfo } = useContext(AuthContextFM);
  const navigate = useNavigate();
  const [userData, setuserData] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("");

  const handleRegistration = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password).then(
        (res) => {
          console.log(res.user);
          set(RDref(database, "loginData/" + res.user.uid), {
            uid: res.user.uid,
            fullName: fullName,
            email: email,
            role: role,
          }).then((res) => {
            auth.signOut().then(() => {
              alert("New Account has created!");
              setEmail("");
              setPassword("");
              setFullName("");
              setRole("");
            });
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
      update(RDref(database, "loginData/" + userParam.uid), {
        role: roleValue,
      })
        .then(() => {
          alert("Role berhasil diupdate!");
        })
        .catch((error) => {
          console.error("Error writing data to the database:", error);
        });
    } else {
      console.log("Update canceled by user");
    }
  };

  const getUserData = () => {
    const dbRefBank = RDref(database, "/loginData");

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
        setuserData(data);
      },
      { onlyOnce: false }
    );
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
      <div style={{ padding: 10, textAlign: "center" }}>
        <h1>Xdom User Management</h1>
      </div>
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
                          <option>== Select One ==</option>
                          <option>Admin</option>
                          <option>Staff</option>
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
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {userData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.uid}</td>
                    <td>{item.fullName}</td>
                    <td>{item.email}</td>
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
                        defaultValue={item.role}
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
