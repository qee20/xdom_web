import React, { useState, useEffect, useContext, useRef } from "react";
import { links } from "../config/urlDatasec";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Button, Container, Row, Col, Card, CardGroup } from "react-bootstrap";
import Logo from "../Resources/logo1.png";
import "../App.css";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../config/context";

function NavSS() {
  const [chatWidth, setChatWidth] = useState(undefined);
  const [sidebarTop, setSidebarTop] = useState(undefined);
  const location = useLocation();

  const { displayIT } = useContext(AuthContext);

  const RefNav = useRef(null);
  const [navClass, setnavClass] = useState("");

  useEffect(() => {
    const navPos = RefNav.current.offsetTop;
    console.log(RefNav);
    window.addEventListener("scroll", () => {
      console.log(RefNav.current.offsetTop);
      console.log(window.pageYOffset);
      if (navPos <= window.pageYOffset) {
        console.log("Sticky");
        setnavClass("sticky");
      } else if (navPos >= window.pageYOffset) {
        setnavClass("");
      }
    });
  }, []);

  return (
    <div>
      <Row>
        {/* Nav untuk logo */}
        <Navbar
          expand="lg"
          collapseOnSelect
          style={{ backgroundColor: "black" }}
        >
          <Navbar.Brand style={{ marginRight: "10rem" }} href="/">
            <img
              alt="Logo"
              src={Logo}
              width="300"
              className="d-inline-block align-top"
            />
          </Navbar.Brand>
        </Navbar>
      </Row>
      {/* Nav untuk tombol */}
      <Row>
        <Nav
          className={navClass}
          ref={RefNav}
          fill
          style={{ backgroundColor: "white", border: "2px solid black" }}
        >
          {links.map((link) => (
            <Nav.Item className="navi">
              <Nav.Link
                style={{ color: "black", fontWeight: "bold" }}
                href={link.url}
                key={link.id}
              >
                {link.text}
              </Nav.Link>
            </Nav.Item>
          ))}
        </Nav>
      </Row>
    </div>
  );
}

export default NavSS;
