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
import { Link } from "react-router-dom";
import uuid from "react-uuid";
import { Helmet } from "react-helmet";

export default function TambahGaleri() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [progress, setProgress] = useState(0);
  const [judulBerita, setjudulBerita] = useState("");
  const [deskripsiBerita, setdeskripsiBerita] = useState("");
  const [linkBerita, setlinkBerita] = useState("");
  const [dataBerita, setdataBerita] = useState([]);
  const [seacrterms, setseacrterms] = useState("");

  const inputFile = useRef(null);

  useEffect(() => {
    console.log("Now");
    getData();
  }, []);

  const getData = () => {
    const dbRefGal = RDref(database, "/AutoliftBerita");

    onValue(
      dbRefGal,
      (snapshot) => {
        const data = [];
        snapshot.forEach((childSnapshot) => {
          const childKey = childSnapshot.key;
          const childData = childSnapshot.val();
          data.push(childData);
        });
        setdataBerita(data);
        console.log(data);
      },
      { onlyOnce: false }
    );
  };

  const getFiles = (e) => {
    setImage(e.target.files[0]);
    setPreview(URL.createObjectURL(e.target.files[0]));
  };

  const uploadGalerry = () => {
    let id = uuid();
    let dateNow = Date.now();
    console.log("Upload");

    if (!image && linkBerita == "" && judulBerita == "" && linkBerita == "")
      alert("Input belum lengkap !");
    else {
      const storageRef = ref(storage, `/IlustrasiBerita/${dateNow}`);
      const taskUpload = uploadBytesResumable(storageRef, image);

      taskUpload.on(
        "state_change",
        (snapshot) => {
          const prog = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(prog);
        },
        (err) => console.log(err),
        () => {
          getDownloadURL(taskUpload.snapshot.ref)
            .then((url) => {
              console.log(url);

              set(RDref(database, "AutoliftBerita/" + id), {
                idRow: id,
                judulBerita: judulBerita,
                imageURL: url,
                deskripsiBerita: deskripsiBerita,
                linkBerita: linkBerita,
              });
            })
            .then(() => {
              setProgress(0);
              setjudulBerita("");
              setdeskripsiBerita("");
              setlinkBerita("");
              setImage(null);
              setPreview("");
            });
        }
      );
    }
  };

  const Delete = ({ idR, file }) => {
    console.log("Hapus " + idR + " dgn " + file);
    deleteObject(ref(storage, "IlustrasiBerita/" + file))
      .then(() => {
        remove(RDref(database, "AutoliftBerita/" + idR));
      })
      .then(() => {
        alert("Berhasil Dihapus!");
      })
      .catch((err) => {
        alert("Failed : " + err);
      });
  };

  const onButtonClick = () => {
    inputFile.current.click();
  };

  return (
    <div style={{ color: "white" }}>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Autolift - Tambah Galeri</title>
      </Helmet>
      <Link to={"/admin"}>
        <Button style={{ width: "10rem", margin: "1rem" }} variant="danger">
          Kembali
        </Button>
      </Link>
      <Col style={{ right: "1rem", top: "1rem", position: "absolute" }}>
        <h4>{moment().format("LLLL")}</h4>
      </Col>

      <Container className="mr-auto">
        <Row style={{ margin: "1rem" }}>
          <Col>
            <h1>Tambah Item Berita</h1>
          </Col>
        </Row>

        <Row style={{ margin: 20 }}>
          <Col>
            <input
              style={{ width: "100%" }}
              type={"text"}
              placeholder="Masukkan Judul Berita"
              value={judulBerita}
              onChange={(e) => setjudulBerita(e.target.value)}
            />
          </Col>
        </Row>

        <Row style={{ margin: 20 }}>
          <Col>
            <input
              style={{ display: "none" }}
              ref={inputFile}
              type={"file"}
              onChange={getFiles}
            />
            <Button
              variant="outline-info"
              style={{ width: "50rem" }}
              onClick={onButtonClick}
            >
              Pilih Gambar
            </Button>
          </Col>
        </Row>

        <Row style={{ margin: 20 }}>
          <Col>
            <img
              alt="Gambar belum ada!, Silahkan Pilih Gambar"
              src={preview}
              width={500}
              height={300}
            />
          </Col>
        </Row>

        <Row style={{ margin: 20 }}>
          <Col>
            <textarea
              style={{ width: "100%" }}
              type={"text"}
              placeholder="Masukkan Deskripsi Berita"
              value={deskripsiBerita}
              onChange={(e) => setdeskripsiBerita(e.target.value)}
            />
          </Col>
        </Row>

        <Row style={{ margin: 20 }}>
          <Col>
            <input
              style={{ width: "100%" }}
              type={"url"}
              placeholder="Masukkan Link Berita"
              value={linkBerita}
              onChange={(e) => setlinkBerita(e.target.value)}
            />
          </Col>
        </Row>

        <Row style={{ margin: 20 }}>
          <Col>
            <Button
              variant="outline-success"
              style={{ width: "50rem" }}
              onClick={uploadGalerry}
            >
              Unggah
            </Button>
          </Col>
        </Row>
        <Row style={{ margin: 20 }}>
          <Col>
            <ProgressBar now={progress} label={`${progress}%`} />
          </Col>
        </Row>

        <div>
          <Table
            style={{ marginLeft: "auto", marginRight: "auto", color: "black" }}
            bordered
            hover
            size="sm"
          >
            <thead>
              <tr>
                <th>No.</th>
                <th>Judul Berita</th>
                <th>Ilustrasi</th>
                <th>Deskripsi berita</th>
                <th>Link</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {dataBerita.map((item, index) => {
                return (
                  <tr key={index + 1}>
                    <td>{index + 1}</td>
                    <td>{item.judulBerita}</td>
                    <td>
                      <div style={{ width: 200 }}>
                        <img
                          style={{ width: "100%", height: "100%" }}
                          src={item.imageURL}
                        />
                      </div>
                    </td>
                    <td>{item.deskripsiBerita}</td>
                    <td>
                      <a href={item.linkBerita}>{item.linkBerita}</a>
                    </td>
                    <td>
                      <div style={{ marginRight: "0rem" }}>
                        <Button
                          style={{ width: "5rem" }}
                          variant="danger"
                          onClick={() =>
                            Delete({ idR: item.idRow, file: item.judulBerita })
                          }
                        >
                          Hapus
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      </Container>
    </div>
  );
}
