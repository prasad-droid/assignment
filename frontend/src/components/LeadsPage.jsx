import { useEffect, useState } from "react";
import Modal from "./Modal";

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [leadToEdit, setLeadToEdit] = useState(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  async function fetchLeads() {
    let response = await fetch(`${API_BASE_URL}/api/leads`);
    let data = await response.json();
    setLeads(data);
  }

  useEffect(() => {
    fetchLeads();
  }, []);

  async function deleteLead(id) {
    const response = await fetch(`${API_BASE_URL}/api/lead/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error("Failed to delete lead");
    }

    fetchLeads();
  }

  return (
    <div className="leadsPage">
      <div className="header">
        <h1>Leads</h1>
        <button className="btn-primary" onClick={() => setLeadToEdit({})}>
          Add Lead
        </button>
      </div>

      <div className="leadsTable">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Company</th>
              <th>Mobile</th>
              <th>Email</th>
              <th>Interested Category</th>
              <th>Status</th>
              <th>Follow-up Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {!leads ? (
              <tr>
                <td colSpan={5}> Loading ...</td>
              </tr>
            ) : leads.length != 0 ? (
              leads?.map((item, index) => {
                return (
                  <tr key={index}>
                    <td> {item.name} </td>
                    <td> {item.company} </td>
                    <td> {item.mobile} </td>
                    <td> {item.email} </td>
                    <td> {item.category} </td>
                    <td>
                      <span
                        className="status"
                        style={
                          item.lead_status == "New"
                            ? { background: "#2563eb" }
                            : item.lead_status == "Contacted"
                              ? { background: "#14b8a6" }
                              : item.lead_status == "Follow-up"
                                ? { background: "#f59e0b" }
                                : item.lead_status == "Converted"
                                  ? { background: "#22c55e" }
                                  : { background: "#ef4444" }
                        }
                      >
                        {item.lead_status}
                      </span>
                    </td>
                    <td> {item.follow_up_date?.split("T")[0]} </td>
                    <td>
                      <button
                        className="updateBtn"
                        onClick={() => setLeadToEdit(item)}
                      >
                        <i className="fa-solid fa-pen"></i>{" "}
                      </button>
                      <button
                        className="deleteBtn"
                        onClick={() => {
                          deleteLead(item.id);
                        }}
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5}>There are No Follow-ups Today</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {leadToEdit && (
        <Modal
          lead={leadToEdit}
          onClose={() => setLeadToEdit(null)}
          onSaved={(savedLead) => {
            setLeads((currentLeads) =>
              leadToEdit.id
                ? currentLeads.map((item) =>
                    item.id === savedLead.id ? savedLead : item,
                  )
                : [...currentLeads, savedLead],
            );
            setLeadToEdit(null);
          }}
        />
      )}
    </div>
  );
}
