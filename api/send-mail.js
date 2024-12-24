const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Konfigurasi transporter untuk Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail", // Ganti dengan layanan email Anda (contoh: Gmail, Outlook, dll.)
  auth: {
    user: "tanuwijayapiter20@gmail.com", // Ganti dengan email Anda
    pass: "pitertan2001", // Ganti dengan password email Anda atau app password
  },
});

// Endpoint untuk menerima data formulir dan mengirim email
app.post("/send-email", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    await transporter.sendMail({
      from: email,
      to: "pitertan0120@gmail.com", // Ganti dengan email penerima
      subject: `Pesan dari ${name}`,
      text: `Nama: ${name}\nEmail: ${email}\nPesan:\n${message}`,
    });

    res.status(200).send({ message: "Email berhasil dikirim!" });
  } catch (error) {
    res.status(500).send({ message: "Terjadi kesalahan. Coba lagi nanti.", error });
  }
});

// Jalankan server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});
