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
    let db = { products: [], orders: [], users: [] };
    if (fs.existsSync(DB_PATH)) {
        try {
            db = JSON.parse(fs.readFileSync(DB_PATH));
        } catch (e) { console.error("JSON Error"); }
    }
    // Agar baza bo'sh bo'lsa yoki narxlar eski ($) bo'lsa, yangilaymiz
    if (!db.products || db.products.length === 0 || db.products[0].price < 1000) {
        db.products = generateInitialProducts();
        fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
    }
    return db;
};

const writeDB = (data) => fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));

function generateInitialProducts() {
    const productData = [
        { name: "Matte Lipstick", category: "Makiyaj", basePrice: 150000, img: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d" },
        { name: "Vitamin C Serum", category: "Yuz parvarishi", basePrice: 350000, img: "https://images.unsplash.com/photo-1599733594230-6b823276abcc" },
        { name: "Luxury Perfume", category: "Atirlar", basePrice: 850000, img: "https://images.unsplash.com/photo-1541643600914-78b084683601" },
        { name: "Cleansing Gel", category: "Yuz parvarishi", basePrice: 120000, img: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571" },
        { name: "Eyeshadow Palette", category: "Makiyaj", basePrice: 450000, img: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796" },
        { name: "Hair Mask", category: "Soch parvarishi", basePrice: 200000, img: "https://images.unsplash.com/photo-1527799822340-304bc6475a6c" }
    ];
    const products = [];
    for (let i = 1; i <= 150; i++) {
        const base = productData[(i - 1) % productData.length];
        const p = base.basePrice + (i * 1000);
        products.push({
            id: i.toString(),
            name: `${base.name} #${i}`,
            price: p,
            oldPrice: p + 50000,
            category: base.category,
            description: "Ushbu premium mahsulot teringizni oziqlantiradi va unga tabiiy go'zallik bag'ishlaydi.",
            image: `${base.img}?w=500&sig=${i}`
        });
    }
    return products;
}

app.get('/api/products', (req, res) => res.json(readDB().products));

app.post('/api/products', (req, res) => {
    const db = readDB();
    const p = req.body;
    if (p.id) {
        const i = db.products.findIndex(x => x.id.toString() === p.id.toString());
        if (i !== -1) db.products[i] = p;
    } else {
        p.id = Date.now().toString();
        db.products.unshift(p);
    }
    writeDB(db);
    res.json(p);
});

app.delete('/api/products/:id', (req, res) => {
    const db = readDB();
    db.products = db.products.filter(p => p.id.toString() !== req.params.id.toString());
    writeDB(db);
    res.json({ message: "O'chirildi" });
});

app.get('/api/orders', (req, res) => {
    const db = readDB();
    if (req.query.email) return res.json(db.orders.filter(o => o.customer.email === req.query.email));
    res.json(db.orders);
});

app.post('/api/orders', (req, res) => {
    const db = readDB();
    const data = req.body;
    if (data.id) {
        const i = db.orders.findIndex(o => o.id.toString() === data.id.toString());
        if (i !== -1) db.orders[i].status = data.status;
    } else {
        const newOrder = {
            id: Math.floor(100000 + Math.random() * 900000).toString(),
            ...data,
            date: new Date().toISOString(),
            status: 'pending'
        };
        db.orders.unshift(newOrder);
        writeDB(db);
        return res.json({ message: "Qabul qilindi", order: newOrder, orders: db.orders });
    }
    writeDB(db);
    res.json({ message: "Yangilandi", orders: db.orders });
});

app.delete('/api/orders/:id', (req, res) => {
    const db = readDB();
    db.orders = db.orders.filter(o => o.id.toString() !== req.params.id.toString());
    writeDB(db);
    res.json({ message: "O'chirildi" });
});

app.listen(PORT, () => console.log(`Server: http://localhost:${PORT}`));
