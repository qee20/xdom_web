import { set, remove, ref as RDref, onValue, push } from "firebase/database";
import {
  getDownloadURL,
  deleteObject,
  uploadBytesResumable,
  ref,
} from "firebase/storage";
import React, { useEffect, useState, useRef, useContext } from "react";
import { storage, database } from "../../config/firebase";
import {
  Table,
  ProgressBar,
  Container,
  Col,
  Row,
  Button,
  Image,
  Card,
  CardGroup,
  Carousel,
} from "react-bootstrap";
import { Link, useParams, useLocation } from "react-router-dom";
import { AuthContext } from "../../config/context";
import { Helmet } from "react-helmet";
import Footer from "../Footer";
import Logo from "../../Resources/logo1.png";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import "../../App.css";
import Viewer from "react-viewer";

function Gallerries() {
  const { code } = useParams();

  const [listGambar, setListGambar] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currrentImage, setcurrrentImage] = useState("");
  const { setdisplayIT } = useContext(AuthContext);
  const location = useLocation();
  const [visible, setVisible] = useState(false);

  function PreviewImage({ item }) {
    setcurrrentImage(item.imageURL);
    setVisible(true);
  }

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    const dbRefGal = RDref(database, "/LvGlls");

    onValue(
      dbRefGal,
      (snapshot) => {
        const data = [];
        snapshot.forEach((childSnapshot) => {
          const childKey = childSnapshot.key;
          const childData = childSnapshot.val();
          data.push(childData);
        });
        setListGambar(data);
        console.log(listGambar);
      },
      { onlyOnce: false }
    );
  };

  var jlh = 30;

  return (
    <Row style={{ backgroundColor: "black" }}>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Autolift - Katalog {code.toUpperCase()}</title>
      </Helmet>

      <Row>
        {/* Nav untuk logo */}
        <Navbar expand="lg" collapseOnSelect bg="dark" variant="dark">
          <Navbar.Brand style={{ marginRight: "10rem" }} href="/">
            <img
              alt="Logo"
              src={Logo}
              width="30%"
              className="d-inline-block align-top"
            />
          </Navbar.Brand>
        </Navbar>
      </Row>

      <h1
        className="text-center"
        style={{ color: "white", marginTop: "3rem", marginBottom: "3rem" }}
      >
        <span style={{ borderStyle: "solid", borderColor: "white" }}>
          {" "}
          KATALOG {code.toUpperCase()}{" "}
        </span>
      </h1>

      <Viewer
        visible={visible}
        rotatable={false}
        scalable={false}
        onClose={() => {
          setVisible(false);
        }}
        images={[{ src: currrentImage, alt: "currentimage" }]}
      />

      <Row xs={1} lg={3} md={2} className="g-4">
        {listGambar
          .filter((item) => {
            if (item.katalog == code) {
              return item;
            }
          })
          .map((item, index) => {
            return (
              <Col>
                <Card
                  style={{ width: "100%", height: "19em", borderRadius: 0 }}
                  onClick={() => PreviewImage({ item })}
                  className="kontenGaleri"
                  bg="dark"
                >
                  <Card.Img
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    variant="top"
                    src={item.imageURL}
                  />
                </Card>
              </Col>
            );
          })}
      </Row>
      <Footer />
    </Row>
  );
}

export default Gallerries;
