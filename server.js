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

// Bazani o'qish funksiyasi
const readDB = () => {
    if (!fs.existsSync(DB_PATH)) {
        fs.writeFileSync(DB_PATH, JSON.stringify({ products: [], orders: [], users: [] }));
    }
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
};

// Bazaga yozish funksiyasi
const writeDB = (data) => {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
};

// --- API ---

// Mahsulotlarni olish
app.get('/api/products', (req, res) => {
    res.json(readDB().products);
});

// Mahsulot qo'shish yoki tahrirlash
app.post('/api/products', (req, res) => {
    let db = readDB();
    const p = req.body;
    
    if (p.id) {
        // TAHRIRLASH: Mavjud mahsulotni ID bo'yicha yangilash
        const index = db.products.findIndex(x => x.id.toString() === p.id.toString());
        if (index !== -1) {
            db.products[index] = { ...db.products[index], ...p };
            console.log("Mahsulot tahrirlandi:", p.id);
        } else {
            return res.status(404).json({ message: "Topilmadi" });
        }
    } else {
        // YANGI QO'SHISH
        p.id = Date.now().toString();
        db.products.unshift(p);
        console.log("Yangi mahsulot qo'shildi:", p.id);
    }
    
    writeDB(db);
    res.json({ message: "OK", product: p });
});

// Mahsulotni o'chirish
app.delete('/api/products/:id', (req, res) => {
    let db = readDB();
    const initialLen = db.products.length;
    db.products = db.products.filter(p => p.id.toString() !== req.params.id.toString());
    
    if (db.products.length < initialLen) {
        writeDB(db);
        res.json({ message: "OK" });
    } else {
        res.status(404).json({ message: "Topilmadi" });
    }
});

// Buyurtmalar
app.get('/api/orders', (req, res) => res.json(readDB().orders));

app.post('/api/orders', (req, res) => {
    let db = readDB();
    const data = req.body;
    if (data.id) {
        const i = db.orders.findIndex(o => o.id.toString() === data.id.toString());
        if (i !== -1) db.orders[i].status = data.status;
    } else {
        const newOrder = { id: Math.floor(Math.random()*900000+100000).toString(), ...data, date: new Date().toISOString(), status: 'pending' };
        db.orders.unshift(newOrder);
        writeDB(db);
        return res.json({ message: "OK", order: newOrder });
    }
    writeDB(db);
    res.json({ message: "OK" });
});

app.delete('/api/orders/:id', (req, res) => {
    let db = readDB();
    db.orders = db.orders.filter(o => o.id.toString() !== req.params.id.toString());
    writeDB(db);
    res.json({ message: "OK" });
});

app.listen(PORT, () => console.log(`Server: http://localhost:${PORT}`));
