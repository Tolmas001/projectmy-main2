const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));

// Ma'lumotlarni o'qish funksiyasi
const readDB = () => {
    const data = fs.readFileSync(path.join(__dirname, 'database.json'));
    return JSON.parse(data);
};

// Ma'lumotlarni yozish funksiyasi
const writeDB = (data) => {
    fs.writeFileSync(path.join(__dirname, 'database.json'), JSON.stringify(data, null, 2));
};

// --- API YO'LLARI ---

// 1. Barcha mahsulotlarni olish
app.get('/api/products', (req, res) => {
    const db = readDB();
    res.json(db.products);
});

// 2. Yangi buyurtma yaratish
app.post('/api/orders', (req, res) => {
    const db = readDB();
    const newOrder = {
        id: Date.now(),
        ...req.body,
        date: new Date().toISOString()
    };
    db.orders.push(newOrder);
    writeDB(db);
    res.status(201).json({ message: "Buyurtma qabul qilindi!", orderId: newOrder.id });
});

// 3. Foydalanuvchini ro'yxatdan o'tkazish
app.post('/api/users', (req, res) => {
    const db = readDB();
    const newUser = req.body;
    db.users.push(newUser);
    writeDB(db);
    res.status(201).json({ message: "Foydalanuvchi yaratildi!" });
});

// 4. Admin uchun barcha buyurtmalarni ko'rish
app.get('/api/admin/orders', (req, res) => {
    const db = readDB();
    res.json(db.orders);
});

// 5. Buyurtmani o'chirish
app.delete('/api/admin/orders/:id', (req, res) => {
    const db = readDB();
    const id = parseInt(req.params.id);
    db.orders = db.orders.filter(o => o.id !== id);
    writeDB(db);
    res.json({ message: "Buyurtma o'chirildi" });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
