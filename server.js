const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// CORS - bu boshqa sahifalardan ulanishga ruxsat beradi
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));

const DB_PATH = path.join(__dirname, 'database.json');

// Bazani o'qish funksiyasi
const readDB = () => {
    try {
        if (!fs.existsSync(DB_PATH)) {
            const initialData = { products: generateInitialProducts(), orders: [], users: [] };
            fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2));
            return initialData;
        }
        const data = fs.readFileSync(DB_PATH, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error("Baza o'qishda xato:", err);
        return { products: [], orders: [], users: [] };
    }
};

const writeDB = (data) => {
    try {
        fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
    } catch (err) {
        console.error("Bazaga yozishda xato:", err);
    }
};

function generateInitialProducts() {
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
    return products;
}

// --- API ---

app.get('/', (req, res) => res.send("Krist API Server ishlayapti! ✅"));

app.get('/api/products', (req, res) => {
    const db = readDB();
    res.json(db.products);
});

app.post('/api/products', (req, res) => {
    const db = readDB();
    const product = req.body;
    if (product.id) {
        const index = db.products.findIndex(p => p.id == product.id);
        if (index !== -1) db.products[index] = product;
    } else {
        product.id = Date.now();
        db.products.unshift(product);
    }
    writeDB(db);
    res.json({ message: "Saqlandi!", product });
});

app.delete('/api/products/:id', (req, res) => {
    const db = readDB();
    db.products = db.products.filter(p => p.id != req.params.id);
    writeDB(db);
    res.json({ message: "O'chirildi" });
});

app.post('/api/orders', (req, res) => {
    const db = readDB();
    const orderData = req.body;
    let newOrder;
    
    if (orderData.id) {
        const index = db.orders.findIndex(o => o.id == orderData.id);
        if (index !== -1) {
            db.orders[index] = { ...db.orders[index], ...orderData };
            newOrder = db.orders[index];
        }
    } else {
        const orderId = Math.floor(100000 + Math.random() * 900000).toString();
        newOrder = { 
            id: orderId, 
            ...orderData, 
            date: new Date().toISOString(),
            status: 'pending'
        };
        db.orders.unshift(newOrder);
    }
    
    writeDB(db);
    res.json({ message: "Muvaffaqiyatli!", orderId: newOrder.id, orders: db.orders });
});

app.get('/api/orders', (req, res) => {
    const db = readDB();
    res.json(db.orders);
});

app.delete('/api/orders/:id', (req, res) => {
    const db = readDB();
    db.orders = db.orders.filter(o => o.id != req.params.id);
    writeDB(db);
    res.json({ message: "O'chirildi" });
});

app.listen(PORT, () => {
    console.log(`\n🚀 SERVER ISHGA TUSHDI!`);
    console.log(`🔗 Manzil: http://localhost:${PORT}`);
    console.log(`📂 Baza: ${DB_PATH}\n`);
});
