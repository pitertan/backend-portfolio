const nodemailer = require("nodemailer");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send({ message: "Method not allowed" });
  }

  const { name, email, message } = req.body;

  // Konfigurasi transporter Nodemailer
  const transporter = nodemailer.createTransport({
    service: "gmail", // Ubah jika menggunakan layanan email lain
    auth: {
      user: "tanuwijayapiter20@gmail.com", // Ganti dengan email Anda
      pass: "pitertan2001", // Ganti dengan password atau App Password
    },
  });

  try {
    // Kirim email
    await transporter.sendMail({
      from: email,
      to: "pitertan0120@gmail.com", // Email penerima
      subject: `Pesan dari ${name}`,
      text: `Nama: ${name}\nEmail: ${email}\nPesan:\n${message}`,
    });

    res.status(200).send({ message: "Email berhasil dikirim!" });
  } catch (error) {
    res.status(500).send({ message: "Terjadi kesalahan.", error });
  }
}
