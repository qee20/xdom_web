import React, { useContext } from "react";
import { Card, Button, Col, Container, Modal, Row } from "react-bootstrap";
import { Link, Navigate } from "react-router-dom";
import Web from "../Resources/web.png";
import Galeri from "../Resources/gallery.png";
import { AuthContext } from "../config/context";
import { auth } from "../config/firebase";
import { Helmet } from "react-helmet";

function Index() {
  const { currentUser } = useContext(AuthContext);
  return (
    <Container
      style={{ marginTop: "1rem", backgroundColor: "white" }}
      className="text-center"
    >
      <Helmet>
        <meta charSet="utf-8" />
        <title>Autolift - Halaman Admin</title>
      </Helmet>

      <Row
        style={{ backgroundColor: "#191A19", padding: "1em", color: "white" }}
      >
        <Col>
          <h1>Halaman Admin</h1>
        </Col>
        <Col>
          Masuk sebagai :{" "}
          <span style={{ fontWeight: "bold", color: "blue" }}>
            {currentUser.email}
          </span>
        </Col>
        <Col>
          <p>Jangan lupa untuk logout!</p>
          <Button onClick={() => auth.signOut()}>Log Out</Button>
        </Col>
      </Row>
      <h1>PILIH MENU</h1>
      <Row style={{ marginTop: "3rem", marginBottom: "11rem" }}>
        <Col xs={12} md={6}>
          <Card style={{ backgroundColor: "#F5F5F5", color: "black" }}>
            <Card.Img
              style={{ width: "50%", height: "50%", alignSelf: "center" }}
              variant="top"
              src={Web}
            />
            <Card.Body>
              <Card.Title>Edit Info Website</Card.Title>
              <Card.Text>
                Untuk mengedit info website, keterangan, dll.
              </Card.Text>
              <Link to={"/admin/infoedit"}>
                <Button
                  style={{ padding: "1rem", fontWeight: "bold" }}
                  variant="outline-success"
                >
                  Kelola Info Website
                </Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card style={{ backgroundColor: "#F5F5F5", color: "black" }}>
            <Card.Img
              style={{ width: "50%", height: "50%", alignSelf: "center" }}
              variant="top"
              src={Galeri}
            />
            <Card.Body>
              <Card.Title>Edit Katalog Galeri</Card.Title>
              <Card.Text>Untuk mengedit info Galeri Katalog, dll.</Card.Text>
              <Link to={"/admin/galleries"}>
                <Button
                  style={{ padding: "1rem", fontWeight: "bold" }}
                  variant="outline-primary"
                >
                  Kelola Katalog Galeri
                </Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card
            style={{
              backgroundColor: "#F5F5F5",
              color: "black",
              marginTop: "1em",
            }}
          >
            <Card.Img
              style={{ width: "50%", height: "50%", alignSelf: "center" }}
              variant="top"
              src={Galeri}
            />
            <Card.Body>
              <Card.Title>Tambah Item Berita</Card.Title>
              <Card.Text>Menambah Item Berita</Card.Text>
              <Link to={"/admin/news"}>
                <Button
                  style={{ padding: "1rem", fontWeight: "bold" }}
                  variant="outline-primary"
                >
                  Kelola Item Berita
                </Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Index;
