require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Nodemailer Transporter
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Endpoint untuk mengirim email
app.post('/send', async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        await transporter.sendMail({
            from: `"${name}" <${email}>`, // Pengirim
            to: process.env.TARGET_EMAIL, // Penerima
            subject: `Pesan Baru dari ${name}`, // Subjek
            text: message, // Pesan teks biasa
            html: `<p><strong>Nama:</strong> ${name}</p>
                   <p><strong>Email:</strong> ${email}</p>
                   <p><strong>Pesan:</strong><br>${message}</p>`, // Pesan HTML
        });

        res.status(200).json({ message: 'Pesan berhasil dikirim!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Gagal mengirim pesan.' });
    }
});

// Jalankan server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
