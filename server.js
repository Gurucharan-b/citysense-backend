const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// 🔥 Gmail transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "gurucharan.b2024@vitstudent.ac.in",
    pass: "ogvyawcylyciamku", // paste your 16-digit Gmail app password here
  },
});

app.post("/send-alert", async (req, res) => {
  try {
    const { issue, severity, confidence, lat, lng } = req.body;

    const mailOptions = {
      from: "CitySense AI <charanbk2050@gmail.com>",
      to: "charanbk2050@gmail.com",
      subject: "🚨 Critical CitySense Alert",
      text: `
Issue: ${issue}
Severity: ${severity}
Confidence: ${confidence}%
Location: ${lat}, ${lng}
Time: ${new Date()}
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Email Sent Successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.toString() });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});