import React, { useCallback, useContext } from "react";
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
import { Navigate } from "react-router-dom";
import { auth } from "../config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { AuthContext } from "../config/context";
import { Helmet } from "react-helmet";

function Login({ history }) {
  const handleLogin = useCallback(
    async (event) => {
      event.preventDefault();
      const { email, password } = event.target.elements;
      try {
        await signInWithEmailAndPassword(auth, email.value, password.value);
      } catch (error) {
        alert(error.message);
      }
    },
    [history]
  );
  const { currentUser } = useContext(AuthContext);
  if (currentUser) {
    return <Navigate to={"/admin"} />;
  }
  return (
    <Container>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Autolift - Login Admin</title>
      </Helmet>
      <Row>
        <Col>
          <Card>
            <Card.Header>Silahkan Masukkan Data Login</Card.Header>
            <Card.Body>
              {" "}
              <Form onSubmit={handleLogin}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    name="email"
                    type="email"
                    placeholder="Enter email"
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    name="password"
                    type="password"
                    placeholder="Password"
                  />
                </Form.Group>
                <Button variant="primary" type="submit">
                  Login
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
