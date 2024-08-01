import Contact from '../models/Contact'; // Contactモデルをインポート
import nodemailer from 'nodemailer'; // nodemailerをインポート

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { name, email, consultation, message } = req.body;

        // データベースに保存
        const contact = new Contact({ name, email, consultation, message });
        try {
            await contact.save();
            console.log('Contact saved to database');
        } catch (err) {
            console.error('Error saving contact:', err);
            return res.status(500).json({ error: 'データベースへの保存に失敗しました。' });
        }

        // メールの送信
        const transporter = nodemailer.createTransport({
            // ここにSMTP設定を追加
        });

        const mailOptions = {
            from: process.env.EMAIL_FROM, // 送信元のメールアドレスを環境変数から設定
            to: 'katoj62@gmail.com',
            subject: '新しいお問合せ',
            text: `お名前: ${name}\nメールアドレス: ${email}\n相談項目: ${consultation}\nメッセージ: ${message}`,
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log('Email sent successfully');
            res.status(200).json({ message: 'お問合せが送信されました！' });
        } catch (error) {
            console.error('Error sending email:', error);
            res.status(500).json({ error: 'メールの送信に失敗しました。' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}