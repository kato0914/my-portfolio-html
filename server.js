const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDBの接続設定
mongoose.connect('mongodb://localhost:27017/contactForm', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// スキーマの定義
const contactSchema = new mongoose.Schema({
    name: String,
    email: String,
    consultation: String,
    message: String,
});

const Contact = mongoose.model('Contact', contactSchema);

// ミドルウェアの設定
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// メール送信の設定
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER, // 環境変数から取得
        pass: process.env.EMAIL_PASS, // 環境変数から取得　
    },
});

// お問合せの送信処理
app.post('/send', async (req, res) => {
    const { name, email, consultation, message } = req.body;

    // データベースに保存
    const contact = new Contact({ name, email, consultation, message });
    try {
        await contact.save();
        console.log('Contact saved to database'); // 保存成功時のログ
    } catch (err) {
        console.error('Error saving contact:', err); // 保存失敗時のログ
        return res.status(500).send('データベースへの保存に失敗しました。');
    }

    // メールの送信
    const mailOptions = {
        from: email,
        to: 'katoj62@gmail.com', // 管理者のメールアドレス
        subject: '新しいお問合せ',
        text: `お名前: ${name}\nメールアドレス: ${email}\n相談項目: ${consultation}\nメッセージ: ${message}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).send('メール送信に失敗しました。');
        }
        console.log('Email sent:', info.response); // 送信成功時のログ
        res.status(200).json({ message: 'お問合せが送信されました。' });
    });
});

// サーバーの起動
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// フロントエンドのコード
const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('/api/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        console.log(result);
        alert('お問合せが送信されました。');
    } catch (error) {
        console.error('Error:', error);
        alert('送信中にエラーが発生しました。');
    }
});