import React from "react";
import "./misc/style.css";
import {
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
  Outlet,
  Link,
} from "react-router-dom";
import Transaksi from "./transaction/index";
import Players from "./players/index";
import Banks from "./bank/index";
import Home from "./mainpage/index";
import DetailTrx from "./transaction/trxDetail";
import { AuthContextFM, AuthProvider } from "./misc/contextApp";
import PrivateRoutes from "./misc/ProtectedRoute";
import Login from "./misc/Login";
import { Button, Container } from "react-bootstrap";
import { auth } from "../config/firebase";
import NewAccount from "./misc/NewAccount";





function MainApp() {
  return (
    <AuthProvider>
      <Container fluid className="fonts-all">
        <Router>
          {/* Routing*/}
          <Routes>
            <Route element={<PrivateRoutes />}>
              <Route path="/" element={<Transaksi />} exact />
              <Route path="/transaction" element={<Transaksi />} />
              <Route path="/players" element={<Players />} />
              <Route path="/banks" element={<Banks />} />
              <Route path="/bank/:id" element={<DetailTrx />} />
              <Route path="/accountcenter" element={<NewAccount />} />
            </Route>
            <Route path="/login" element={<Login />} />
          </Routes>
        </Router>
      </Container>
    </AuthProvider>
  );
}

export default MainApp;
