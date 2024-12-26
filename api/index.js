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
            html: 
                `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                <h2 style="color: #4CAF50;">Pesan Baru</h2>
                <p style="margin: 0 0 10px;"><strong>Nama:</strong> ${name}</p>
                <p style="margin: 0 0 10px;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #4CAF50; text-decoration: none;">${email}</a></p>
                <p style="margin: 0 0 10px;"><strong>Pesan:</strong></p>
                <div style="background-color: #fff; padding: 15px; border: 1px solid #ddd; border-radius: 8px; color: #555;">${message}</div>
                <footer style="margin-top: 20px; font-size: 12px; color: #aaa;"><p>Pesan ini dikirim melalui aplikasi kontak Anda.</p></footer></div>`, // Pesan HTML
        });

        res.status(200).json({ message: 'Pesan berhasil dikirim!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Gagal mengirim pesan.' });
    }
});