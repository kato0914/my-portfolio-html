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
    await contact.save();

    // メールの送信
    const mailOptions = {
        from: email,
        to: 'katoj62@gmail.com', // 管理者のメールアドレス
        subject: '新しいお問合せ',
        text: `お名前: ${name}\nメールアドレス: ${email}\n相談項目: ${consultation}\nメッセージ: ${message}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send('メール送信に失敗しました。');
        }
        res.status(200).send('お問合せが送信されました。');
    });
});

// サーバーの起動
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});