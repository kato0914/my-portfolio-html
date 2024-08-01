import Contact from '../../models/Contact'; // パスを修正
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            console.log('Received POST request:', req.body);

            const { name, email, consultation, message } = req.body;

            // データベースに保存
            console.log('Attempting to save contact to database');
            const contact = new Contact({ name, email, consultation, message });
            await contact.save();
            console.log('Contact saved to database');

            // メールの送信
            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: process.env.SMTP_PORT,
                secure: process.env.SMTP_SECURE === 'true',
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                },
            });

            const mailOptions = {
                from: process.env.EMAIL_FROM || 'katoj62@gmail.com',
                to: 'katoj62@gmail.com',
                subject: '新しいお問合せ',
                text: `お名前: ${name}\nメールアドレス: ${email}\n相談項目: ${consultation}\nメッセージ: ${message}`,
            };

            await transporter.sendMail(mailOptions);
            console.log('Email sent successfully');
            
            res.status(200).json({ message: 'お問合せが送信されました！' });
        } catch (error) {
            console.error('Error in API route:', error);
            res.status(500).json({ 
                error: 'サーバーエラーが発生しました。', 
                details: error.message,
                stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
            });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}