import {
  Container,
  Row,
  Col,
  Navbar,
  Table,
  Button,
  Card,
  CardGroup,
} from "react-bootstrap";
import { AuthContext } from "../config/context";
import React, {
  useRef,
  useEffect,
  useState,
  createContext,
  useContext,
} from "react";
import Logo from "../Resources/logo1.png";
import "../App.css";

function Footer() {
  const { email, noHP, urlDocument, officeAddr, officeAddr2, compName } =
    useContext(AuthContext);
  return (
    <Row
      style={{
        backgroundColor: "#000000",
        color: "white",
        justifyContent: "space-between",
      }}
    >
      <Col
        xs={12}
        md={6}
        lg={4}
        style={{ marginLeft: "1rem", marginTop: "1rem", marginBottom: "3rem" }}
      >
        <img src={Logo} width="auto" height="80px" />
        <br></br>
        <Button
          onClick={() => window.open(urlDocument)}
          variant="secodary"
          className="btndw"
        >
          DOWNLOAD <br></br>AUTOLIFT COMPANY PROFILE &#38; PRICELIST
        </Button>
      </Col>
      <Col
        lg={2}
        xs={12}
        md={6}
        style={{ marginTop: "2rem", textAlign: "right" }}
      >
        <p>Telp : {noHP}</p>
        <p>Email : {email}</p>
        <br />
        <p>Alamat Kantor Konsultan :</p>
        <p>1. {officeAddr}</p>
        <p>2. {officeAddr2}</p>
      </Col>
    </Row>
  );
}

export default Footer;
