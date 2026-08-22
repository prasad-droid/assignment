const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

app.use(cors({
  origin: "https://lightgoldenrodyellow-dogfish-361262.hostingersite.com",
}));

// DB Connection
const db = mysql
  .createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0,
  })
  .promise();

// Inital url
app.get("/", (req, res) => {
  res.send("Leads Management assignment");
});

// health check
app.get("/api/test", async (req, res) => {
  try {
    await db.query("SELECT 1");
    res.send("Database Connected and API is Working");
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Database connection failed",
      code: error.code,
      detail: error.message,
    });
  }
});

// GET Leads
app.get("/api/leads", async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM `leads`");
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch leads" });
  }
});

// POST Lead
app.post("/api/lead", async (req, res) => {
  const { name, company, mobile, email, category, lead_status, followup } =
    req.body || {};

  if (!name || !mobile) {
    return res.status(400).json({
      error: "Request Body is required",
    });
  }

  const query = `INSERT INTO leads( Name, Company, Mobile, Email, Category, Lead_status, Follow_up_date) VALUES (?, ?, ?, ?, ?, ?, ?)`;

  const values = [name, company, mobile, email, category, lead_status, followup];

  try {
    await db.query(query, values);
    res.json({
      message: "Lead Added Successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed To add Lead(s)" });
  }
});

// UPDATE Lead
app.put("/api/lead/:id", async (req, res) => {
  if (!req.body) {
    return res.status(400).json({
      error: "Request Body is required",
    });
  }

  const lead_id = req.params.id;
  const { name, company, mobile, email, category, lead_status, follow_up_date } =
    req.body;

  const query = `UPDATE leads SET Name = ?, Company = ?, Mobile = ?, Email = ?, Category = ?, Lead_status = ?, Follow_up_date = ? WHERE id = ?`;

  const values = [
    name,
    company,
    mobile,
    email,
    category,
    lead_status,
    follow_up_date,
    lead_id,
  ];

  try {
    await db.query(query, values);
    res.json({
      message: "Lead updated successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Failed to update lead",
    });
  }
});

// DELETE Lead
app.delete("/api/lead/:id", async (req, res) => {
  const lead_id = req.params.id;

  try {
    await db.query(`DELETE FROM leads WHERE id = ?`, [lead_id]);
    res.json({
      message: "Lead Deleted Successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Failed to delete leads",
    });
  }
});

// Dashboard stats
app.get("/api/dashboard", async (req, res) => {
  try {
    const [
      totalLeads,
      newLeads,
      followups,
      todaysFollowups,
      convertedLeads,
      statusStats,
      monthlyLeads,
      yearlyLeads,
    ] = (
      await Promise.all([
        // Total Leads
        db.query(`SELECT * FROM leads ORDER BY id DESC`),

        // New Leads
        db.query(`SELECT * FROM leads WHERE lead_status = 'new' ORDER BY id DESC `),

        // All Follow-ups
        db.query(
          ` SELECT * FROM leads WHERE follow_up_date IS NOT NULL ORDER BY follow_up_date DESC`,
        ),

        // Today's Follow-ups
        db.query(
          `SELECT * FROM leads WHERE DATE(follow_up_date) = CURDATE() ORDER BY follow_up_date ASC`,
        ),

        // Converted Leads
        db.query(`SELECT * FROM leads WHERE lead_status = 'converted' ORDER BY id DESC`),

        // Lead Status Statistics
        db.query(
          `SELECT lead_status, COUNT(*) AS count FROM leads GROUP BY lead_status`,
        ),

        // Leads grouped by month and year
        db.query(
          `SELECT YEAR(created_at) AS year, MONTH(created_at) AS month, COUNT(*) AS count
           FROM leads
           WHERE created_at IS NOT NULL
           GROUP BY YEAR(created_at), MONTH(created_at)
           ORDER BY year DESC, month DESC`,
        ),

        // Leads grouped by year
        db.query(
          `SELECT YEAR(created_at) AS year, COUNT(*) AS count
           FROM leads
           WHERE created_at IS NOT NULL
           GROUP BY YEAR(created_at)
           ORDER BY year DESC`,
        ),
      ])
    ).map(([rows]) => rows);

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
        monthly: monthlyLeads,
        yearly: yearlyLeads,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: "Error fetching dashboard data",
    });
  }
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`app listening on port ${port}`);
  });
}

module.exports = app;
