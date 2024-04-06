import Reac, { useState, useEffect, useContext } from "react";
import "../misc/style.css";
import { set, update, remove, ref as RDref, onValue } from "firebase/database";
import { database } from "../../config/firebase";
import { v4 as uuid4 } from "uuid";
import { Button, Modal, Form, Dropdown, ButtonGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import { dataBank, formatMoney } from "../misc/xdata";
import moment from "moment";
import { AuthContextFM } from "../misc/contextApp";
import { Helmet } from "react-helmet";
import { Autocomplete, TextField } from "@mui/material";
import serverPoint from "../misc/server-point";
import { uid } from "uid";

function Trxs() {
  const [dataTrxF, setdataTrxF] = useState([]);
  const [dataBanks, setdataBanks] = useState([]);
  const [dataPlayers, setdataPlayers] = useState([]);
  const [trxType, settrxType] = useState([]);
  const [modalTittle, setmodalTittle] = useState("");
  const [selectedType, setselectedType] = useState("");
  const [selectedBankId, setselectedBankId] = useState("");
  const [selectedPlayerId, setselectedPlayerId] = useState("");
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const initialFormData = {
    TransactionPurpose: "-",
    TransactionAmount: 0,
    transferFee: 0,
    transaction_remarks: "-",
    target_bank_id: "",
    TransactionDate_from_bank: "",
    start_date_time: "",
    end_date_time: "",
    settlement_type: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const getTrxDatabyBank = async () => {
    console.log("Get data trx bank");
    await serverPoint.get("/banktrx").then((res) => {
      const server_response = res.data;
      console.log(server_response);
      setdataTrxF(server_response.data);
    });
  };

  const getDatabank = async () => {
    console.log("Get data bank");
    await serverPoint.get("/bank").then((res) => {
      const server_response = res.data;
      console.log(server_response.message);
      setdataBanks(server_response.data);
    });
  };

  const getDataPlayer = async () => {
    console.log("Get Data player");
    await serverPoint.get("/player").then((res) => {
      const server_response = res.data;
      console.log("server response : ", server_response);
      setdataPlayers(server_response.data);
    });
  };

  const getAllTrxType = async () => {
    console.log("Get Data player");
    await serverPoint.get("banktrxdetail/alltrxtype").then((res) => {
      const server_response = res.data;
      console.log("server response : ", server_response);
      settrxType(server_response.data);
    });
  };

  const performTrx = ({ idBank, trxTipe, trxName }) => {
    handleShow();
    setFormData(initialFormData);
    setmodalTittle(trxName);
    setselectedType(trxTipe);
    setselectedBankId(idBank);
    console.log("perform : ", idBank);
  };

  const saveTrx = async () => {
    console.log("Main Trx");
    const staffInput = userInfo.user_entry_id
    const new_bank_trx_id = uid(20);
    const new_bank_trx_id2 = uid(20);
    const new_bank_trx_id3 = uid(20);
    const new_id = uid(20);
    const new_id2 = uid(20);
    await serverPoint
      .post("/banktrx", {
        newid: new_bank_trx_id,
        CreateBy: staffInput,
        C_AccountNo: selectedBankId,
        TransactionAmount:
          selectedType == "DP"
            ? Number(formData.TransactionAmount)
            : selectedType == "WD"
            ? formData.TransactionAmount * -1
            : selectedType == "PDP"
            ? Number(formData.TransactionAmount)
            : selectedType == "TT"
            ? formData.TransactionAmount * -1
            : selectedType == "EXP"
            ? formData.TransactionAmount * -1
            : selectedType == "ADJS"
            ? Number(formData.TransactionAmount)
            : selectedType == "STLMN" && formData.settlement_type == 1
            ? formData.TransactionAmount * -1
            : Number(formData.TransactionAmount),
        transaction_remarks: formData.transaction_remarks,
        status: 1,
      })
      .then((res) => {
        console.log("POst Detail Trx : ", res.data);
        const server_response = res.data;
        console.log(server_response.message);
        handleClose();
        getTrxDatabyBank();
        const endpoint = `/banktrxdetail/${selectedType.toLowerCase()}`;
        let postData = {};
        switch (selectedType) {
          case "DP":
            postData = {
              bank_transaction_id: new_bank_trx_id,
              PlayerID: selectedPlayerId,
            };
            break;
          case "WD":
            postData = {
              new_id: new_id,
              bank_transaction_id: new_bank_trx_id,
              PlayerID: selectedPlayerId,
            };
            break;
          case "PDP":
            postData = {
              bank_transaction_id: new_bank_trx_id,
            };
            break;
          case "TT":
            postData = {
              new_id: new_id,
              bank_transaction_id: new_bank_trx_id,
              target_bank_id: formData.target_bank_id,
              TransactionDate_from_bank: formData.TransactionDate_from_bank,
              TransactionDate_to_bank: formData.TransactionDate_to_bank,
            };
            break;
          case "EXP":
            postData = {
              bank_transaction_id: new_bank_trx_id,
            };
            break;
          case "ADJS":
            postData = {
              bank_transaction_id: new_bank_trx_id,
            };
            break;
          case "STLMN":
            postData = {
              bank_transaction_id: new_bank_trx_id,
              new_id: new_id,
              target_bank_id:
                formData.settlement_type == 1 ? formData.target_bank_id : "-",
              start_date_time: moment(formData.start_date_time).format(
                "YYYY-MM-DD HH:mm:ss"
              ),
              end_date_time: moment(formData.end_date_time).format(
                "YYYY-MM-DD HH:mm:ss"
              ),
              settlement_type: formData.settlement_type,
            };
            break;
          default:
            alert("Error!");
            break;
        }
        serverPoint
          .post(endpoint, postData)
          .then((res) => {
            getTrxDatabyBank();
            const server_response = res.data;
            console.log("second : ", res.data);
            console.log(server_response.message);
          })
          .then((res) => {
            getTrxDatabyBank();
            if (
              selectedType == "WD" ||
              selectedType == "TT" ||
              (selectedType == "STLMN" && formData.settlement_type == 1)
            ) {
              console.log("Post Main Transaction for Transfer Fee : ");
              serverPoint
                .post("/banktrx", {
                  newid: new_bank_trx_id2,
                  CreateBy: staffInput,
                  C_AccountNo: selectedBankId,
                  TransactionAmount: formData.transferFee * -1,
                  transaction_remarks: formData.transaction_remarks,
                  status: 1,
                })
                .then((res) => {
                  getTrxDatabyBank();
                  const server_response = res.data;
                  console.log("third : ", res.data);
                  console.log(server_response.message);
                  serverPoint
                    .post("/banktrxdetail/tfe", {
                      bank_transaction_id: new_bank_trx_id2,
                      transaction_from: new_id,
                    })
                    .then((res) => {
                      if (
                        selectedType == "TT" ||
                        (selectedType == "STLMN" &&
                          formData.settlement_type == 1)
                      ) {
                        serverPoint
                          .post("/banktrx", {
                            newid: new_bank_trx_id3,
                            CreateBy: staffInput,
                            C_AccountNo: formData.target_bank_id,
                            TransactionAmount: formData.TransactionAmount,
                            transaction_remarks: formData.transaction_remarks,
                            status: 1,
                          })
                          .then((res) => {
                            serverPoint
                              .post("/banktrxdetail/tt", {
                                new_id: new_id2,
                                bank_transaction_id: new_bank_trx_id3,
                                target_bank_id: "-",
                                TransactionDate_from_bank: "-",
                                TransactionDate_to_bank: "-",
                              })
                              .then((res) => {
                                getTrxDatabyBank();
                                const server_response = res.data;
                                console.log("fourth : ", res.data);
                                console.log(server_response.message);
                                alert("Data berhasil diinput!");
                              });
                          });
                      } else {
                        getTrxDatabyBank();
                        const server_response = res.data;
                        console.log("fourth : ", res.data);
                        console.log(server_response.message);
                        alert("Data berhasil diinput!");
                      }
                    });
                });
            } else {
              alert("Data Berhasil Diinput!!");
            }
          });
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
    getTrxDatabyBank();
    getDatabank();
    getDataPlayer();
    getAccountInfo();
    getAllTrxType();
    console.log("suerssss : ", userInfo);
  }, []);

  return (
    <div className="containcontent">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Xdom - Transaction</title>
      </Helmet>
      {dataTrxF.length == 0 ? (
        <div className="empty-data">
          <p>No data available yet.</p>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
            <td>No. </td>
                <th>Bank</th>
                <th>Account Name</th>
                <th>Account No</th>
                <th>Current Balance</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {dataTrxF.map((item, index) => (
                <tr key={index} style={{
                  backgroundColor:
                    item.BankPurpose === "Deposit"
                      ? "#87CEEB"
                      : item.BankPurpose === "Withdraw"
                      ? "#FFD700"
                      : item.BankPurpose === "Saving"
                      ? "#DBCC95"
                      : "#87CEEB",
                }}>
                  <td>{index + 1}</td>
                  <td>
                    <Link to={"/bank/" + item.C_AccountNo}>
                      {item.C_AccountNo}
                    </Link>
                  </td>
                  <td>
                    <div>{item.C_AccountName}</div>
                  </td>
                  <td>
                    <div>{item.C_Bank}</div>
                  </td>
                  <td>{formatMoney(item.current_balance)}</td>
                  <td>
                    {trxType.map((item2) => (
                      <button
                        onClick={() =>
                          performTrx({
                            idBank: item.C_AccountNo,
                            trxTipe: item2.transaction_type_code,
                            trxName: item2.transaction_type_name,
                          })
                        }
                        className="btn btn-primary"
                      >
                        {item2.transaction_type_code}
                      </button>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{modalTittle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <table className="formTable">
              {selectedType == "STLMN" ? (
                <>
                  <tr>
                    <td>
                      <Form.Label>Start Date Time</Form.Label>
                    </td>
                    <td>
                      <Form.Control
                        onChange={handleChange}
                        type="date"
                        id="start_date_time"
                        name="start_date_time"
                        value={formData.start_date_time}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <Form.Label>End Date Time</Form.Label>
                    </td>
                    <td>
                      <Form.Control
                        onChange={handleChange}
                        type="date"
                        id="end_date_time"
                        name="end_date_time"
                        value={formData.end_date_time}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <Form.Label>Settlement Type</Form.Label>
                    </td>
                    <td>
                      <Form.Select
                        id="settlement_type"
                        name="settlement_type"
                        value={formData.settlement_type}
                        onChange={handleChange}
                      >
                        <option>Pilih</option>
                        <option value={1}>Debit</option>
                        <option value={2}>Credit</option>
                      </Form.Select>
                    </td>
                  </tr>
                </>
              ) : null}
              {selectedType == "TT" ||
              (selectedType == "STLMN" && formData.settlement_type == 1) ? (
                <tr>
                  <td>
                    <Form.Label>To Bank</Form.Label>
                  </td>
                  <td>
                    <Form.Select
                      id="target_bank_id"
                      name="target_bank_id"
                      value={formData.target_bank_id}
                      onChange={handleChange}
                    >
                      <option value={""}>Pilih</option>
                      {dataBanks.map((item) => (
                        <option key={item.C_AccountNo} value={item.C_AccountNo}>
                          {`${item.C_Bank} - ${item.C_AccountNo}`}
                        </option>
                      ))}
                    </Form.Select>
                  </td>
                </tr>
              ) : null}
              {selectedType == "DP" || selectedType == "WD" ? (
                <tr>
                  <td>
                    <Form.Label>Choose Player</Form.Label>
                  </td>
                  <td>
                    <Autocomplete
                      disablePortal
                      id="userName-demo"
                      options={dataPlayers}
                      getOptionLabel={(dataPlayers) => dataPlayers.PlayerName}
                      onChange={(e, v) => setselectedPlayerId(v.PlayerID)}
                      noOptionsText={"No user available"}
                      sx={{ width: 250 }}
                      renderInput={(params) => (
                        <TextField {...params} label="username" />
                      )}
                    />
                  </td>
                </tr>
              ) : null}
              <tr>
                <td>
                  <Form.Label>Amount</Form.Label>
                </td>
                <td>
                  <Form.Control
                    onChange={handleChange}
                    type="number"
                    id="TransactionAmount"
                    name="TransactionAmount"
                    value={formData.TransactionAmount}
                    inputMode="decimal"
                  />
                </td>
              </tr>
              {selectedType == "WD" ||
              selectedType == "TT" ||
              (selectedType == "STLMN" && formData.settlement_type == 1) ? (
                <tr>
                  <td>
                    <Form.Label>Transfer Fee</Form.Label>
                  </td>
                  <td>
                    <Form.Control
                      onChange={handleChange}
                      type="tfFee"
                      id="transferFee"
                      name="transferFee"
                      value={formData.transferFee}
                    />
                  </td>
                </tr>
              ) : null}
              {selectedType == "TT" ? (
                <>
                  <tr>
                    <td>
                      <Form.Label>Transaction Date From Bank</Form.Label>
                    </td>
                    <td>
                      <Form.Control
                        onChange={handleChange}
                        type="datetime-local"
                        id="trxDateFBank"
                        name="trxDateFBank"
                        value={formData.trxDateFBank}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <Form.Label>Transaction Date To Bank</Form.Label>
                    </td>
                    <td>
                      <Form.Control
                        onChange={handleChange}
                        type="datetime-local"
                        id="trxDateTBank"
                        name="trxDateTBank"
                        value={formData.trxDateTBank}
                      />
                    </td>
                  </tr>
                </>
              ) : null}
              {selectedType != "DP" && selectedType != "WD" ? (
                <tr>
                  <td>
                    <Form.Label>Remarks</Form.Label>
                  </td>
                  <td>
                    <Form.Control
                      as="textarea"
                      id="transaction_remarks"
                      name="transaction_remarks"
                      onChange={handleChange}
                      value={formData.transaction_remarks}
                    />
                  </td>
                </tr>
              ) : null}
            </table>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Tutup
          </Button>
          <Button variant="primary" onClick={() => saveTrx()}>
            Simpan
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Trxs;
