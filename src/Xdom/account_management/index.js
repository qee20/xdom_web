import React, { useContext, useEffect, useState } from "react";
import "../misc/style.css";
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
import { AuthContextFM } from "../misc/contextApp";
import serverPoint from "../misc/server-point";
import bycrpt from 'bcryptjs'

function Account_Management() {
  const { userInfo } = useContext(AuthContextFM);
  const [userData, setuserData] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setusername] = useState('')
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("");
  const [phone, setphone] = useState('')

  const resetForm = () => { 
    setEmail("");
    setPassword("");
    setFullName("");
    setRole(0);
    setphone("")
    setusername("")
   }

  const handleRegistration = async () => {
    const hashedPW = bycrpt.hashSync(password, 10)

    await serverPoint.post('/userentry',{
        username : username,
        password : hashedPW,
        user_entry_name : fullName,
        Email : email,
        UserRole : role,
        Phone : phone
      }).then((res) => {
        getUserData()
      alert("New Account has created!");
      resetForm()
    }).catch((err)=> {
      if (err.response.data.serverMessage.code=='ER_DUP_ENTRY') {
        alert('username sudah dipakai! Gunakan yang lain.')
      } else {
        console.log(err);
      }
    })
  };

  const updateRole = ({ userParam, roleValue }) => {
    const isConfirmed = window.confirm("Update Role ?");

    if (isConfirmed) {
      console.log(userParam, roleValue);
      serverPoint.patch(`/userentry/role/${userParam}`,{
        UserRole: roleValue
      }).then((res)=>{
        console.log(res.data);
        alert(res.data.message)
        getUserData()
      })
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


  const resetPW = async (id) => { 
      const newPW =  window.prompt('Masukkan Password Baru')
      const hashedPW = bycrpt.hashSync(newPW, 10)
      console.log(id);
      if (newPW) {
        await serverPoint.patch(`/userentry/password/${id}`,{
          newPassword: hashedPW
        }).then((res)=>{
          console.log(res.data);
          alert(res.data.message)
        })
      } else {
        alert('Mohon isi!')
      }
   }

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
                    <Form.Group className="mb-3" controlId="formBasicuserName">
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                          value={username}
                          name="username"
                          type="text"
                          placeholder="Enter User Name"
                          onChange={(e) => setusername(e.target.value)}
                        />
                      </Form.Group>
                      <Form.Group className="mb-3" controlId="formBasicName">
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control
                          value={fullName}
                          name="fullName"
                          type="text"
                          placeholder="Enter Full Name"
                          onChange={(e) => setFullName(e.target.value)}
                        />
                      </Form.Group>
                      <Form.Group className="mb-3" controlId="formBasicPhoneNumber">
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control
                          value={phone}
                          name="phone"
                          type='tel'
                          placeholder="Enter Phone Number"
                          onChange={(e) => setphone(e.target.value)}
                        />
                      </Form.Group>
                      <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                          value={email}
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
                          value={password}
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
                          value={role}
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
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>username</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {userData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.username}</td>
                    <td>{item.user_entry_name}</td>
                    <td>{item.Email}</td>
                    <td>{item.Phone}</td>
                    <td>
                      <Form.Select
                      disabled={item.username === 'admin'}
                        name="role"
                        onChange={(e) =>
                          updateRole({
                            userParam: item.user_entry_id,
                            roleValue: e.target.value,
                          })
                        }
                        value={item.UserRole}
                      >
                        <option style={{color : 'grey', pointerEvents : 'none'}} value={0}>{`${item.UserRole} (Current Role)`}</option>
                        <option value={1}>Admin</option>
                        <option value={2}>Staff</option>
                      </Form.Select>
                    </td>
                    <td><Button onClick={()=>resetPW(item.user_entry_id)}>Reset Password</Button></td>
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

export default Account_Management;
