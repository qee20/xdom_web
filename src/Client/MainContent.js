import React, { useRef, useState, useEffect, useContext } from "react";
import { Button, Container, Row, Col, Card, CardGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import GroupKatalog from "./Katalog/GroupKatalog";
import Gmail from "../Resources/gmail.png";
import Whatapp from "../Resources/whatsapp.png";
import Logo from "../Resources/logo1.png";
import "../App.css";
import NewsDisplay from "./Berita/NewsDisplay";
import { AuthContext } from "../config/context";
import { Helmet } from "react-helmet";
import NavSS from "./NavSS";
import Footer from "./Footer";
import RoadMap from "./Katalog/RoadMap";
import Lingkup from "./Katalog/LingkupP";

function Initials() {
  const nav = useNavigate();
  const comnav = useRef();
  const katalog = useRef(null);
  const roadmap = useRef(null);
  const news = useRef(null);
  const contact = useRef(null);
  const [navClass, setnavClass] = useState("");
  const [fix, setfix] = useState(false);

  const { email, noHP } = useContext(AuthContext);

  const scrollToSection = (elementRef) => {
    window.scrollTo({
      top: elementRef.current.offsetTop,
      behavior: "smooth",
    });
  };

  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Autolift - Halaman Utama</title>
      </Helmet>

      <NavSS />

      {/* Section Katalog  */}
      <GroupKatalog />

      {/* Section Lingkup Pekerjaan */}
      <Lingkup />

      {/* Section Road Map */}
      <RoadMap />

      {/* Section News */}
      <Row>
        <Col>
          <section className="news" id="news">
            <NewsDisplay />
          </section>
        </Col>
      </Row>

      {/* Section kontak */}
      <section className="kontak" id="kontak">
        <Row
          style={{
            backgroundColor: "white",
            color: "black",
            paddingTop: "2em",
            paddingBottom: "2em",
          }}
        >
          <br></br>
          <h1 className="text-center">HUBUNGI KAMI</h1>
          <Row
            lg={12}
            xs={6}
            md={6}
            style={{ marginTop: "2rem", justifyContent: "center" }}
          >
            <Col align="center">
              <a href={`http://wa.me/${noHP}`}>
                <img style={{ width: "100%" }} src={Whatapp} />
              </a>
            </Col>
            <Col>
              <a href={`mailto:${email}`}>
                <img style={{ width: "100%" }} src={Gmail} />
              </a>
            </Col>
          </Row>
        </Row>
      </section>
      <Footer />
    </div>
  );
}

export default Initials;
