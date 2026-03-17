import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { firstName, lastName, email, message } = req.body;

  if (!firstName || !email || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: email,
      to: process.env.SMTP_USER,
      subject: `New message from ${firstName} ${lastName}`,
      text: message,
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: "Failed to send email" });
  }
}