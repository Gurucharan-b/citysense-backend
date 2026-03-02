const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// 🔥 Gmail transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "gurucharan.b2024@vitstudent.ac.in",
    pass: "ogvyawcylyciamku",
  },
});

// 🔥 Analyze via Roboflow (backend)
app.post("/analyze", async (req, res) => {
  try {
    const { imageBase64 } = req.body;

    const response = await axios({
      method: "POST",
      url: "https://serverless.roboflow.com/pothole-ks92t/1",
      params: {
        api_key: "6t6pL2cZf4yWtIYewoMl",
      },
      data: imageBase64,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    let confidence = 0;

    if (
      response.data.predictions &&
      response.data.predictions.length > 0
    ) {
      confidence =
        response.data.predictions[0].confidence;
    }

    res.json({ confidence });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.toString() });
  }
});

// 🔥 Send Email
app.post("/send-alert", async (req, res) => {
  try {
    const { issue, severity, confidence, lat, lng } = req.body;

    await transporter.sendMail({
      from: "CitySense AI",
      to: "charanbk2050@gmail.com",
      subject: "🚨 Critical CitySense Alert",
      text: `
Issue: ${issue}
Severity: ${severity}
Confidence: ${confidence}%
Location: ${lat}, ${lng}
Time: ${new Date()}
      `,
    });

    res.json({ message: "Email Sent" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.toString() });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);