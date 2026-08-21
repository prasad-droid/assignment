import "@fortawesome/fontawesome-free/css/all.min.css";
import { useEffect, useState } from "react";

export default function SideBar() {
  return (
    <nav>
      <h3>Leads Management</h3>
      <div className="links">
        <a
          href="dashboard"
          className={location.href.includes("dashboard") ? "active" : ""}
        >
          <i className="fa-brands fa-trello"></i> Dashboard
        </a>
        <a
          href="leads"
          className={location.href.includes("leads") ? "active" : ""}
        >
          <i className="fa-solid fa-users"></i> Leads
        </a>
      </div>
    </nav>
  );
}
