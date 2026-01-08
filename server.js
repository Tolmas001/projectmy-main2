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

// Bazani o'qish va dastlabki mahsulotlarni yaratish
const readDB = () => {
    let db = { products: [], orders: [], users: [] };
    if (fs.existsSync(DB_PATH)) {
        db = JSON.parse(fs.readFileSync(DB_PATH));
    }
    
    // Agar mahsulotlar bo'sh bo'lsa, ularni to'ldirish
    if (!db.products || db.products.length === 0) {
        const productData = [
            { name: "Matte Lipstick", category: "Makiyaj", basePrice: 12, img: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d" },
            { name: "Vitamin C Serum", category: "Yuz parvarishi", basePrice: 35, img: "https://images.unsplash.com/photo-1599733594230-6b823276abcc" },
            { name: "Luxury Perfume", category: "Atirlar", basePrice: 75, img: "https://images.unsplash.com/photo-1541643600914-78b084683601" },
            { name: "Cleansing Gel", category: "Yuz parvarishi", basePrice: 20, img: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571" },
            { name: "Eyeshadow Palette", category: "Makiyaj", basePrice: 30, img: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796" },
            { name: "Hair Mask", category: "Soch parvarishi", basePrice: 25, img: "https://images.unsplash.com/photo-1527799822340-304bc6475a6c" }
        ];

        const products = [];
        for (let i = 1; i <= 150; i++) {
            const base = productData[(i - 1) % productData.length];
            const p = base.basePrice + (i % 10);
            products.push({
                id: i,
                name: `${base.name} #${i}`,
                price: p,
                oldPrice: p + 5,
                category: base.category,
                description: "Ushbu premium mahsulot teringizni oziqlantiradi va unga tabiiy go'zallik bag'ishlaydi. 100% original va sifatli.",
                image: `${base.img}?w=500&sig=${i}`
            });
        }
        db.products = products;
        fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
    }
    return db;
};

const writeDB = (data) => {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
};

// --- API YO'LLARI ---

// Mahsulotlarni olish
app.get('/api/products', (req, res) => {
    const db = readDB();
    res.json(db.products);
});

// Mahsulot qo'shish yoki tahrirlash
app.post('/api/products', (req, res) => {
    const db = readDB();
    const product = req.body;
    if (product.id) {
        const index = db.products.findIndex(p => p.id === product.id);
        if (index !== -1) db.products[index] = product;
    } else {
        product.id = Date.now();
        db.products.unshift(product);
    }
    writeDB(db);
    res.json({ message: "Saqlandi!", product });
});

// Mahsulotni o'chirish
app.delete('/api/products/:id', (req, res) => {
    const db = readDB();
    const id = parseInt(req.params.id);
    db.products = db.products.filter(p => p.id !== id);
    writeDB(db);
    res.json({ message: "O'chirildi" });
});

// Buyurtmalarni saqlash yoki yangilash
app.post('/api/orders', (req, res) => {
    const db = readDB();
    const orderData = req.body;
    
    if (orderData.id) {
        // Yangilash (Status o'zgartirish uchun)
        const index = db.orders.findIndex(o => o.id == orderData.id);
        if (index !== -1) {
            db.orders[index] = { ...db.orders[index], ...orderData };
        }
    } else {
        // Yangi buyurtma
        const newOrder = { 
            id: Date.now().toString(), 
            ...orderData, 
            date: new Date().toISOString(),
            status: 'pending'
        };
        db.orders.unshift(newOrder);
    }
    
    writeDB(db);
    res.json({ message: "Muvaffaqiyatli!", orders: db.orders });
});

// Buyurtmani o'chirish
app.delete('/api/orders/:id', (req, res) => {
    const db = readDB();
    const id = req.params.id;
    db.orders = db.orders.filter(o => o.id.toString() !== id.toString());
    writeDB(db);
    res.json({ message: "Buyurtma o'chirildi" });
});

app.listen(PORT, () => console.log(`Backend server running on http://localhost:${PORT}`));
