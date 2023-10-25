import React, { useContext, useEffect, useState } from "react";
import { Button, Card, Col, Container, Row, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { storage, database } from "../config/firebase";
import {
  set,
  remove,
  ref as RDref,
  onValue,
  push,
  update,
} from "firebase/database";
import {
  getDownloadURL,
  deleteObject,
  uploadBytesResumable,
  ref,
} from "firebase/storage";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { AuthContext } from "../config/context";

function InfoEdit() {
  const { email, noHP, urlDocument, officeAddr, officeAddr2, compName } =
    useContext(AuthContext);

  const [hp, sethp] = useState("");
  const [emailscurr, setemailscurr] = useState("");
  const [pdf, setpdf] = useState(null);
  const [address, setaddress] = useState("");
  const [address2th, setaddress2th] = useState("");
  const [namaPerusahaan, setnamaPerusahaan] = useState("");
  const [Progress, setProgress] = useState(0);

  useEffect(() => {
    setaddress(officeAddr);
    setaddress2th(officeAddr2);
    sethp(noHP);
    setemailscurr(email);
    setnamaPerusahaan(compName);
  }, []);

  const setINfos = () => {
    if (emailscurr == "" && hp == "") {
      alert("Email atau noHP masih Kosong, mohon Isi !");
    } else {
      update(RDref(database, "Info_Situs/SItusXX"), {
        email: emailscurr,
        nomorHP: hp,
        alamat: address,
        alamat2: address2th,
        companyName: namaPerusahaan,
      })
        .then(() => {
          alert("Berhasil Diupdate!");
          sethp("");
          setemailscurr("");
          setaddress("");
        })
        .catch((e) => console.log(e));
    }
  };

  const setPdf = () => {
    console.log("Upload");

    console.log(pdf[0]);

    if (!pdf) alert("File dokumen belum dipilih!");
    else {
      const storageRef = ref(storage, `/PDFAutoLift/AutoLiftPortofolio.pdf`);
      const taskUpload = uploadBytesResumable(storageRef, pdf);

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

              update(RDref(database, "Info_Situs/SItusXX"), {
                linkPDF: url,
              });
            })
            .then(() => {
              alert("Berhasil Diupload !");
              setpdf(null);
            });
        }
      );
    }
  };

  return (
    <Container style={{ marginTop: "2rem", marginBottom: "2rem" }}>
      <h1 style={{ color: "white" }}>Edit Info Website</h1>
      <Row>
        <Tabs
          defaultActiveKey="kontak"
          id="uncontrolled-tab-example"
          className="mb-3"
        >
          <Tab eventKey="kontak" title="Edit Kontak">
            <Col>
              <Card>
                <Container style={{ marginTop: "2rem", marginBottom: "2rem" }}>
                  <Form>
                    <Form.Group className="mb-3" controlId="address">
                      <Form.Label>
                        Ubah Alamat 1 :{" "}
                        <span style={{ fontWeight: "bold" }}>{address}</span>
                      </Form.Label>
                      <Form.Control
                        value={address}
                        onChange={(e) => setaddress(e.target.value)}
                        type="text"
                        placeholder="Masukkan alamat baru"
                      />
                      <Form.Text className="text-muted">
                        contoh: Jalan Pegangsaan Timur, Medan Kota, Kota Medan,
                        no. 31230
                      </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="address">
                      <Form.Label>
                        Ubah Alamat 2 :{" "}
                        <span style={{ fontWeight: "bold" }}>{address2th}</span>
                      </Form.Label>
                      <Form.Control
                        value={address2th}
                        onChange={(e) => setaddress2th(e.target.value)}
                        type="text"
                        placeholder="Masukkan alamat 2 baru"
                      />
                      <Form.Text className="text-muted">
                        contoh: Jalan Pegangsaan Timur, Medan Kota, Kota Medan,
                        no. 31230
                      </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="address">
                      <Form.Label>
                        Ubah Nama Perusahaan :{" "}
                        <span style={{ fontWeight: "bold" }}>
                          {namaPerusahaan}
                        </span>
                      </Form.Label>
                      <Form.Control
                        value={namaPerusahaan}
                        onChange={(e) => setnamaPerusahaan(e.target.value)}
                        type="text"
                        placeholder="Silahkan Input Perubahan"
                      />
                      <Form.Text className="text-muted">
                        contoh: PT Contoh Perusahaan
                      </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                      <Form.Label>
                        Ubah Email :{" "}
                        <span style={{ fontWeight: "bold" }}>{emailscurr}</span>
                      </Form.Label>
                      <Form.Control
                        value={emailscurr}
                        onChange={(e) => setemailscurr(e.target.value)}
                        type="email"
                        placeholder="Masukkan email baru"
                      />
                      <Form.Text className="text-muted">
                        contoh: autolift@gmail.com
                      </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                      <Form.Label>
                        Ubah Nomor HP{" "}
                        <span style={{ fontWeight: "bold" }}>{hp}</span>
                      </Form.Label>
                      <Form.Control
                        value={hp}
                        onChange={(e) => sethp(e.target.value)}
                        type="number"
                        placeholder="Masukkan nomor baru"
                      />
                      <Form.Text className="text-muted">
                        contoh: 6281234567890
                      </Form.Text>
                    </Form.Group>
                    <Form.Group
                      className="mb-3"
                      controlId="formBasicCheckbox"
                    ></Form.Group>
                    <Button onClick={setINfos} variant="primary">
                      Simpan Perubahan
                    </Button>
                  </Form>
                </Container>
              </Card>
            </Col>
          </Tab>
          <Tab eventKey="upload" title="Update PDF Portofolio">
            <Col>
              <Card>
                <Container style={{ marginTop: "2rem", marginBottom: "2rem" }}>
                  <Form>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                      <Form.Label>Pilih file</Form.Label>
                      <Form.Control
                        onChange={(e) => setpdf(e.target.files[0])}
                        type="file"
                        accept="application/pdf"
                        placeholder="Masukkan nomor baru"
                      />
                      <Form.Text className="text-muted">
                        note : pilih file dokumen dengan format .pdf
                      </Form.Text>
                    </Form.Group>
                    <Form.Group
                      className="mb-3"
                      controlId="formBasicCheckbox"
                    ></Form.Group>
                    <Button onClick={setPdf} variant="primary">
                      Upload
                    </Button>
                  </Form>
                </Container>
              </Card>
            </Col>
          </Tab>
        </Tabs>
      </Row>
    </Container>
  );
}

export default InfoEdit;
