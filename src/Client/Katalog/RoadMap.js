import React from "react";
import { Button, Container, Row, Col, Card, CardGroup } from "react-bootstrap";
import Call from "../../Resources/call.png";
import Meet from "../../Resources/meet.png";
import Proposal from "../../Resources/proposal.png";
import TTD from "../../Resources/ttd.png";

function RoadMap() {
  const RoadM = [
    {
      title: "HUBUNGI KAMI",
      text: "Silahkan hubungi kami dari e-mail: teamproject@autolift.com atau lewat Whatsapp 0812-6077-7993 (Chandra Sitepu). lalu jelaskan kepada kami kebutuhan Anda. Tim kami juga akan memberikan Company Profile dan Honorarium Reference Rate kami untuk Anda ketahui lebih dalam tentang pengalaman korja kami sebelumnya yang tentunya akan menjadi pertimbangan utama bagi Anda",
      img: Call,
    },
    {
      title: "MEETING & BRIEF",
      text: "Anda akan dijadwalkan untuk bertemu dengan Perwakilan kami untuk berdiskusi dan akan dijelaskan lebih detail tentang tahapan perencanaan atau desain, konstruksi dan biaya kami. Dalam proses ini Anda juga dapat berdiskusi dengan kami tentang keinginan, harapan, keterbatasan dan kemampuan Anda terkait dengan biaya proyek, kemudian Anda akan mendapatkan rincian lebih lanjut tentang proses perencanaan dan merealisasikan proyek Anda lengkap dengan persyaratan biaya. Perwakilan kami tersedia pada hari kerja, hari libur atau akhir pekan melalui jadwal yang akan diatur oleh tim kami",
      img: Meet,
    },
    {
      title: "DESAIN PROPOSAL",
      text: "Setelah pertemuan awal dan jika Anda memutuskan untuk melanjutkan ke tahap berikutnya, Tim Arsitek kami akan mensurvei lahan Anda dan mengumpulkan data yang lebih lengkap dan berkomunikasi lebih intens dengan Anda tentang detail persyaratan dan harapan desain yang ingin dicapai. Tim Arsitek kami akan memulai Proposal Desain Awal dalam waktu maksimal 14 hari kerja sejak Anda memutuskan untuk melanjutkan ke tahap ini. Tim kami akan mempresentasikan desain proposal, dan Anda akan melihat secara detall ide atau desain untuk memenuhi kebutuhan dan harapan Anda.",
      img: Proposal,
    },
    {
      title: "TANDA TANGAN KONTRAK",
      text: "Setelah Anda menyetujui dan menyetujui Proposal Desain kami, langkah selanjutnya adalah penandatanganan Kontrak Bersama dan kami secara resmi berkomitmen satu sama lain untuk mencapai Proyek Impian Anda. Tim Inquiry den Legal kami akan mengirimkan Draft Kontrak untuk Anda pelajari, dan tentunya Anda dapat menanyakan dan mendiskusikan hal-hal yang menurut Anda perlu ditambahkan atau disesuaikan dengan minat Anda.",
      img: TTD,
    },
  ];

  return (
    <section className="roadmap" id="roadmap">
      <Row
        style={{
          backgroundColor: "#191A19",
          color: "white",
          paddingTop: "10em",
          paddingBottom: "2em",
        }}
      >
        <br />
        <br />
        <h1 className="text-center" style={{ fontWeight: "bold" }}>
          ROADMAP KERJASAMA
        </h1>

        {RoadM.map((item) => (
          <Row
            style={{
              justifyContent: "center",
            }}
          >
            <Col lg={2} xs={5} md={3} style={{ marginTop: "2rem" }}>
              <img style={{ width: "10rem", height: "10rem" }} src={item.img} />
            </Col>
            <Col lg={9} xs={7} md={9} style={{ marginTop: "3rem" }}>
              <h4 style={{ fontWeight: "bold" }}>{item.title}</h4>
              <p align="justify" style={{ marginRight: "2rem" }}>
                {item.text}
              </p>
            </Col>
          </Row>
        ))}
      </Row>
    </section>
  );
}

export default RoadMap;
