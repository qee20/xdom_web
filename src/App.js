import React, {
  useRef,
  useEffect,
  useState,
  createContext,
  useContext,
} from "react";
import { Container, Row, Col, Navbar, Table } from "react-bootstrap";
import {
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
  Outlet,
} from "react-router-dom";
import EditGalleryInfo from "./Admin/EditGalleryInfo";
import Index from "./Admin/Index";
import InfoEdit from "./Admin/InfoEdit";
import TambahGaleri from "./Admin/TambahGaleri";
import Gallerries from "./Client/Katalog/Gallerries";
import Initials from "./Client/MainContent";
import "./App.css";
import { Button, Card, CardGroup } from "react-bootstrap";
import Nav from "react-bootstrap/Nav";
import NavSS from "./Client/NavSS";
import { AuthContext, AuthProvider } from "./config/context";
import Footer from "./Client/Footer";
import Login from "./Admin/Login";
import ProtectedRoute from "./Admin/ProtectedRoute";
import PrivateRoutes from "./Admin/ProtectedRoute";
import { auth } from "./config/firebase";
import NewsItem from "./Admin/NewsItem";

const WithNav = () => {
  return (
    <>
      <NavSS />
      <Outlet />
      <Footer />
    </>
  );
};

const WithoutNav = () => {
  return (
    <>
      <Outlet />
    </>
  );
};

function App() {
  return (
    <Router>
      <Container fluid className="fonts-all">
        <AuthProvider>
          {/* Routing*/}
          <Routes>
            <Route element={<PrivateRoutes />}>
              <Route path="/admin" element={<Index />} />
              <Route path="/admin/infoedit" element={<InfoEdit />} />
              <Route path="/admin/galleries" element={<TambahGaleri />} />
              <Route
                path="/admin/galleries/:id"
                element={<EditGalleryInfo />}
              />
              <Route path="/admin/news" element={<NewsItem />} />
            </Route>
            <Route path="/katalog/:code" element={<Gallerries />} />
            <Route path="/login" element={<Login />} />
            <Route element={<Initials />} path="/" exact />
          </Routes>
        </AuthProvider>
      </Container>
    </Router>
  );
}

export default App;
