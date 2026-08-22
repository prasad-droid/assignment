import { useState } from "react";

export default function Modal({ lead, onClose, onSaved }) {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://assignment-self-eta.vercel.app";
  const [form, setForm] = useState({
    name: lead.name || "",
    company: lead.company || "",
    mobile: lead.mobile || "",
    email: lead.email || "",
    category: lead.category || "",
    lead_status: lead.lead_status || "New",
    follow_up_date: lead.follow_up_date?.split("T")[0] || "",
  });

  const submit = async (event) => {
    event.preventDefault();
    const response = await fetch(
      `${API_BASE_URL}/api/lead${lead.id ? `/${lead.id}` : ""}`,
      {
        method: lead.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      },
    );
    onSaved(await response.json());
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <form
        className="modal"
        onSubmit={submit}
        onClick={(event) => event.stopPropagation()}
      >
        <h2>{lead.id ? "Update Lead" : "Add Lead"}</h2>
        {[
          ["name", "Name"],
          ["company", "Company"],
          ["mobile", "Mobile"],
          ["email", "Email"],
          ["category", "Interested Category"],
          ["follow_up_date", "Follow-up Date"],
        ].map(([name, label]) => (
          <label key={name}>
            {label}
            <input
              name={name}
              type={name === "follow_up_date" ? "date" : "text"}
              value={form[name]}
              onChange={(event) =>
                setForm({ ...form, [name]: event.target.value })
              }
              required
            />
          </label>
        ))}
        <label>
          Status
          <select
            name="lead_status"
            value={form.lead_status}
            onChange={(event) =>
              setForm({ ...form, lead_status: event.target.value })
            }
          >
            {["New", "Contacted", "Follow-up", "Converted", "Lost"].map(
              (status) => (
                <option key={status}>{status}</option>
              ),
            )}
          </select>
        </label>
        <button type="button" onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className="btn-primary">
          {lead.id ? "Update" : "Add"} Lead
        </button>
      </form>
    </div>
  );
}
