const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

// DB Connection
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

connection.connect((error) => {
  if (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
  console.log("Database Connected");
});

// Inital url
app.get("/", (req, res) => {
  res.send("Leads Management assignment");
});

// health check
app.get("/api/test", (req, res) => {
  res.send("Database Connected and API is Working");
});

// GET Leads
app.get("/api/leads", (req, res) => {
  connection.query("SELECT * FROM `leads`", (error, results) => {
    if (error) {
      return res.status(500).json({ error: "Failed to fetch leads" });
    }
    res.json(results);
  });
});

// POST Lead
app.post("/api/lead", (req, res) => {
  if (!req.body) {
    return res.status(400).json({
      error: "Request Body is required",
    });
  }
  const { name, company, mobile, email, category, lead_status, followup } =
    req.body;

  let query = `INSERT INTO leads( Name, Company, Mobile, Email, Category, Lead_status, Follow_up_date) VALUES ('${name}','${company}','${mobile}','${email}','${category}','${lead_status}','${followup}')`;

  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Failed To add Lead(s) " + err });
    }
    res.json({
      message: "Lead Added Successfully",
    });
  });
});

// UPDATE Lead
app.put("/api/lead/:id", (req, res) => {
  const lead_id = req.params.id;

  if (!req.body) {
    return res.status(400).json({
      error: "Request Body is required",
    });
  }

  const { name, company, mobile, email, category, lead_status, followup } =
    req.body;

  const query = `UPDATE leads SET Name = ?, Company = ?, Mobile = ?, Email = ?, Category = ?, Lead_status = ?, Follow_up_date = ? WHERE id = ?`;

  const values = [
    name,
    company,
    mobile,
    email,
    category,
    lead_status,
    followup,
    lead_id,
  ];

  connection.query(query, values, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        error: "Failed to update lead",
      });
    }

    res.json({
      message: "Lead updated successfully",
      result: results,
    });
  });
});

// DELETE Lead
app.delete("/api/lead/:id", (req, res) => {
  let lead_id = req.params.id;
  let query = `DELETE from leads WHERE id = ?`;
  connection.query(query, lead_id, (err, result) => {
    if (err) {
      return res.status(500).json({
        error: "Failed to delete leads",
      });
    }
    res.json({
      message: "Lead Deleted Successfully",
    });
  });
});

app.get("/api/dashboard", async (req, res) => {
  try {
    const query = (sql, params = []) => {
      return new Promise((resolve, reject) => {
        connection.query(sql, params, (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
      });
    };

    const [
      totalLeads,
      newLeads,
      followups,
      todaysFollowups,
      convertedLeads,
      statusStats,
    ] = await Promise.all([
      // Total Leads
      query(`SELECT * FROM leads ORDER BY id DESC`),

      // New Leads
      query(`SELECT * FROM leads WHERE lead_status = 'new' ORDER BY id DESC `),

      // All Follow-ups
      query(
        ` SELECT * FROM leads WHERE follow_up_date IS NOT NULL ORDER BY follow_up_date DESC`,
      ),

      // Today's Follow-ups
      query(
        `SELECT * FROM leads WHERE DATE(follow_up_date) = CURDATE() ORDER BY follow_up_date ASC`,
      ),

      // Converted Leads
      query(
        `SELECT * FROM leads WHERE lead_status = 'converted' ORDER BY id DESC`,
      ),

      // Lead Status Statistics
      query(
        `SELECT lead_status, COUNT(*) AS count FROM leads GROUP BY lead_status`,
      ),
    ]);

    res.json({
      success: true,

      summary: {
        total_leads: totalLeads.length,
        new_leads: newLeads.length,
        total_followups: followups.length,
        todays_followups: todaysFollowups.length,
        converted_leads: convertedLeads.length,
      },

      leads: {
        all: totalLeads,
        new: newLeads,
        converted: convertedLeads,
      },

      followups: {
        all: followups,
        today: todaysFollowups,
      },

      statistics: {
        status: statusStats,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: "Error fetching dashboard data"+error,
    });
  }
});

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
