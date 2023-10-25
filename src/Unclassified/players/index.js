import Reac, { useState, useEffect, useContext } from "react";
import "../misc/style.css";
import { Form, Modal, Button } from "react-bootstrap";
import { set, update, remove, ref as RDref, onValue } from "firebase/database";
import { database } from "../../config/firebase";
import { v4 as uuid4 } from "uuid";
import { Helmet } from "react-helmet";
import { AuthContextFM } from "../misc/contextApp";
import { formatMoney } from "../misc/xdata";

function Players() {
  const { userInfo, playersData } = useContext(AuthContextFM);
  const [searchTxt, setsearchTxt] = useState("");
  const [btnName, setbtnName] = useState("");
  const initialFormData = {
    id: "",
    name: "",
    phone: "-",
    email: "-",
    selectedBank: "",
    accountName: "",
    accountNumber: "",
    userStatus : '-'
  };
  const [formData, setFormData] = useState(initialFormData);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  const addPlayer = () => {
    setbtnName("Add");
    setFormData({
      ...formData,
      id: uuid4(),
      name: "",
      phone: "-",
      email: "-",
      selectedBank: "",
      accountName: "",
      accountNumber: "",
    });
    handleShow();
    console.log(initialFormData);
  };

  const getBalancePlayer = (playerId) => {
    const dbRefPlayer = RDref(database, "/trxData");
    var balance = 0;
    onValue(
      dbRefPlayer,
      (snapshot) => {
        const data = [];
        snapshot.forEach((childSnapshot) => {
          const childKey = childSnapshot.key;
          const childData = childSnapshot.val();
          if (childData.playerId === playerId) {
            data.push(childData.amount);
          }
        });
        balance = data.reduce(
          (accumulator, currentValue) => accumulator + currentValue,
          0
        );
      },
      { onlyOnce: false }
    );
    return balance;
  };

  const updateData = (item) => {
    setbtnName("Update");
    console.log("Current Data : ", item);
    handleShow();
    setFormData({
      ...formData,
      id: item.id,
      accountName: item.accountName,
      accountNumber: item.accountNumber,
      email: item.email,
      name: item.name,
      phone: item.phone,
      selectedBank: item.selectedBank,
      userStatus : item.status
    });
  };

  const executeData = () => {
    console.log(formData);
    const isFormDataValid = Object.values(formData)
      .filter((key) => key != "id")
      .every((value) => value !== "");

    if (isFormDataValid) {
      let dateNow = Date.now();

      if (btnName == "Add") {
        set(RDref(database, "dataPlayer/" + formData.id), {
          id: formData.id,
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          selectedBank: formData.selectedBank,
          accountName: formData.accountName,
          accountNumber: formData.accountNumber,
          status : 'Active',
          timestamp: dateNow,
        })
          .then(() => {
            console.log("Data successfully posted to the database !");
            alert("Data player berhasil ditambahkan!");
            setFormData(initialFormData);
            handleClose();
          })
          .catch((error) => {
            console.error("Error writing data to the database:", error);
          });
      } else {
        update(RDref(database, "dataPlayer/" + formData.id), {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          selectedBank: formData.selectedBank,
          accountName: formData.accountName,
          accountNumber: formData.accountNumber,
          status : formData.userStatus,
          timestamp: dateNow,
        })
          .then(() => {
            console.log("Data successfully posted to the database !");
            alert("Data player berhasil diupdate!");
            setFormData(initialFormData);
            handleClose();
          })
          .catch((error) => {
            console.error("Error writing data to the database:", error);
          });
      }

      console.log("Form data is valid");
    } else {
      alert("Mohon isi semua!");
    }
  };

  return (
    <div className="containcontent">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Xdom - Player Lists</title>
      </Helmet>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            <h1>Players Leads Data Entry</h1>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <table className="formTable">
              <tr>
                <td>
                  <Form.Label>username</Form.Label>
                </td>
                <td>
                  <Form.Control
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <Form.Label>Phone No</Form.Label>
                </td>
                <td>
                  <Form.Control
                    type="text"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <Form.Label>Email</Form.Label>
                </td>
                <td>
                  <Form.Control
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <Form.Label>Bank*</Form.Label>
                </td>
                <td>
                  <Form.Control
                    type="text"
                    id="selectedBank"
                    name="selectedBank"
                    value={formData.selectedBank}
                    onChange={handleChange}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <Form.Label>Account Name</Form.Label>
                </td>
                <td>
                  <Form.Control
                    type="text"
                    id="accountName"
                    name="accountName"
                    value={formData.accountName}
                    onChange={handleChange}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <Form.Label>Account No</Form.Label>
                </td>
                <td>
                  <Form.Control
                    type="number"
                    id="accountNumber"
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleChange}
                  />
                </td>
              </tr>
              {btnName =='Update' ?   <tr>
              <td>
                  <Form.Label>Status</Form.Label>
                </td>
                <td>
                  <Form.Select
                    type="text"
                    id="userStatus"
                    name="userStatus"
                    value={formData.userStatus}
                    onChange={handleChange}
                  >
                    <option value={""}>Pilih</option>
                    <option value="aktif">Aktif</option>
                    <option value="non-aktif">Non Aktif</option>
                  </Form.Select>
                </td>
              </tr> : <div></div>}
            </table>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Tutup
          </Button>
          {btnName == "Add" ? (
            <Button variant="primary" onClick={() => executeData()}>
              {btnName}
            </Button>
          ) : (
            <Button variant="primary" onClick={() => executeData()}>
              {btnName}
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      <div>
        <button
          onClick={addPlayer}
          className="btn btn-primary"
          style={{ float: "right" }}
        >
          Add Players
        </button>
        {/* <div style={{ display: "flex" }}>
          <Form.Control
            style={{ width: "30%" }}
            type="text"
            value={searchTxt}
            onChange={(e)=>setsearchTxt(e.target.value)}
          />
          <button className="btn btn-primary">Search</button>
        </div> */}
      </div>

      {playersData.length == 0 ? (
        <div className="empty-data">
          <p>No data available yet.</p>
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>User Balance</th>
              <th>Phone No.</th>
              <th>Email</th>
              <th>Bank</th>
              <th>Acct. Name</th>
              <th>Acct. No</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {playersData.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{formatMoney(getBalancePlayer(item.id))}</td>
                <td>{item.phone}</td>
                <td>{item.email}</td>
                <td>{item.selectedBank}</td>
                <td>{item.accountName}</td>
                <td>{item.accountNumber}</td>
                <td>
                  <div>
                    <button
                      disabled={userInfo.role=='Staff' ? true : false}
                      className="btn btn-info"
                      onClick={() => updateData(item)}
                    >
                      Edit
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Players;
