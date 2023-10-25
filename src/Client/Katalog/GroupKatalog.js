import React, { useContext } from "react";
import { Button, Col, Container, Row, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../../App.css";
import { AuthContext } from "../../config/context";

function GroupKatalog() {
  const jlhProj = [{ rumah: 35, office: 15, cafe: 5 }];
  const { cafeBG, rumahBG, koantorBG } = useContext(AuthContext);
  const objKatalog = [
    {
      code: "rumah",
      title: "Katalog Project Rumah",
      jumlah: jlhProj[0].rumah,
      subsx: `Kami telah membangun ${jlhProj[0].rumah} Hunian Rumah mulai dari kelas low-mid hingga luxury.`,
      urlimg: rumahBG,
    },
    {
      code: "cafe",
      title: "Katalog Project Cafe",
      jumlah: jlhProj[0].cafe,
      subsx: `Kami telah membangun ${jlhProj[0].cafe} Cafe berbagai macam konsep dan penuh filosofi.`,
      urlimg: cafeBG,
    },
    {
      code: "kantor",
      title: "Katalog Project Office",
      jumlah: jlhProj[0].office,
      subsx: `Kami telah membangun ${jlhProj[0].office} kantor dengan desain yang revolusioner.`,
      urlimg: koantorBG,
    },
  ];
  const imgUrl =
    "https://domusstudio.com/wp-content/uploads/2014/10/Fitzsimons-domusstudio-residential-architecture-11-wide-website.jpg";
  const nav = useNavigate();

  return (
    //Konten Lingkup Pekerjaan [gambar, judul besar, tombol, sub judul]
    <Row>
      {objKatalog.map((item, index) => (
        <div>
          <Row>
            <Card
              style={{ width: "100%", height: "42em", borderRadius: 0 }}
              className="bg-dark text-white"
            >
              <Card.Img
                style={{
                  height: "100%",
                  objectFit: "cover",
                }}
                className="katalogImage"
                src={item.urlimg}
              />
              <Card.ImgOverlay
                style={{
                  backgroundColor: "rgba(0,0,0,0.6)",
                  width: "100%",
                }}
              >
                <Card.Title
                  style={{
                    fontSize: "5em",
                    marginTop: 120,
                    marginLeft: 70,
                    textShadow: "6px 10px 10px black",
                  }}
                >
                  {item.title.substring(0, 7)}
                  <br /> {item.title.substring(7, item.title.length)}
                </Card.Title>
              </Card.ImgOverlay>
            </Card>
          </Row>
          <Row
            align="justify"
            style={{
              marginBottom: "2.5rem",
              marginTop: "2.5rem",
              marginLeft: "1rem",
            }}
          >
            {/* Sisi kiri : Sub pesan */}
            <Col lg={10}>
              <h4>
                {item.subsx.substring(0, 21)}
                <span style={{ fontWeight: "bold" }}>{item.jumlah} </span>
                {item.subsx.substring(23, item.subsx.length)}
              </h4>
            </Col>
            {/* Sisi kanan : Tombol Lihat Selengkapnya */}
            <Col lg={2}>
              <button
                style={{
                  padding: "10px",
                  backgroundColor: "black",
                  color: "white",
                }}
                onClick={() => nav("/katalog/" + item.code)}
              >
                Lihat Selengkapnya
              </button>
            </Col>
          </Row>
        </div>
      ))}
    </Row>
  );
}

export default GroupKatalog;
