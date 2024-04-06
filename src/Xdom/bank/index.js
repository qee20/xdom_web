import Reac, { useState, useEffect, useContext } from "react";
import "../misc/style.css";
import { Form, Modal, Button } from "react-bootstrap";
import { set, update, remove, ref as RDref, onValue } from "firebase/database";
import { database } from "../../config/firebase";
import { v4 as uuid4 } from "uuid";
import { Helmet } from "react-helmet";
import { AuthContextFM } from "../misc/contextApp";
import serverPoint from "../misc/server-point";

function Banks() {
  const { userInfo } = useContext(AuthContextFM);
  const [bankData, setBankData] = useState([]);
  const [newBankData, setnewBankData] = useState([])
  const [btnName, setbtnName] = useState("");
  const initialFormData = {
    bankName: "",
    status: "",
    accountName: "",
    accountNumber: "",
    bank_purpose: "-",
    bank_remark: "-",
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

  const resetForm = () => {
    setbtnName("Add");
    setFormData({
      ...formData,
      bankName: "",
      status: "",
      bank_purpose: "",
      bank_remark: "",
      accountName: "",
      accountNumber: "",
    });
    handleShow();
  };

  const getCurrentData = (item) => {
    setbtnName("Update");
    console.log("Current Data : ", item);
    handleShow();
    setFormData({
      ...formData,
      accountNumber: item.C_AccountNo,
      bankName: item.C_Bank,
      accountName: item.C_AccountName,
      bank_purpose: item.BankPurpose,
      bank_remark: item.Remark,
      status: item.Status,
    });
  };

  const executeData = async () => {
    console.log(formData);
    const isFormDataValid = Object.values(formData).every(
      (value) => value !== ""
    );

    if (isFormDataValid) {
      if (btnName == "Add") {
        await serverPoint
          .post("/bank", {
            accountNumber: formData.accountNumber,
            c_bank: formData.bankName,
            c_accountname: formData.accountName,
            bank_purpose: formData.bank_purpose,
            bank_remark: formData.bank_remark,
            bank_status: formData.status,
          })
          .then((res) => {
            console.log(res.data);
            const server_response = res.data;
            alert(server_response.message);
            handleClose();
            getAllBankData();
          });
      } else {
        await serverPoint
          .patch(`/bank/${formData.accountNumber}`, {
            c_bank: formData.bankName,
            c_accountname: formData.accountName,
            bank_purpose: formData.bank_purpose,
            bank_remark: formData.bank_remark,
            bank_status: formData.status,
          })
          .then((res) => {
            console.log(res.data);
            const server_response = res.data;
            alert(server_response.message);
            handleClose();
            getAllBankData();
          });
      }
      console.log("Form data is valid");
    } else {
      alert("Mohon isi semua!");
    }
  };

  const getAllBankData = async () => {
    await serverPoint.get("/bank").then((res) => {
      const server_response = res.data;
      console.log(server_response.message);
      setBankData(server_response.data);
    });
  };

  const updateOrder = () => { 
     alert('Update?')
   }

  useEffect(() => {
    console.log("Test !");
    getAllBankData();
  }, []);

  return (
    <div className="containcontent">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Xdom - Bank Lists</title>
      </Helmet>
      <div>
        <button onClick={resetForm} className="btn btn-primary">
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
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <td>No. </td>
                <th>Acc No.</th>
                <th>Name</th>
                <th>Acct. Name</th>
                <th>Purpose</th>
                <th>Remarks</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {bankData.map((item, index) => (
                <tr
                  key={index}
                  style={{
                    backgroundColor:
                      item.BankPurpose === "Deposit"
                        ? "#87CEEB"
                        : item.BankPurpose === "Withdraw"
                        ? "#FFD700"
                        : item.BankPurpose === "Saving"
                        ? "#DBCC95"
                        : "#87CEEB",
                  }}
                >
                  <td>
                    <Form.Select onChange={updateOrder}>
                      <option>{item.no_urut}</option>
                      <hr/>
                      {bankData.map((item, index)=>(
                        <option value={index+1}>{index+1}</option>
                      ))}
                    </Form.Select>
                  </td>
                  <td>{item.C_AccountNo}</td>
                  <td>{item.C_Bank}</td>
                  <td>{item.C_AccountName}</td>
                  <td>{item.BankPurpose}</td>
                  <td>{item.Remark}</td>
                  <td>{item.Status}</td>
                  <td>
                    <div>
                      <button
                        className="btn btn-info"
                        disabled={userInfo.UserRole == "Staff" ? true : false}
                        onClick={() => getCurrentData(item)}
                      >
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
              <tr>
                <td>
                  <Form.Label>Bank Purpose</Form.Label>
                </td>
                <td>
                  <Form.Select
                    type="text"
                    id="bank_purpose"
                    name="bank_purpose"
                    value={formData.bank_purpose}
                    onChange={handleChange}
                  >
                    <option value={0}>{"Pilih"}</option>
                    <option value={1}>Deposit</option>
                    <option value={2}>Withdraw</option>
                    <option value={3}>Saving</option>
                  </Form.Select>
                </td>
              </tr>
              <tr>
                <td>
                  <Form.Label>Remarks</Form.Label>
                </td>
                <td>
                  <Form.Control
                    type="text"
                    id="bank_remark"
                    name="bank_remark"
                    value={formData.bank_remark}
                    onChange={handleChange}
                  />
                </td>
              </tr>
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
                    <option value={""}>
                      {formData.status != "" ? formData.status : "Pilih"}
                    </option>
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
