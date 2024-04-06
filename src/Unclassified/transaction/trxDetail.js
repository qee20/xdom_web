import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { ref as RDref, onValue } from "firebase/database";
import { database } from "../../config/firebase";
import moment from "moment";
import { formatMoney } from "../misc/xdata";
import { InputGroup, Form } from "react-bootstrap";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { AuthContextFM } from "../misc/contextApp";
import { Autocomplete, Button, IconButton, TextField } from "@mui/material";

function DetailTrx() {
  const {playersData, bankData} = useContext(AuthContextFM)
  const { id } = useParams();
  const [data, setdata] = useState([]);
  const [filteredData, setfilteredData] = useState([])
  const [filterType, setfilterType] = useState("");
  const [userNameSearch, setuserNameSearch] = useState('')
  const [bankNameSearch, setbankNameSearch] = useState('')
  const [amountSearchFrom, setamountSearchFrom] = useState('')
  const [amountSearchTo, setamountSearchTo] = useState('')
  const [dateTrxFrom, setdateTrxFrom] = useState('')
  const [dateTrxTo, setdateTrxTo] = useState('')

  const getTrxDatabyBank = () => {
    const dbRefPlayer = RDref(database, "/trxData");

    onValue(
      dbRefPlayer,
      (snapshot) => {
        const data = [];
        snapshot.forEach((childSnapshot) => {
          const childKey = childSnapshot.key;
          const childData = childSnapshot.val();
          if (childData.bankId === id) {
            data.push(childData);
          }
        });
        console.log(data);
        const sortedData = [...data].sort((a, b) => b.timestamp - a.timestamp);
        setdata(sortedData);
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
    });
    return PlayerName;
  };

  const getBankNameByBankId = (bankId) => {
    const dbRefPlayer = RDref(database, `/dataBank/${bankId}`);
    var BankName = "";
    onValue(dbRefPlayer, (snapshot) => {
      const bankData = snapshot.val();
      BankName = bankData.bankName;
    });
    return BankName;
  };

  const getStaffNameByStaffId = (staffId) => {
    const dbRefPlayer = RDref(database, `/loginData/${staffId}`);
    var StaffName = "";
    onValue(dbRefPlayer, (snapshot) => {
      const staffData = snapshot.val();
      StaffName = staffData.fullName;
    });
    return StaffName;
  };

  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    const excelBuffer = XLSX.write(wb, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "exported_data.xlsx");
  };

  const [filterValue, setFilterValue] = useState("");

  const handleFilterTypeChange = (e) => {
    setfilterType(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilterValue(e.target.value);
  };

  const exeCuteSearch = () => { 
    if (filterType=='user') {
      const filtered = data.filter((item) =>
    item.playerId.toLowerCase().includes(userNameSearch.toLowerCase())
  );
      setfilteredData(filtered);
    } else if (filterType=='bank') {
      const filtered = data.filter((item) =>
    item.targetBankId.toLowerCase().includes(bankNameSearch.toLowerCase())
  );
  setfilteredData(filtered);
    } else if (filterType=='transactionType') {
      
      const filtered = data.filter((item) =>
    {if (filterValue === "all") {
      return true;
    } else if (filterValue === "deposit" && item.trxType === "DEPOSIT") {
      return true;
    } else if (
      filterValue === "withdraw" &&
      item.trxType === "WITHDRAW"
    ) {
      return true;
    } else if (filterValue === "pending" && item.trxType === "PENDING") {
      return true;
    } else if (filterValue === "tt" && item.trxType === "TT") {
      return true;
    } else if (filterValue === "adjs" && item.trxType === "ADJUSTMENT") {
      return true;
    } else if (filterValue === "exp" && item.trxType === "EXPENSE") {
      return true;
    } else if (filterValue === "stl" && item.trxType === "SETTLEMENT") {
      return true;
    } else if (
      filterValue === "tfee" &&
      item.trxType === "Transfer Fee"
    ) {
      return true;
    } else if (
      filterValue === "incoming" &&
      item.trxType === "Incoming Transfer"
    ) {
      return true;
    } else 
    return false;}
  );
  setfilteredData(filtered);
    }
    else if(filterType=='trxDate'){
      const fromDate = Date.parse(dateTrxFrom)
      const toDate = Date.parse(dateTrxTo)
      const filtered = data.filter((item) => {
        const timestamp = item.timestamp;
        return fromDate >= timestamp || timestamp <= toDate;
      });
      setfilteredData(filtered)
    } else if(filterType=='trxAmount'){
      const filtered = data.filter((item) => {
        const amount = item.amount;
        return amountSearchFrom >= amount && amount <= amountSearchTo;
      });
      setfilteredData(filtered)
    }
   }


  useEffect(() => {
    getTrxDatabyBank();
    setFilterValue("all");
  }, []);

  return (
    <div>
      <div style={{ margin: 10 }}>
        <InputGroup className="mb-3">
          <InputGroup.Text id="basic-addon1">Filter by </InputGroup.Text>
          <Form.Select
            onChange={(e) => handleFilterTypeChange(e)}
            aria-label="Default select example"
          >
            <option value="all">All</option>
            <option value="user">User Name</option>
            <option value="bank">Bank Name</option>
            <option value="transactionType">Transaction Type</option>
            <option value="trxDate">Transaction Date</option>
            <option value="trxAmount">Transaction Amount</option>
          </Form.Select>
        </InputGroup>
        {filterType == "user" ? <div style={{display : 'flex'}}>
        <Autocomplete
                      disablePortal
                      id="userid"
                      options={playersData}
                      onChange={(e,v)=> setuserNameSearch(v.id)}
                      getOptionLabel={(playersData) => playersData.name}
                      noOptionsText={"No user available"}
                      sx={{ width: 250}}
                      renderInput={(params) => (
                        <TextField {...params} label="username" />
                      )}
                    />
              <Button onClick={exeCuteSearch} variant="contained">Search</Button> 
        </div> : filterType == "bank" ? 
        <div style={{display : 'flex'}}>
          <Autocomplete
                      disablePortal
                      id="bankid"
                      options={bankData}
                      onChange={(e,v)=> setbankNameSearch(v.id)}
                      getOptionLabel={(bankData) => bankData.bankName}
                      noOptionsText={"No user available"}
                      sx={{ width: 250}}
                      renderInput={(params) => (
                        <TextField {...params} label="bank name" />
                      )}
                    />
              <Button onClick={exeCuteSearch} variant="contained">Search</Button> 
              </div> : filterType=='transactionType'? <div><Form.Select
            onChange={(e) => handleFilterChange(e)}
            aria-label="Default select example"
          >
            <option value="all">All type</option>
            <option value="deposit">Deposit</option>
            <option value="withdraw">WITHDRAW</option>
            <option value="pending">PENDING</option>
            <option value="tt">Transfer To Bank</option>
            <option value="adjs">ADJUSTMENT</option>
            <option value="exp">EXPENSE</option>
            <option value="stl">SETTLEMENT</option>
            <option value="tfee">Transfer Fee</option>
            <option value="incoming">Incoming Transfer</option>
          </Form.Select><Button onClick={exeCuteSearch} variant="contained">Search</Button> </div> : filterType=='trxAmount' ?  <div><InputGroup className="mb-3">
        <InputGroup.Text id="basic-addon1">From</InputGroup.Text>
        <Form.Control
        type="number"
        value={amountSearchFrom}
        onChange={(e)=> setamountSearchFrom(e.target.value)}
        />
      </InputGroup><InputGroup className="mb-3">
        <InputGroup.Text id="basic-addon1">To</InputGroup.Text>
        <Form.Control
        type="number"
        value={amountSearchTo}
        onChange={(e)=> setamountSearchTo(e.target.value)}
        />
      </InputGroup> <Button onClick={exeCuteSearch} variant="contained">Search</Button> </div> : filterType=='trxDate' ? <div><InputGroup className="mb-3">
        <InputGroup.Text id="basic-addon1">From</InputGroup.Text>
        <Form.Control
        type="date"
        value={dateTrxFrom}
        onChange={(e)=> setdateTrxFrom(e.target.value)}
        />
      </InputGroup><InputGroup className="mb-3">
        <InputGroup.Text id="basic-addon1">To</InputGroup.Text>
        <Form.Control
        type="date"
        value={dateTrxTo}
        onChange={(e)=> setdateTrxTo(e.target.value)}
        />
      </InputGroup><Button onClick={exeCuteSearch} variant="contained">Search</Button> </div> : <div></div>}
      </div>
      <div>
        {filteredData.length == 0 ? (
          <div className="empty-data">
            <p>No data available yet.</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Staff</th>
                <th>Amount</th>
                <th>Transaction Type</th>
                <th>Username</th>
                <th>Purpose</th>
                <th>Remarks</th>
                <th>Target Bank ID</th>
                <th>Transaction Date (From Bank)</th>
                <th>Transaction Date (To Bank)</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Settlement Type</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id}>
                  <td>
                    {moment(item.timestamp).format("MMMM Do YYYY, h:mm a")}
                  </td>
                  <td>
                    {item.staff == "" ? "-" : getStaffNameByStaffId(item.staff)}
                  </td>
                  <td>{formatMoney(item.amount)}</td>
                  <td
                    style={{
                      backgroundColor:
                        item.trxType === "DEPOSIT"
                          ? "blue"
                          : item.trxType === "WITHDRAW"
                          ? "orange"
                          : item.trxType === "PENDING"
                          ? "gray"
                          : item.trxType === "TT"
                          ? "brown"
                          : item.trxType === "EXPENSE"
                          ? "purple"
                          : item.trxType === "ADJUSTMENT"
                          ? "pink"
                          : "black",
                      color: "white",
                    }}
                  >
                    {item.trxType}
                  </td>
                  <td>
                    {item.playerId == "-"
                      ? "-"
                      : getPlayerNameByPlayerId(item.playerId)}
                  </td>
                  <td>{item.purpose}</td>
                  <td>{item.remarks}</td>
                  <td>
                    {item.targetBankId == "-"
                      ? "-"
                      : getBankNameByBankId(item.targetBankId)}
                  </td>
                  <td>
                    {item.trxDateFBank == ""
                      ? "-"
                      : moment(item.trxDateFBank).format(
                          "MMMM Do YYYY, h:mm a"
                        )}
                  </td>
                  <td>
                    {item.trxDateTBank == ""
                      ? "-"
                      : moment(item.trxDateTBank).format(
                          "MMMM Do YYYY, h:mm a"
                        )}
                  </td>
                  <td>
                    {item.eDate == "-"
                      ? "-"
                      : moment(item.eDate).format("MMMM Do YYYY, h:mm a")}
                  </td>
                  <td>
                    {item.sDate == "-"
                      ? "-"
                      : moment(item.sDate).format("MMMM Do YYYY, h:mm a")}
                  </td>
                  <td>{item.stlmnType}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div>
        <button  onClick={handleExportExcel} className="btn btn-success">
          Export Transaction
        </button>
        </div>
    </div>
  );
}

export default DetailTrx;
