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

function Trxs() {
  const [dataTrxF, setdataTrxF] = useState([]);
  const [staffInput, setstaffInput] = useState("");
  const [dataBanks, setdataBanks] = useState([]);
  const [dataPlayers, setdataPlayers] = useState([]);
  const [trxType, settrxType] = useState("");
  const [selectedBankId, setselectedBankId] = useState("");
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const initialFormData = {
    staff: staffInput,
    amount: 0,
    bankId: "-",
    playerId: "-",
    timestamp: Date.now(),
    transferFee: 0,
    purpose: "-",
    remarks: "-",
    targetBankId: "-",
    trxDateFBank: moment(new Date()).format("YYYY-MM-DDThh:mm"),
    trxDateTBank: moment(new Date()).format("YYYY-MM-DDThh:mm"),
    sDate: "-",
    eDate: "-",
    stlmnType: "-",
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    console.log(formData);
  };

  const getTrxDatabyBank = () => {
    const dbRefPlayer = RDref(database, "/trxData");

    onValue(
      dbRefPlayer,
      (snapshot) => {
        const data = [];
        snapshot.forEach((childSnapshot) => {
          const childKey = childSnapshot.key;
          const childData = childSnapshot.val();
        });
      },
      { onlyOnce: false }
    );
  };

  const getPlayerNameByPlayerId = (playerId) => {
    const dbRefPlayer = RDref(database, `/dataPlayer/${playerId}`);
    var PlayerName = "";
    onValue(dbRefPlayer, (snapshot) => {
      const playerData = snapshot.val();
      PlayerName = playerData.name;
      console.log(PlayerName);
    });
    return PlayerName;
  };

  const getDatabank = () => {
    const dbRefBank = RDref(database, "/dataBank");

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
        setdataBanks(data);
      },
      { onlyOnce: false }
    );
  };

  const getDataPlayer = () => {
    const dbRefPlayer = RDref(database, "/dataPlayer");

    onValue(
      dbRefPlayer,
      (snapshot) => {
        const data = [];
        snapshot.forEach((childSnapshot) => {
          const childKey = childSnapshot.key;
          const childData = childSnapshot.val();
          data.push(childData);
        });
        console.log(data);
        setdataPlayers(data);
      },
      { onlyOnce: false }
    );
  };

  const getBalanceBank = (idBank) => {
    const dbRefPlayer = RDref(database, "/trxData");
    var balance = 0;
    onValue(
      dbRefPlayer,
      (snapshot) => {
        const data = [];
        snapshot.forEach((childSnapshot) => {
          const childKey = childSnapshot.key;
          const childData = childSnapshot.val();
          if (childData.bankId === idBank) {
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

  const addTrx = ({ trxTipe, idBank }) => {
    const dbRefPlayer = RDref(database, "/trxData");

    onValue(
      dbRefPlayer,
      (snapshot) => {
        const data = [];
        snapshot.forEach((childSnapshot) => {
          const childKey = childSnapshot.key;
          const childData = childSnapshot.val();
          if (childData.bankId === idBank) {
            data.push(childData);
          }
        });
        console.log(data);
        setdataTrxF(data);
      },
      { onlyOnce: false }
    );

    handleShow();
    console.log(trxTipe, idBank);
    settrxType(trxTipe);
    setselectedBankId(idBank);
  };

  const performTrx = () => {
    handleShow();
    let id = uuid4();
    let dateNow = Date.now();
    console.log("Post  : ", uuid4(), dateNow);
    set(RDref(database, "trxData/" + id), {
      id: id,
      staff: staffInput,
      bankId: selectedBankId,
      amount:
        trxType == "DEPOSIT"
          ? Number(formData.amount)
          : trxType == "WITHDRAW"
          ? formData.amount * -1
          : trxType == "PENDING"
          ? Number(formData.amount)
          : trxType == "TT"
          ? formData.amount * -1
          : trxType == "EXPENSE"
          ? formData.amount * -1
          : trxType == "SETTLEMENT" && formData.stlmnType == "debit"
          ? formData.amount * -1
          : Number(formData.amount),
      trxType: trxType,
      playerId: formData.playerId,
      timestamp: dateNow,
      purpose: formData.purpose,
      remarks: formData.remarks,
      targetBankId: formData.targetBankId,
      trxDateFBank: formData.trxDateFBank,
      trxDateTBank: formData.trxDateTBank,
      sDate: formData.sDate,
      eDate: formData.eDate,
      stlmnType: formData.stlmnType,
    })
      .then(() => {
        if (
          trxType == "WITHDRAW" ||
          trxType == "TT" ||
          trxType == "SETTLEMENT"
        ) {
          let id2 = uuid4();
          let dateNow2 = Date.now();
          set(RDref(database, "trxData/" + id2), {
            id: id,
            staff: staffInput,
            bankId: selectedBankId,
            amount: formData.transferFee * -1,
            trxType: "Transfer Fee",
            playerId: formData.playerId,
            timestamp: dateNow2,
            purpose: formData.purpose,
            remarks: "Transfer Fee - " + formData.remarks,
            targetBankId: formData.targetBankId,
            trxDateFBank: formData.trxDateFBank,
            trxDateTBank: formData.trxDateTBank,
            sDate: "-",
            eDate: "-",
            stlmnType: "-",
          }).then(() => {
            if (trxType == "TT") {
              let id3 = uuid4();
              let dateNow3 = Date.now();
              set(RDref(database, "trxData/" + id3), {
                id: id3,
                staff: staffInput,
                bankId: formData.targetBankId,
                amount: Number(formData.amount),
                trxType: "Incoming Transfer",
                playerId: "-",
                timestamp: dateNow3,
                purpose: formData.purpose,
                remarks: "Incoming Transfer from Other Bank" + formData.remarks,
                targetBankId: "-",
                trxDateFBank: "-",
                trxDateTBank: "-",
                sDate: "-",
                eDate: "-",
                stlmnType: "-",
              }).then(() => {
                console.log("Data successfully posted to the database !");
                handleClose();
                alert("Berhasil menambahkan transaksi!");
                setFormData(initialFormData);
              });
            } else {
              console.log("Data successfully posted to the database !");
              handleClose();
              alert("Berhasil menambahkan transaksi!");
              setFormData(initialFormData);
            }
          });
        } else {
          console.log("Pass, no Transfer Fee for this Transaction");
          console.log("Data successfully posted to the database !");
          handleClose();
          alert("Berhasil menambahkan transaksi!");
        }
      })
      .catch((error) => {
        console.error("Error writing data to the database:", error);
      });
  };

  const { currentUser, userInfo, setuserInfo } = useContext(AuthContextFM);

  const getAccountInfo = () => {
    if (currentUser) {
      const userRef = RDref(database, "loginData/" + currentUser.uid);
      onValue(
        userRef,
        (snapshot) => {
          setuserInfo(snapshot.val());
        },
        { onlyOnce: false }
      );
    }
  };

  useEffect(() => {
    getTrxDatabyBank();
    getDatabank();
    getDataPlayer();
    getAccountInfo();
    setstaffInput(userInfo.uid);
    console.log(moment(Date.now()).format());
  }, []);

  return (
    <div className="containcontent">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Xdom - Transaction</title>
      </Helmet>
      {dataBanks.length == 0 ? (
        <div className="empty-data">
          <p>No data available yet.</p>
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Bank</th>
              <th>Account Name</th>
              <th>Account No</th>
              <th>Current Balance</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {dataBanks.map((item, index) => (
              <tr key={item.id}>
                <td>
                  <Link to={"/bank/" + item.id}>{item.bankName}</Link>
                </td>
                <td>
                  <div>{item.accountName}</div>
                </td>
                <td>
                  <div>{item.accountNumber}</div>
                </td>
                <td>{formatMoney(getBalanceBank(item.id))}</td>
                <td>
                  <button
                    onClick={() =>
                      addTrx({ idBank: item.id, trxTipe: "DEPOSIT" })
                    }
                    className="btn btn-primary"
                  >
                    Deposit
                  </button>
                  <button
                    onClick={() =>
                      addTrx({ idBank: item.id, trxTipe: "WITHDRAW" })
                    }
                    className="btn btn-danger"
                  >
                    Withdraw
                  </button>
                  <button
                    className="btn btn-success"
                    onClick={() =>
                      addTrx({ idBank: item.id, trxTipe: "PENDING" })
                    }
                  >
                    PDP
                  </button>
                  <button
                    className="btn btn-warning"
                    onClick={() => addTrx({ idBank: item.id, trxTipe: "TT" })}
                  >
                    TT
                  </button>
                  <button
                    className="btn btn-warning"
                    onClick={() =>
                      addTrx({ idBank: item.id, trxTipe: "EXPENSE" })
                    }
                  >
                    EXP
                  </button>
                  <button
                    className="btn btn-info"
                    onClick={() =>
                      addTrx({ idBank: item.id, trxTipe: "ADJUSTMENT" })
                    }
                  >
                    ADJS
                  </button>
                  <button
                    className="btn btn-dark"
                    onClick={() =>
                      addTrx({ idBank: item.id, trxTipe: "SETTLEMENT" })
                    }
                  >
                    STLMN
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{trxType}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {trxType == "DEPOSIT" ? (
            <div>
              <table className="formTable">
                <tr>
                  <td>
                    <Form.Label>Choose Player</Form.Label>
                  </td>
                  <td>
                    <Autocomplete
                      disablePortal
                      id="userName-demo"
                      options={dataPlayers}
                      getOptionLabel={(dataPlayers) => dataPlayers.name}
                      onChange={(e, v) =>
                        setFormData({ ...formData, playerId: v.id })
                      }
                      noOptionsText={"No user available"}
                      sx={{ width: 250}}
                      renderInput={(params) => (
                        <TextField {...params} label="username" />
                      )}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <Form.Label>Amount</Form.Label>
                  </td>
                  <td>
                    <Form.Control
                      onChange={handleChange}
                      type="number"
                      id="amount"
                      name="amount"
                      value={formData.amount}
                      inputMode="decimal"
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <Form.Label>Transaction Date Time</Form.Label>
                  </td>
                  <td>
                    <Form.Control
                      onChange={handleChange}
                      disabled
                      type="text"
                      id="timestamp"
                      name="timestamp"
                      value={moment(formData.timestamp).format(
                        "DD/MM/YYYY hh:mm"
                      )}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <Form.Label>Transaction Type</Form.Label>
                  </td>
                  <td>
                    <Form.Check
                      type="switch"
                      id="trxType-switch"
                      label="Correction Purpose"
                    />
                  </td>
                </tr>
              </table>
            </div>
          ) : trxType == "WITHDRAW" ? (
            <div>
              <table className="formTable">
                <tr>
                  <td>
                    <Form.Label>Choose Player</Form.Label>
                  </td>
                  <td>
                  <Autocomplete
                      disablePortal
                      id="userName-demo"
                      options={dataPlayers}
                      getOptionLabel={(dataPlayers) => dataPlayers.name}
                      onChange={(e, v) =>
                        setFormData({ ...formData, playerId: v.id })
                      }
                      noOptionsText={"No user available"}
                      sx={{ width: 250}}
                      renderInput={(params) => (
                        <TextField {...params} label="username" />
                      )}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <Form.Label>Amount</Form.Label>
                  </td>
                  <td>
                    <Form.Control
                      onChange={handleChange}
                      type="number"
                      id="amount"
                      name="amount"
                      value={formData.amount}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <Form.Label>Transfer Fee</Form.Label>
                  </td>
                  <td>
                    <Form.Control
                      onChange={handleChange}
                      type="number"
                      id="transferFee"
                      name="transferFee"
                      value={formData.transferFee}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <Form.Label>Transaction Date Time</Form.Label>
                  </td>
                  <td>
                    <Form.Control
                      onChange={handleChange}
                      disabled
                      type="text"
                      id="timestamp"
                      name="timestamp"
                      value={moment(formData.timestamp).format(
                        "DD/MM/YYYY hh:mm"
                      )}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <Form.Label>Transaction Type</Form.Label>
                  </td>
                  <td>
                    <Form.Check
                      type="switch"
                      id="trxType-switch"
                      label="Correction Purpose"
                    />
                  </td>
                </tr>
              </table>
            </div>
          ) : trxType == "PENDING" ? (
            <div>
              <table className="formTable">
                <tr>
                  <td>
                    <Form.Label>Amount</Form.Label>
                  </td>
                  <td>
                    <Form.Control
                      onChange={handleChange}
                      type="number"
                      id="amount"
                      name="amount"
                      value={formData.amount}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <Form.Label>Transaction Date Time</Form.Label>
                  </td>
                  <td>
                    <Form.Control
                      onChange={handleChange}
                      disabled
                      type="text"
                      id="timestamp"
                      name="timestamp"
                      value={moment(formData.timestamp).format(
                        "DD/MM/YYYY hh:mm"
                      )}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <Form.Label>Remarks</Form.Label>
                  </td>
                  <td>
                    <Form.Control
                      as="textarea"
                      id="remarks"
                      name="remarks"
                      onChange={handleChange}
                      value={formData.remarks}
                    />
                  </td>
                </tr>
              </table>
            </div>
          ) : trxType == "TT" ? (
            <div>
              <table className="formTable">
                <tr>
                  <td>
                    <Form.Label>To Bank</Form.Label>
                  </td>
                  <td>
                    <Form.Select
                      id="targetBankId"
                      name="targetBankId"
                      value={formData.targetBankId}
                      onChange={handleChange}
                    >
                      <option value={""}>Pilih</option>
                      {dataBanks.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.bankName}
                        </option>
                      ))}
                    </Form.Select>
                  </td>
                </tr>
                <tr>
                  <td>
                    <Form.Label>Amount</Form.Label>
                  </td>
                  <td>
                    <Form.Control
                      onChange={handleChange}
                      type="number"
                      id="amount"
                      name="amount"
                      value={formData.amount}
                    />
                  </td>
                </tr>
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
                <tr>
                  <td>
                    <Form.Label>Remarks</Form.Label>
                  </td>
                  <td>
                    <Form.Control
                      as="textarea"
                      id="remarks"
                      name="remarks"
                      onChange={handleChange}
                      value={formData.remarks}
                    />
                  </td>
                </tr>
              </table>
            </div>
          ) : trxType == "EXPENSE" ? (
            <div>
              <table className="formTable">
                <tr>
                  <td>
                    <Form.Label>Amount</Form.Label>
                  </td>
                  <td>
                    <Form.Control
                      onChange={handleChange}
                      type="number"
                      id="amount"
                      name="amount"
                      value={formData.amount}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <Form.Label>Transaction Date Time</Form.Label>
                  </td>
                  <td>
                    <Form.Control
                      onChange={handleChange}
                      disabled
                      type="text"
                      id="timestamp"
                      name="timestamp"
                      value={moment(formData.timestamp).format(
                        "DD/MM/YYYY hh:mm"
                      )}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <Form.Label>Remarks</Form.Label>
                  </td>
                  <td>
                    <Form.Control
                      as="textarea"
                      id="remarks"
                      name="remarks"
                      onChange={handleChange}
                      value={formData.remarks}
                    />
                  </td>
                </tr>
              </table>
            </div>
          ) : trxType == "ADJUSTMENT" ? (
            <div>
              <table className="formTable">
                <tr>
                  <td>
                    <Form.Label>Amount</Form.Label>
                  </td>
                  <td>
                    <Form.Control
                      onChange={handleChange}
                      type="number"
                      id="amount"
                      name="amount"
                      value={formData.amount}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <Form.Label>Transaction Date Time</Form.Label>
                  </td>
                  <td>
                    <Form.Control
                      onChange={handleChange}
                      disabled
                      type="text"
                      id="timestamp"
                      name="timestamp"
                      value={moment(formData.timestamp).format(
                        "DD/MM/YYYY hh:mm"
                      )}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <Form.Label>Remarks</Form.Label>
                  </td>
                  <td>
                    <Form.Control
                      as="textarea"
                      id="remarks"
                      name="remarks"
                      onChange={handleChange}
                      value={formData.remarks}
                    />
                  </td>
                </tr>
              </table>
            </div>
          ) : (
            <div>
              <table className="formTable">
                <tr>
                  <td>
                    <Form.Label>Start Date Time</Form.Label>
                  </td>
                  <td>
                    <Form.Control
                      onChange={handleChange}
                      type="date"
                      id="sDate"
                      name="sDate"
                      value={formData.sDate}
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
                      id="eDate"
                      name="eDate"
                      value={formData.eDate}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <Form.Label>Settlement Type</Form.Label>
                  </td>
                  <td>
                    <Form.Select
                      id="stlmnType"
                      name="stlmnType"
                      value={formData.stlmnType}
                      onChange={handleChange}
                    >
                      <option>Pilih</option>
                      <option value={"debit"}>Debit</option>
                      <option value={"credit"}>Credit</option>
                    </Form.Select>
                  </td>
                </tr>
                <tr>
                  <td>
                    <Form.Label>Amount</Form.Label>
                  </td>
                  <td>
                    <Form.Control
                      onChange={handleChange}
                      type="number"
                      id="amount"
                      name="amount"
                      value={formData.amount}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <Form.Label>Transfer Fee</Form.Label>
                  </td>
                  <td>
                    <Form.Control
                      onChange={handleChange}
                      type="transferFee"
                      id="transferFee"
                      name="transferFee"
                      value={formData.transferFee}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <Form.Label>Transaction Date Time</Form.Label>
                  </td>
                  <td>
                    <Form.Control
                      onChange={handleChange}
                      disabled
                      type="text"
                      id="timestamp"
                      name="timestamp"
                      value={moment(formData.timestamp).format(
                        "DD/MM/YYYY hh:mm"
                      )}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <Form.Label>Remarks</Form.Label>
                  </td>
                  <td>
                    <Form.Control
                      as="textarea"
                      id="remarks"
                      name="remarks"
                      onChange={handleChange}
                      value={formData.remarks}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <Form.Label>Target Bank</Form.Label>
                  </td>
                  <td>
                    <Form.Select
                      id="targetBankId"
                      name="targetBankId"
                      value={formData.targetBankId}
                      onChange={handleChange}
                    >
                      <option value={""}>Pilih</option>
                      {dataBanks.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.bankName}
                        </option>
                      ))}
                    </Form.Select>
                  </td>
                </tr>
                {/* <tr>
                  <td>
                    <Form.Label>Target Account No</Form.Label>
                  </td>
                  <td>
                    <Form.Control
                      onChange={handleChange}
                      type="number"
                      id="accountTo"
                      name="accountTo"
                      value={formData.accountTo}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <Form.Label>Target Account Name</Form.Label>
                  </td>
                  <td>
                    <Form.Control
                      onChange={handleChange}
                      type="text"
                      id="accountNameTo"
                      name="accountNameTo"
                      value={formData.accountNameTo}
                    />
                  </td>
                </tr> */}
              </table>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Tutup
          </Button>
          <Button variant="primary" onClick={() => performTrx()}>
            Simpan
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Trxs;
