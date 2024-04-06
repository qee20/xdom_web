import Reac, { useState, useEffect, useContext } from "react";
import "../misc/style.css";
import { Form, Modal, Button } from "react-bootstrap";
import { set, update, remove, ref as RDref, onValue } from "firebase/database";
import { database } from "../../config/firebase";
import { v4 as uuid4 } from "uuid";
import { Helmet } from "react-helmet";
import { AuthContextFM } from "../misc/contextApp";

function Banks() {
  const {  userInfo, bankData } = useContext(AuthContextFM);
  const [btnName, setbtnName] = useState("");
  const initialFormData = {
    id: "",
    bankName: "",
    status: "",
    accountName: "",
    accountNumber: "",
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

  const addBankData = () => {
    setbtnName("Add");
    setFormData({
      ...formData,
      id: uuid4(),
      bankName: "",
      status: "",
      accountName: "",
      accountNumber: "",
    });
    handleShow();
  };

  const executeData = () => {
    console.log(formData);
    const isFormDataValid = Object.values(formData)
      .filter((key) => key != "id")
      .every((value) => value !== "");

    if (isFormDataValid) {
      let dateNow = Date.now();
      if (btnName == "Add") {
        set(RDref(database, "dataBank/" + formData.id), {
          id: formData.id,
          bankName: formData.bankName,
          status: formData.status,
          accountName: formData.accountName,
          accountNumber: formData.accountNumber,
          timestamp: dateNow,
        })
          .then(() => {
            console.log("Data successfully posted to the database !");
            alert("Data bank berhasil ditambahkan!");
            setFormData(initialFormData);
            handleClose();
          })
          .catch((error) => {
            console.error("Error writing data to the database:", error);
          });
      } else {
        update(RDref(database, "dataBank/" + formData.id), {
          bankName: formData.bankName,
          status: formData.status,
          accountName: formData.accountName,
          accountNumber: formData.accountNumber,
          timestamp: dateNow,
        })
          .then(() => {
            console.log("Data successfully posted to the database !");
            alert("Data bank berhasil diupdate!");
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

  const updateData = (item) => {
    setbtnName("Update");
    console.log("Current Data : ", item);
    handleShow();
    setFormData({
      ...formData,
      id: item.id,
      accountName: item.accountName,
      accountNumber: item.accountNumber,
      bankName: item.bankName,
      status: item.status,
    });
  };

  return (
    <div className="containcontent">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Xdom - Bank Lists</title>
      </Helmet>
      <div>
        <button
          onClick={addBankData}
          className="btn btn-primary"
          style={{ float: "right" }}
        >
          Add Bank Account
        </button>
        {/* <div style={{ display: "flex" }}>
          <Form.Control
            style={{ width: "30%" }}
            type="text"
            id="accountNumber"
            name="accountNumber"
            placeholder="Bank Name"
            value={formData.accountNumber}
            onChange={handleChange}
          />
          <button className="btn btn-primary">Search</button>
        </div> */}
      </div>

      {bankData.length == 0 ? (
        <div className="empty-data">
          <p>No data available yet.</p>
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Acc No.</th>
              <th>Acct. Name</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {bankData.map((item, index) => (
              <tr key={index}>
                <td>{item.bankName}</td>
                <td>{item.accountNumber}</td>
                <td>{item.accountName}</td>
                <td>{item.status}</td>
                <td>
                  <div>
                    <button
                      className="btn btn-info"
                      disabled={userInfo.role=='Staff' ? true : false}
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

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            <h1>Banks Data Entry</h1>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <table className="formTable">
              <tr>
                <td>
                  <Form.Label>Bank*</Form.Label>
                </td>
                <td>
                  <Form.Control
                    type="text"
                    id="bankName"
                    name="bankName"
                    value={formData.bankName}
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
              {/* <tr>
              <td>
                  <Form.Label>Row Transaction</Form.Label>
                </td>
                <td>
                  <Form.Control
                    type="number"
                    id="rowTrx"
                    name="rowTrx"
                    value={formData.rowTrx}
                    onChange={handleChange}
                  />
                </td>
              </tr> */}
              <tr>
              <td>
                  <Form.Label>Status</Form.Label>
                </td>
                <td>
                  <Form.Select
                    type="text"
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value={""}>Pilih</option>
                    <option value="aktif">Aktif</option>
                    <option value="non-aktif">Non Aktif</option>
                  </Form.Select>
                </td>
              </tr>
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
    </div>
  );
}

export default Banks;
