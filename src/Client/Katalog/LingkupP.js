import React from "react";
import { Button, Container, Row, Col, Card, CardGroup } from "react-bootstrap";
import Constr from "../../Resources/Pembangunan dan Konstruksi.png";
import Arc from "../../Resources/Perencanaan Arsitektur.png";
import Inter from "../../Resources/Perencanaan Desain Interior.png";

function LingkupP() {
  const Lings = [
    {
      title: "Pembangunan dan Konstruksi",
      text: "Selain bidang perencanaan, Autolift Project juga dapat mengambil bidak eksekusional seperti Pembangunan, Renovasi, Pembongkaran, dan lain sebagainya. Autolift Project tidak pernah membatasi klien untuk memilih bidang pekerjaan yang kami tawarkan. Mengingat orientasi pekerjaan kami adalah berdasarkan kepuasan klien.",
      img: Constr,
    },
    {
      title: "Perencanaan Arsitektur",
      text: "Autolift Project telah mengerjakan banyak proyek Bangunan / Arsitektur mulai dari skala kecil hingga besar. Dari area perumahan kecil di atas tanah 60m2, kemudian merancang Kantor dan Cafe yang memiliki nilai filosofis. Sejak awal, Autolift project tidak membatasi klasifikasi proyek yang dikerjakan, mengingat kami memiliki semangat untuk meningkatkan citra arsitektur dalam skala apa pun.",
      img: Arc,
    },
    {
      title: "Perencanaan Desain Interior",
      text: "Sejak pertama kali Autolift Project didirikan, kami telah menyelesaikan berbagai proyek interior atau fitting out. Seperti SPA, Hotel, Kantor, Restoran, dan Perumahan. Autolift Project selalu menghadirkan desain interior yang mengikuti tren dan budaya saat ini untuk memastikan klien menerima desain yang sesuai dengan kebutuhan mereka.",
      img: Inter,
    },
  ];

  return (
    <section className="katalog" id="katalog">
      <Row
        style={{
          backgroundColor: "#191A19",
          color: "white",
          paddingTop: "5em",
          paddingBottom: "2em",
        }}
      >
        <br />
        <br />
        <h1 className="text-center" style={{ fontWeight: "bold" }}>
          LINGKUP PEKERJAAN
        </h1>

        {Lings.map((item) => (
          <Row
            style={{
              justifyContent: "center",
            }}
          >
            <Col lg={9} xs={7} md={9} style={{ marginTop: "3rem" }}>
              <h4 style={{ fontWeight: "bold" }}>{item.title.toUpperCase()}</h4>
              <p align="justify" style={{ marginRight: "2rem" }}>
                {item.text}
              </p>
            </Col>
            <Col lg={2} xs={5} md={3} style={{ marginTop: "2rem" }}>
              <img style={{ width: "10rem", height: "10rem" }} src={item.img} />
            </Col>
          </Row>
        ))}
      </Row>
    </section>
  );
}

export default LingkupP;
