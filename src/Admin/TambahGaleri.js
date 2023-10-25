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
  const [caption, setCaption] = useState("");
  const [listGambar, setListGambar] = useState([]);
  const [katalog, setkatalog] = useState("");
  const [seacrterms, setseacrterms] = useState("");

  const inputFile = useRef(null);

  useEffect(() => {
    console.log("Now");
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

  const setAsMain = (item) => {
    if (item.katalog == "rumah") {
      console.log("Rumah");
      update(RDref(database, "Info_Situs/SItusXX"), {
        bgRumah: item.imageURL,
      }).then(alert("Gambar berhasil ditetapkan di halaman Katalog!"));
    } else if (item.katalog == "cafe") {
      console.log("Cafe");
      update(RDref(database, "Info_Situs/SItusXX"), {
        bgCafe: item.imageURL,
      }).then(alert("Gambar berhasil ditetapkan di halaman Katalog!"));
    } else if (item.katalog == "kantor") {
      console.log("Office");
      update(RDref(database, "Info_Situs/SItusXX"), {
        bgKantor: item.imageURL,
      }).then(alert("Gambar berhasil ditetapkan di halaman Katalog!"));
    }
  };

  const getFiles = (e) => {
    setImage(e.target.files[0]);
    setPreview(URL.createObjectURL(e.target.files[0]));
  };

  const setValue = (e) => {
    setCaption(e.target.value);
  };

  const uploadGalerry = () => {
    let id = uuid();
    let dateNow = Date.now();
    console.log("Upload");

    if (!image) alert("File Gambar belum dipilih!");
    else if (caption == "") alert("Keterangan gambar belum diisi!");
    else {
      const storageRef = ref(storage, `/LvGlls/${dateNow + "-" + image.name}`);
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

              set(RDref(database, "LvGlls/" + id), {
                idRow: id,
                caption: caption,
                filename: dateNow + "-" + image.name,
                katalog: katalog,
                dateFile: Date.now(),
                imageURL: url,
              });
            })
            .then(() => {
              setProgress(0);
              setCaption("");
              setImage(null);
              setPreview("");
            });
        }
      );
    }
  };

  const Delete = ({ idR, file }) => {
    console.log("Hapus " + idR + " dgn " + file);
    deleteObject(ref(storage, "LvGlls/" + file))
      .then(() => {
        remove(RDref(database, "LvGlls/" + idR));
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
            <h1>Tambah Katalog Galeri</h1>
          </Col>
        </Row>

        <Row style={{ margin: "1rem" }}>
          <Col>
            <label style={{ marginTop: "3rem" }}>Pilih Jenis Katalog:</label>
            <select
              style={{
                marginLeft: "1rem",
                marginBottom: "3rem",
                width: 575,
                height: 35,
              }}
              defaultValue={katalog}
              onChange={(e) => setkatalog(e.target.value)}
            >
              <option value={"none"}>---Pilih Katalog---</option>
              <option value={"rumah"}>Katalog Rumah</option>
              <option value={"cafe"}>Katalog Cafe</option>
              <option value={"kantor"}>Katalog Kantor</option>
            </select>
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
            <input
              style={{ width: "50rem" }}
              title="Pilih File Gambar"
              type={"text"}
              placeholder="Masukkan Keterangan Gambar"
              value={caption}
              onChange={setValue}
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

        <div style={{ margin: "5rem", marginBottom: "1rem" }}>
          <div>
            <label>Tampilkan Berdasarkan: </label>
            <select
              style={{ width: 500, height: 35, marginLeft: "1rem" }}
              defaultValue={seacrterms}
              onChange={(e) => setseacrterms(e.target.value)}
            >
              <option value={""}>Semua</option>
              <option value={"rumah"}>Rumah</option>
              <option value={"cafe"}>Cafe</option>
              <option value={"kantor"}>Kantor</option>
            </select>
          </div>
        </div>
        <br />
        <div
          style={{
            border: "3px black solid",
            margin: "5rem",
            marginTop: "0rem",
          }}
        >
          <Table
            style={{ marginLeft: "auto", marginRight: "auto", color: "black" }}
            bordered
            hover
            size="sm"
          >
            <thead>
              <tr>
                <th>No.</th>
                <th>Katalog</th>
                <th>Gambar</th>
                <th>Keterangan Gambar</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {listGambar
                .filter((item) => {
                  if (seacrterms == "") {
                    return item;
                  } else if (item.katalog.includes(seacrterms)) {
                    return item;
                  }
                })
                .map((item, index) => {
                  return (
                    <tr key={index + 1}>
                      <td>{index + 1}</td>
                      <td>{item.katalog}</td>
                      <td>
                        <div style={{ width: 200 }}>
                          <img
                            style={{ width: "100%", height: "100%" }}
                            src={item.imageURL}
                          />
                        </div>
                      </td>
                      <td>{item.caption}</td>
                      <td>
                        <div style={{ marginRight: "0rem" }}>
                          <Button
                            style={{ width: "5rem" }}
                            variant="danger"
                            onClick={() =>
                              Delete({ idR: item.idRow, file: item.filename })
                            }
                          >
                            Hapus
                          </Button>
                          <br />
                          <Button
                            onClick={() => setAsMain(item)}
                            variant="primary"
                          >
                            Tetapkan sebagai Main Display
                          </Button>
                          <br />
                          <Link to={"/admin/galleries/" + item.idRow}>
                            <Button style={{ width: "5rem" }} variant="warning">
                              Ubah
                            </Button>
                          </Link>
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
