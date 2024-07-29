export default function handler(req, res) {
    if (req.method === 'POST') {
        // リクエストの処理
        const { name, email, message } = req.body;
        // ここでメール送信やデータベースへの保存処理を行う
        res.status(200).json({ message: 'お問合せが送信されました。' });
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}