import {
  set,
  update,
  remove,
  ref as RDref,
  onValue,
  push,
} from "firebase/database";
import {
  getDownloadURL,
  deleteObject,
  uploadBytesResumable,
  ref,
} from "firebase/storage";
import React, { useEffect, useState, useRef } from "react";
import { storage, database } from "../config/firebase";
import {
  Table,
  ProgressBar,
  Container,
  Col,
  Row,
  Button,
} from "react-bootstrap";
import moment from "moment";
import "moment/locale/id";
import "../App.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import uuid from "react-uuid";
import { Helmet } from "react-helmet";

function EditGalleryInfo() {
  const { id } = useParams();
  const [currFile, setcurrFile] = useState([]);
  const [katalog, setkatalog] = useState("");
  const [caption, setCaption] = useState("");

  const nav = useNavigate();

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    const dbRefGal = RDref(database, "/LvGlls/" + id);

    onValue(
      dbRefGal,
      (snapshot) => {
        console.log(snapshot.val());
        setcurrFile(snapshot.val());
        setkatalog(snapshot.val().katalog);
        setCaption(snapshot.val().caption);
      },
      { onlyOnce: false }
    );
  };

  const Update = () => {
    update(RDref(database, "LvGlls/" + id), {
      caption: caption,
      katalog: katalog,
    }).then(() => {
      alert("Berhasil Diubah !!");
      nav("/admin/galleries");
    });
  };

  return (
    <Container>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Autolift - Edit Galeri</title>
      </Helmet>
      <Row>
        <Link to={"/admin/galleries"}>
          <Button style={{ width: "10rem", margin: "1rem" }} variant="danger">
            Kembali
          </Button>
        </Link>
        <Col>
          <h4 style={{ right: "1rem", top: "1rem", position: "absolute" }}>
            {moment().format("LLLL")}
          </h4>
        </Col>
        <Row style={{ margin: "1rem" }}>
          <Col>
            <h2>Ubah Katalog Galeri</h2>
          </Col>
        </Row>
      </Row>
      <Row style={{ marginBottom: "2rem" }}>
        <Col>
          <img
            style={{ width: "80%", borderRadius: "20px" }}
            src={currFile.imageURL}
          />
        </Col>
      </Row>
      <Row style={{ marginBottom: "1rem" }}>
        <Col>
          <input
            style={{ width: "30rem" }}
            onChange={(e) => setCaption(e.target.value)}
            value={caption}
          />
        </Col>
        <Col>
          <select
            style={{ width: "25rem", height: 30 }}
            value={katalog}
            defaultValue={currFile.katalog}
            onChange={(e) => setkatalog(e.target.value)}
          >
            <option value={"rumah"}>Rumah</option>
            <option value={"cafe"}>Cafe</option>
            <option value={"kantor"}>Kantor</option>
          </select>
        </Col>
      </Row>

      <Row style={{ marginBottom: "51rem" }}>
        <Col>
          <Button
            variant="outline-success"
            style={{ width: "30rem" }}
            onClick={Update}
          >
            Update
          </Button>
        </Col>
        <Col>
          <Button
            variant="outline-danger"
            style={{ width: "25rem" }}
            onClick={() => nav("/admin/galleries")}
          >
            Batal
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

export default EditGalleryInfo;
