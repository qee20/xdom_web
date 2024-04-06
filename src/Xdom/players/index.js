import React, { useState, useEffect, useContext } from "react";
import "../misc/style.css";
import { Form, Modal, Button } from "react-bootstrap";
import { set, update, remove, ref as RDref, onValue } from "firebase/database";
import { database } from "../../config/firebase";
import { v4 as uuid4 } from "uuid";
import { Helmet } from "react-helmet";
import { AuthContextFM } from "../misc/contextApp";
import { formatMoney } from "../misc/xdata";
import serverPoint from "../misc/server-point";
import moment from "moment";

function Players() {
  const [staffInput, setstaffInput] = useState("");
  const [playerData, setplayerData] = useState([])
  const [searchTxt, setsearchTxt] = useState("");
  const [btnName, setbtnName] = useState("");
  const initialFormData = {
    PlayerID : '-',
    player_name : '',
    player_bankname : '',
    player_bankaccountname : '',
    player_bankaccountno : '',
    player_email : '-',
    player_phoneno : '-',
    product : '-',
    remark : '-',
    playerStatus : '-',
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
    player_name : '',
    player_bankname : '',
    player_bankaccountname : '',
    player_bankaccountno : '',
    player_email : '-',
    player_phoneno : '-',
    product : '-',
    remark : '-',
    playerStatus : '-',
    });
    handleShow();
  };

  const getCurrentData = (item) => {
    setbtnName("Update");
    console.log("Current Data : ", item);
    handleShow();
    setFormData({
      ...formData,
      PlayerID : item.PlayerID,
      player_name: item.PlayerName,
      player_bankname: item.PlayerBankName,
      player_bankaccountname: item.PlayerAccountName,
      player_bankaccountno: item.PlayerAccountNo,
      player_email: item.PlayerEmail,
      player_phoneno: item.PlayerPhoneNo,
      product: item.Product,
      remark: item.Remark,
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
          .post("/player", {
            player_name: formData.player_name,
            player_bankname: formData.player_bankname,
            player_bankaccountname: formData.player_bankaccountname,
            player_bankaccountno: formData.player_bankaccountno,
            player_email: formData.player_email,
            player_phoneno: formData.player_phoneno,
            create_by: staffInput,
            product: formData.product,
            remark: formData.remark,
          })
          .then((res) => {
            console.log(res.data);
            const server_response = res.data;
            alert(server_response.message);
            handleClose();
            getAllPlayerData();
          }).catch((err)=> {
            if (err.response.data.serverMessage.code=='ER_DUP_ENTRY') {
              alert('Nomor Akun Bank atau Nama Player sudah dipakai! Gunakan yang lain.')
            } else {
              console.log(err);
            }
          })
      } else {
        await serverPoint
          .patch(`/player/${formData.PlayerID}`, {
            player_name: formData.player_name,
            player_bankname: formData.player_bankname,
            player_bankaccountname: formData.player_bankaccountname,
            player_bankaccountno: formData.player_bankaccountno,
            player_email: formData.player_email,
            player_phoneno: formData.player_phoneno,
            product: formData.product,
            remark: formData.remark,
            player_status : formData.playerStatus
          })
          .then((res) => {
            console.log(res.data);
            const server_response = res.data;
            alert(server_response.message);
            handleClose();
            getAllPlayerData();
          });
      }
      console.log("Form data is valid");
    } else {
      alert("Mohon isi semua!");
    }
  };

  const getAllPlayerData = async () => {
    await serverPoint.get("/player").then((res) => {
      const server_response = res.data;
      console.log('server response : ',server_response);
      setplayerData(server_response.data);
    });
  };

  const { currentUser, userInfo, setuserInfo } = useContext(AuthContextFM);

  const getAccountInfo = async () => {
    if (currentUser) {
      await serverPoint.get(`/userentry/${currentUser.uid}`).then((res) => {
        const server_response = res.data;
        console.log(server_response);
        setuserInfo(server_response.data);
      });
    }
  };

  useEffect(() => {
    console.log("Test !");
    getAllPlayerData();
    getAccountInfo()
    setstaffInput(userInfo.user_entry_id);
  }, []);

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
                  <Form.Label>Username</Form.Label>
                </td>
                <td>
                  <Form.Control
                    type="text"
                    id="player_name"
                    name="player_name"
                    value={formData.player_name}
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
                    id="player_phoneno"
                    name="player_phoneno"
                    value={formData.player_phoneno}
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
                    id="player_email"
                    name="player_email"
                    value={formData.player_email}
                    onChange={handleChange}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <Form.Label>Player's Bank</Form.Label>
                </td>
                <td>
                  <Form.Control
                    type="text"
                    id="player_bankname"
                    name="player_bankname"
                    value={formData.player_bankname}
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
                    id="player_bankaccountname"
                    name="player_bankaccountname"
                    value={formData.player_bankaccountname}
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
                    id="player_bankaccountno"
                    name="player_bankaccountno"
                    value={formData.player_bankaccountno}
                    onChange={handleChange}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <Form.Label>Product</Form.Label>
                </td>
                <td>
                  <Form.Control
                    type="text"
                    id="product"
                    name="product"
                    value={formData.product}
                    onChange={handleChange}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <Form.Label>Remark</Form.Label>
                </td>
                <td>
                  <Form.Control
                    as={'textarea'}
                    rows={3}
                    id="remark"
                    name="remark"
                    value={formData.remark}
                    onChange={handleChange}
                  />
                </td>
              </tr>
              {btnName == "Update" ? (
                <tr>
                  <td>
                    <Form.Label>Status</Form.Label>
                  </td>
                  <td>
                    <Form.Select
                      type="text"
                      id="playerStatus"
                      name="playerStatus"
                      value={formData.playerStatus}
                      onChange={handleChange}
                    >
                      <option value={""}>Pilih</option>
                      <option value={1}>Aktif</option>
                      <option value={2}>Non Aktif</option>
                    </Form.Select>
                  </td>
                </tr>
              ) : (
                <div></div>
              )}
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
          onClick={resetForm}
          className="btn btn-primary"
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

      {playerData.length == 0 ? (
        <div className="empty-data">
          <p>No data available yet.</p>
        </div>
      ) : (
        <div className="table-container">
          <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>User Balance</th>
              <th>First DP Date</th>
              <th>Last DP Date</th>
              <th>First WD Date</th>
              <th>Last WD Date</th>
              <th>DP Times</th>
              <th>WD Times</th>
              <th>Diff Amount</th>
              <th>Phone No.</th>
              <th>Email</th>
              <th>Bank</th>
              <th>Acct. Name</th>
              <th>Acct. No</th>
              <th>Product</th>
              <th>Remark</th>
              <th>Created Date</th>
              <th>Created By</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {playerData.map((item, index) => (
              <tr key={index}>
                <td>{item.PlayerName}</td>
                <td>{formatMoney(item.current_balance)}</td>
                <td>{moment(item.mndeposit_date).format( "HH:mm, DD-MM-YYYY")}</td>
                <td>{moment(item.mxdeposit_date).format( "HH:mm, DD-MM-YYYY")}</td>
                <td>{moment(item.mnwithdraw_date).format( "HH:mm, DD-MM-YYYY")}</td>
                <td>{moment(item.mxwithdraw_date).format( "HH:mm, DD-MM-YYYY")}</td>
                <td>{item.deposit_count}</td>
                <td>{item.withdraw_count}</td>
                <td>{formatMoney(item.current_balance)}</td>
                <td>{item.PlayerPhoneNo}</td>
                <td>{item.PlayerEmail}</td>
                <td>{item.PlayerBankName}</td>
                <td>{item.PlayerAccountName}</td>
                <td>{item.PlayerAccountNo}</td>
                <td>{item.Product}</td>
                <td>{item.Remark}</td>
                <td>{moment(item.CreateDate).format( "HH:mm, DD-MM-YYYY")}</td>
                <td>{item.user_entry_name}</td>
                <td>{item.status}</td>
                <td>
                  <div>
                    <button
                      disabled={userInfo.UserRole == "Staff" ? true : false}
                      className="btn btn-info"
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
    </div>
  );
}

export default Players;
