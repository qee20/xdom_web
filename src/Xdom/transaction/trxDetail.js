import React, { useEffect, useState } from 'react'
import "../misc/style.css";
import serverPoint from '../misc/server-point'
import { useParams } from 'react-router-dom'
import moment from 'moment'
import { formatMoney } from '../misc/xdata'
import { Button } from '@mui/material';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

function Dtrx_Detail() {
  const {id} = useParams()
  const [trxDataBank, settrxDataBank] = useState([])
  const [currentBankname, setcurrentBankname] = useState('')

  const getReqData = async() => { 
    await serverPoint.get(`/banktrx/${id}`).then((res)=>{
      const server_response = res.data
      console.log(server_response);
      settrxDataBank(server_response.data)
      setcurrentBankname(server_response.data[0].C_Bank)
    })
   }

  const exportData = () => { 
    console.log('Export');
    const desiredExported = trxDataBank.map(item => ({
      Transaction_Date: moment(item.TransactionDate).format("Do MMMM YYYY, HH:MM"),
      Transaction_Type: item.TransactionType,
      Transaction_Amount: item.TransactionAmount,
      Staff_Entry : item.user_entry_name,
      PlayerName: item.PlayerName ? item.PlayerName : '-',
      Remark: item.Remark,
    }));
    const ws = XLSX.utils.json_to_sheet(desiredExported);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "All trx");

    const excelBuffer = XLSX.write(wb, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "exported_data.xlsx");
   }
  
  useEffect( () => {
    getReqData()
  }, [])
  
  return (
    <div>
      <div style={{margin : '10px'}}>
        <h1 >Transaction Detail - {currentBankname}</h1>
        <Button onClick={exportData} variant='contained'>Export</Button>
      </div>
      <div className="table-container">
        {trxDataBank.length == 0 ? (
          <div className="empty-data">
            <p>No data available yet.</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Transaction Date</th>
                <th>Transaction Type</th>
                <th>Transaction Amount</th>
                <th>Staff Entry</th>
                <th>Player Username</th>
                <th>Transaction Remarks</th>
              </tr>
            </thead>
            <tbody>
              {trxDataBank.map((item) => (
                <tr key={item.id}>
                  <td>
                    {moment(item.TransactionDate).format("Do MMMM YYYY, HH:MM")}
                  </td><td
                    style={{
                      backgroundColor:
                        item.TransactionType === "DEPOSIT"
                          ? "blue"
                          : item.TransactionType === "WITHDRAW"
                          ? "orange"
                          : item.TransactionType === "PENDING"
                          ? "gray"
                          : item.TransactionType === "TRANSFER TO BANK"
                          ? "brown"
                          : item.TransactionType === "EXPENSE"
                          ? "purple"
                          : item.TransactionType === "ADJUSTMENT"
                          ? "pink"
                          : "black",
                      color: "white",
                    }}
                  >
                    {item.TransactionType}
                  </td>
                  <td>{formatMoney(item.TransactionAmount)}</td>
                  <td>
                    {item.user_entry_name}
                  </td>
                  <td>
                    {item.PlayerName ? item.PlayerName : '-'}
                  </td>
                  <td>{item.transaction_remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default Dtrx_Detail