import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
//import { pathToFileURL } from "url";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for Contact Form
  app.post("/api/contact", async (req, res) => {
    const { firstName, lastName, email, message } = req.body;

    if (!firstName || !email || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      // Note: To make this work, the user needs to provide SMTP credentials
      // For now, we'll use a mock transport or log it, but we'll set up the real structure.
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.SMTP_USER || "vooltgrouplimited@gmail.com",
          pass: process.env.SMTP_PASS, // User needs to set this in secrets
        },
      });

      const mailOptions = {
        from: email,
        to: "vooltgrouplimited@gmail.com",
        subject: `VooltTrip New Form Submission from ${firstName} ${lastName}`,
        text: `
          Name: ${firstName} ${lastName}
          Email: ${email}
          Message: ${message}
        `,
      };

      // If SMTP_PASS is not set, we'll just log it and return success for the demo
      if (!process.env.SMTP_PASS) {
        console.log("Contact form submission received (SMTP_PASS not set):", req.body);
        return res.json({ success: true, message: "Message received (Demo Mode)" });
      }

      await transporter.sendMail(mailOptions);
      res.json({ success: true });
    } catch (error) {
      console.error("Email error:", error);
      res.status(500).json({ error: "Failed to send message" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
