const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));

const DB_PATH = path.join(__dirname, 'database.json');

const readDB = () => {
    if (!fs.existsSync(DB_PATH)) {
        fs.writeFileSync(DB_PATH, JSON.stringify({ products: [], orders: [], users: [] }));
    }
    return JSON.parse(fs.readFileSync(DB_PATH));
};

const writeDB = (data) => {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
};

// --- API ---

// Buyurtmalarni olish
app.get('/api/orders', (req, res) => {
    const db = readDB();
    // Agar xaridor emaili berilgan bo'lsam, faqat uning buyurtmalarini qaytaramiz
    if (req.query.email) {
        const userOrders = db.orders.filter(o => o.customer.email === req.query.email);
        return res.json(userOrders);
    }
    res.json(db.orders);
});

// Yangi buyurtma yoki Status yangilash
app.post('/api/orders', (req, res) => {
    const db = readDB();
    const data = req.body;

    if (data.id) {
        // STATUS YANGILASH
        const index = db.orders.findIndex(o => o.id.toString() === data.id.toString());
        if (index !== -1) {
            db.orders[index].status = data.status;
            writeDB(db);
            return res.json({ message: "Status yangilandi", order: db.orders[index] });
        }
    } else {
        // YANGI BUYURTMA
        const newOrder = {
            id: Math.floor(100000 + Math.random() * 900000).toString(),
            ...data,
            date: new Date().toISOString(),
            status: 'pending'
        };
        db.orders.unshift(newOrder);
        writeDB(db);
        return res.json({ message: "Qabul qilindi", order: newOrder });
    }
    res.status(400).json({ message: "Xato" });
});

// Buyurtmani o'chirish (Xatosiz variant)
app.delete('/api/orders/:id', (req, res) => {
    const db = readDB();
    const idToDelete = req.params.id.toString();
    const initialCount = db.orders.length;
    
    db.orders = db.orders.filter(o => o.id.toString() !== idToDelete);
    
    if (db.orders.length < initialCount) {
        writeDB(db);
        res.json({ message: "O'chirildi" });
    } else {
        res.status(404).json({ message: "Topilmadi" });
    }
});

// Mahsulotlar uchun API (Avvalgi kodingizdek qoladi)
app.get('/api/products', (req, res) => res.json(readDB().products));
app.post('/api/products', (req, res) => {
    const db = readDB();
    const p = req.body;
    if (p.id) {
        const i = db.products.findIndex(x => x.id == p.id);
        if (i !== -1) db.products[i] = p;
    } else {
        p.id = Date.now();
        db.products.unshift(p);
    }
    writeDB(db);
    res.json(p);
});

app.listen(PORT, () => console.log(`Server: http://localhost:${PORT}`));
