export default function handler(req, res) {
    if (req.method === 'POST') {
        // リクエストの処理
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
            }});
        // ここでメール送信やデータベースへの保存処理を行う
        res.status(200).json({ message: 'お問合せが送信されました！' });
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}