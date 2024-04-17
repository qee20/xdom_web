import React from "react";
import { NavLink} from "react-router-dom";

function Sidebar() {
  const sideMenus = [
    { name: "home", label: "Home", path: "/" },
    { name: "transaction", label: "Transactions", path: "/transaction" },
    { name: "banks", label: "Banks", path: "/banks" },
    { name: "players", label: "Players", path: "/players" },
    { name: "accounts", label: "Accounts", path: "/accountcenter" },
  ];

  return (
    <nav
      id="sidebarMenu"
      className="col-md-3 col-lg-2 d-md-block bg-warning sidebar collapse"
      style={{ minHeight: '100vh' }}
    >
      <div className="position-sticky pt-3">
        <ul className="nav flex-column">
          {sideMenus.map((menus) => (
            <li className="nav-item">
              <NavLink
                    exact
                    to={menus.path}
                    className="nav-link"
                    activeClassName="active"
                    role="tab"
                    aria-controls="v-pills-home"
                    aria-selected="true"
                  >
                <span data-feather={menus.name}></span>
                {menus.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

export default Sidebar;
