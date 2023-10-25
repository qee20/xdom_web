import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Container, Row, Col, Card, CardGroup } from "react-bootstrap";
import Berita1 from "../../Resources/berita1.jpg";
import Berita2 from "../../Resources/berita2.jpg";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../App.css";
import { useNavigate } from "react-router-dom";
import {
  set,
  update,
  remove,
  ref as RDref,
  onValue,
  push,
} from "firebase/database";
import { storage, database } from "../../config/firebase";

function NewsDisplay() {
  const [data, setdata] = useState([]);
  const [currWindow, setcurrWindow] = useState(0);
  const nav = useNavigate();
  const settings = {
    dots: false,
    autoplay: true,
    infinite: true,
    slidesToShow: currWindow,
    slidesToScroll: 1,
  };

  useEffect(() => {
    getData();
    if (window.screen.width >= 1000) setcurrWindow(3);
    else if (window.screen.width >= 700 && window.screen.width < 1000)
      setcurrWindow(2);
    else if (window.screen.width > 500 && window.screen.width < 700)
      setcurrWindow(1);
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
        setdata(data);
        console.log(data);
      },
      { onlyOnce: false }
    );
  };

  return (
    <div>
      <br />
      <br />
      <h1 className="text-center">NEWS</h1>
      <Row align="justify">
        <div className="container">
          <Slider dots={"false"} {...settings}>
            {data.map((item) => (
              <Col>
                <Card style={{ margin: 10, border: "3px solid black" }}>
                  <Card.Img
                    style={{
                      width: "auto",
                      height: "20rem",
                      objectFit: "cover",
                    }}
                    variant="top"
                    src={item.imageURL}
                  />
                  <Card.Body>
                    <Card.Title>{item.judulBerita}</Card.Title>
                    <Card.Text>
                      {item.deskripsiBerita.substring(0, 100)}...
                    </Card.Text>
                    <Button
                      variant="dark"
                      onClick={() => window.open(item.linkBerita)}
                    >
                      Baca Selengkapnya
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Slider>
        </div>
      </Row>
    </div>
  );
}

export default NewsDisplay;
