const translations = {
    uz: {
        "nav-home": "Bosh sahifa",
        "nav-shop": "Do'kon",
        "nav-story": "Biz haqimizda",
        "nav-blog": "Blog",
        "nav-contact": "Aloqa",
        "hero-sub": "Klassik Eksklyuziv",
        "hero-title": "Ayollar To'plami",
        "hero-off": "40% GACHA CHEGIRMA",
        "shop-now": "Sotib olish",
        "category-title": "Kategoriyalar",
        "bestseller-title": "Eng ko'p sotilganlar",
        "footer-info": "Ma'lumotlar",
        "footer-service": "Xizmatlar",
        "footer-subscribe": "Obuna bo'ling"
    },
    en: {
        "nav-home": "Home",
        "nav-shop": "Shop",
        "nav-story": "Our Story",
        "nav-blog": "Blog",
        "nav-contact": "Contact Us",
        "hero-sub": "Classic Exclusive",
        "hero-title": "Women's Collection",
        "hero-off": "UPTO 40% OFF",
        "shop-now": "Shop Now",
        "category-title": "Shop by Categories",
        "bestseller-title": "Our Bestseller",
        "footer-info": "Information",
        "footer-service": "Service",
        "footer-subscribe": "Subscribe"
    }
};

const products = [
    { id: 1, name: "Roadster Printed T-Shirt", price: 38.00, oldPrice: 48.00, image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500" },
    { id: 2, name: "Allen Solly Handheld Bag", price: 80.00, oldPrice: 100.00, image: "https://images.unsplash.com/photo-1584917033904-47e120121300?w=500" },
    { id: 3, name: "Louis Philippe Sport T-Shirt", price: 50.00, oldPrice: 65.00, image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500" },
    { id: 4, name: "Adidas Running Shoes", price: 60.00, oldPrice: 75.00, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500" },
    { id: 5, name: "Trendyol Maxi Dress", price: 35.00, oldPrice: 45.00, image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500" },
    { id: 6, name: "YK Disney Printed Dress", price: 80.00, oldPrice: 100.00, image: "https://images.unsplash.com/photo-1621335829175-95f437384d7c?w=500" },
    { id: 7, name: "US Polo Casual Shirt", price: 40.00, oldPrice: 50.00, image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500" },
    { id: 8, name: "Zyla Women Sandals", price: 35.00, oldPrice: 40.00, image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500" }
];

let cart = JSON.parse(localStorage.getItem('krist_cart')) || [];

// Tilni o'zgartirish
const langSelect = document.getElementById('langSelect');
if (langSelect) {
    langSelect.addEventListener('change', (e) => setLanguage(e.target.value));
}

function setLanguage(lang) {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) el.innerText = translations[lang][key];
    });
    localStorage.setItem('selectedLang', lang);
}

// Qidiruv va Filtr
const searchInput = document.getElementById('searchInput');
const priceFilter = document.getElementById('priceFilter');

if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = products.filter(p => p.name.toLowerCase().includes(term));
        renderProducts(filtered);
    });
}

if (priceFilter) {
    priceFilter.addEventListener('change', (e) => {
        const val = e.target.value;
        let filtered = products;
        if (val === '0-50') filtered = products.filter(p => p.price <= 50);
        else if (val === '51-100') filtered = products.filter(p => p.price > 50 && p.price <= 100);
        else if (val === '101+') filtered = products.filter(p => p.price > 100);
        renderProducts(filtered);
    });
}

function renderProducts(data) {
    const productGrid = document.getElementById('productGrid');
    if (!productGrid) return;
    productGrid.innerHTML = '';
    data.forEach(p => {
        productGrid.innerHTML += `
            <div class="product-card-krist">
                <div class="img-container">
                    <img src="${p.image}" alt="${p.name}" onclick="window.location.href='product-detail.html?id=${p.id}'" style="cursor:pointer">
                    <div class="add-to-cart-overlay" onclick="addToCart(${p.id})">Add to Cart</div>
                </div>
                <div class="product-info-krist" onclick="window.location.href='product-detail.html?id=${p.id}'" style="cursor:pointer">
                    <h4>${p.name}</h4>
                    <p>$${p.price.toFixed(2)}</p>
                </div>
            </div>
        `;
    });
}

window.addToCart = (id) => {
    const p = products.find(item => item.id === id);
    cart.push(p);
    updateCart();
    alert("Savatchaga qo'shildi!");
};

function updateCart() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) cartCount.innerText = cart.length;
    localStorage.setItem('krist_cart', JSON.stringify(cart));
    
    const itemsDiv = document.getElementById('cartItems');
    if (itemsDiv) {
        itemsDiv.innerHTML = cart.map((i, index) => `
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span>${i.name}</span>
                <span>$${i.price.toFixed(2)} <i class="fas fa-trash" style="margin-left: 10px; cursor: pointer; color: red;" onclick="removeFromCart(${index})"></i></span>
            </div>
        `).join('');
        const total = cart.reduce((sum, i) => sum + i.price, 0);
        const totalSumEl = document.getElementById('cartTotalSum');
        if (totalSumEl) totalSumEl.innerText = total.toFixed(2);
    }
}

window.removeFromCart = (index) => {
    cart.splice(index, 1);
    updateCart();
};

document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('selectedLang') || 'en';
    if (langSelect) langSelect.value = savedLang;
    setLanguage(savedLang);
    renderProducts(products);
    updateCart();
    
    const cartBtn = document.getElementById('cartBtn');
    const cartModal = document.getElementById('cartModal');
    const closeBtn = document.querySelector('.close');
    
    if (cartBtn) cartBtn.onclick = () => cartModal.style.display = "block";
    if (closeBtn) closeBtn.onclick = () => cartModal.style.display = "none";
    window.onclick = (e) => { if (e.target == cartModal) cartModal.style.display = "none"; };
});
