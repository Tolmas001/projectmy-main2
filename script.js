// 1. Pagination va Qidiruv o'zgaruvchilari
let currentPage = 1;
const itemsPerPage = 12;

// Tizimga kirganlikni tekshirish
function checkAuth() {
    const user = JSON.parse(localStorage.getItem('krist_user'));
    const path = window.location.pathname;
    if (!user && !path.includes('register.html')) window.location.href = 'register.html';
}
checkAuth();

const API_URL = "http://localhost:3000/api";

const translations = {
    uz: {
        "nav-home": "Bosh sahifa", "nav-shop": "Katalog", "nav-story": "Biz haqimizda", "nav-blog": "Maslahatlar", "nav-contact": "Aloqa",
        "hero-sub": "Tabiiy va Nafis", "hero-title": "Go'zallik siri sizning qo'lingizda", "hero-off": "HAMMA MAHSULOTLARGA -30%",
        "shop-now": "Sotib olish", "category-title": "Toifalar bo'yicha saralash", "bestseller-title": "Eng ko'p sotilganlar",
        "footer-info": "Ma'lumotlar", "footer-service": "Xizmatlar", "footer-subscribe": "Yangi mahsulotlardan xabardor bo'ling",
        "sort-title": "Saralash", "sort-low": "Arzonroq", "sort-high": "Qimmatroq", "sort-new": "Yangi qo'shilganlar"
    },
    en: {
        "nav-home": "Home", "nav-shop": "Shop", "nav-story": "About Us", "nav-blog": "Beauty Blog", "nav-contact": "Contact Us",
        "hero-sub": "Natural & Elegant", "hero-title": "Unveil Your Natural Beauty", "hero-off": "UPTO 30% OFF ALL PRODUCTS",
        "shop-now": "Shop Now", "category-title": "Shop by Categories", "bestseller-title": "Our Bestsellers",
        "footer-info": "Information", "footer-service": "Service", "footer-subscribe": "Subscribe to Updates",
        "sort-title": "Sort by", "sort-low": "Price: Low to High", "sort-high": "Price: High to Low", "sort-new": "Newest First"
    },
    ru: {
        "nav-home": "Главная", "nav-shop": "Каталог", "nav-story": "О нас", "nav-blog": "Советы", "nav-contact": "Контакты",
        "hero-sub": "Натурально и Изящно", "hero-title": "Секрет красоты в ваших руках", "hero-off": "СКИДКА -30% НА ВСЁ",
        "shop-now": "Купить", "category-title": "Сортировка по категориям", "bestseller-title": "Хиты продаж",
        "footer-info": "Информация", "footer-service": "Услуги", "footer-subscribe": "Подпишитесь на новости",
        "sort-title": "Сортировка", "sort-low": "Сначала дешевле", "sort-high": "Сначала дороже", "sort-new": "Новинки"
    }
};

let allProducts = [];
let filteredProducts = [];
let cart = JSON.parse(localStorage.getItem('krist_cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('krist_wishlist')) || [];

async function loadProductsFromServer() {
    try {
        const res = await fetch(`${API_URL}/products`);
        if (!res.ok) throw new Error("Server xatosi");
        allProducts = await res.json();
        filteredProducts = [...allProducts];
        renderPage(1);
    } catch (err) {
        console.error("Server xatosi!", err);
        // Zaxira: LocalStorage'dan o'qish (agar server o'chiq bo'lsa)
        allProducts = JSON.parse(localStorage.getItem('krist_products')) || [];
        filteredProducts = [...allProducts];
        renderPage(1);
    }
}

function renderProducts(data) {
    const grid = document.getElementById('productGrid');
    if (!grid) return;
    grid.innerHTML = data.length === 0 ? '<div style="grid-column: 1/-1; text-align: center; padding: 50px;"><h3>Hech narsa topilmadi</h3></div>' : '';

    data.forEach(p => {
        const isWished = wishlist.some(item => item.id.toString() === p.id.toString());
        grid.innerHTML += `
            <div class="product-card-krist" data-aos="fade-up">
                <div class="img-container">
                    <img src="${p.image}" alt="${p.name}" onclick="window.location.href='product-detail.html?id=${p.id}'" style="cursor:pointer">
                    <div class="wishlist-btn" onclick="toggleWishlist('${p.id}')" style="position:absolute; top:15px; right:15px; font-size:18px; color:${isWished ? 'red' : '#ccc'}; cursor:pointer; z-index:10;">
                        <i class="${isWished ? 'fas' : 'far'} fa-heart"></i>
                    </div>
                    <div class="add-to-cart-overlay" onclick="addToCart('${p.id}')">Add to Cart</div>
                </div>
                <div class="product-info-krist">
                    <h4 onclick="window.location.href='product-detail.html?id=${p.id}'" style="cursor:pointer">${p.name}</h4>
                    <p>$${p.price.toFixed(2)}</p>
                </div>
            </div>`;
    });
}

window.renderPage = (page) => {
    currentPage = page;
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    renderProducts(filteredProducts.slice(start, end));
    renderPagination();
};

function renderPagination() {
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const container = document.getElementById('pagination');
    if (!container) return;
    container.innerHTML = '';
    if (totalPages <= 1) return;
    for (let i = 1; i <= totalPages; i++) {
        container.innerHTML += `<button onclick="renderPage(${i})" style="padding:5px 12px; margin:0 2px; border:1px solid #ddd; background:${i === currentPage ? '#000' : '#fff'}; color:${i === currentPage ? '#fff' : '#000'}; cursor:pointer; border-radius:5px;">${i}</button>`;
    }
}

window.sortProducts = (type) => {
    if (type === 'low') filteredProducts.sort((a, b) => a.price - b.price);
    else if (type === 'high') filteredProducts.sort((a, b) => b.price - a.price);
    else if (type === 'new') filteredProducts.sort((a, b) => b.id.toString().localeCompare(a.id.toString()));
    renderPage(1);
};

window.toggleWishlist = (id) => {
    const idx = wishlist.findIndex(p => p.id.toString() === id.toString());
    if (idx > -1) {
        wishlist.splice(idx, 1);
        Swal.fire({ toast: true, position: 'top-end', icon: 'info', title: 'O\'chirildi', showConfirmButton: false, timer: 1500 });
    } else {
        const prod = allProducts.find(item => item.id.toString() === id.toString());
        if (prod) wishlist.push(prod);
        Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Saralanganlarga qo\'shildi', showConfirmButton: false, timer: 1500 });
    }
    updateWishCount();
    renderPage(currentPage);
};

function updateWishCount() {
    const el = document.getElementById('wishCount');
    if (el) el.innerText = wishlist.length;
    localStorage.setItem('krist_wishlist', JSON.stringify(wishlist));
}

window.showWishlist = () => {
    const modal = document.getElementById('wishlistModal');
    const itemsDiv = document.getElementById('wishlistItems');
    if (!modal) return;
    modal.style.display = "block";
    itemsDiv.innerHTML = wishlist.length === 0 ? '<p style="text-align:center;">Bo\'sh</p>' : 
        wishlist.map(p => `<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; border-bottom:1px solid #eee; padding-bottom:5px;"><span>${p.name}</span><i class="fas fa-trash" style="color:red; cursor:pointer;" onclick="toggleWishlist('${p.id}'); showWishlist();"></i></div>`).join('');
};

window.closeWishlist = () => { document.getElementById('wishlistModal').style.display = "none"; };

window.filterByCategory = (cat) => {
    filteredProducts = allProducts.filter(p => p.category === cat);
    renderPage(1);
    const prodSection = document.getElementById('products');
    if(prodSection) prodSection.scrollIntoView({ behavior: 'smooth' });
};

window.addToCart = (id) => {
    const p = allProducts.find(prod => prod.id.toString() === id.toString());
    if (p) {
        cart.push({...p, cartId: Date.now()}); // Noyob cartId qo'shamiz o'chirish oson bo'lishi uchun
        updateCart();
        Swal.fire({ 
            toast: true, 
            position: 'top-end', 
            icon: 'success', 
            title: 'Savatchaga qo\'shildi', 
            showConfirmButton: false, 
            timer: 1500 
        });
    } else {
        console.error("Mahsulot topilmadi: ID", id);
    }
};

function updateCart() {
    const countEl = document.getElementById('cartCount');
    if (countEl) countEl.innerText = cart.length;
    localStorage.setItem('krist_cart', JSON.stringify(cart));
    
    const itemsDiv = document.getElementById('cartItems');
    if (itemsDiv) {
        if (cart.length === 0) {
            itemsDiv.innerHTML = '<p style="text-align:center; padding:20px;">Savatchangiz bo\'sh.</p>';
        } else {
            itemsDiv.innerHTML = cart.map((p, i) => `
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; border-bottom:1px solid #eee; padding-bottom:8px;">
                    <div style="display:flex; align-items:center; gap:10px;">
                        <img src="${p.image}" style="width:40px; height:40px; object-fit:cover; border-radius:5px;">
                        <div>
                            <h5 style="font-size:13px; margin:0;">${p.name}</h5>
                            <span style="font-size:12px; color:var(--primary-color);">$${p.price.toFixed(2)}</span>
                        </div>
                    </div>
                    <i class="fas fa-times" style="color:#ccc; cursor:pointer;" onclick="removeFromCart(${i})"></i>
                </div>`).join('');
        }
        const totalSumEl = document.getElementById('cartTotalSum');
        if (totalSumEl) totalSumEl.innerText = cart.reduce((s, p) => s + p.price, 0).toFixed(2);
    }
}

window.removeFromCart = (i) => {
    cart.splice(i, 1);
    updateCart();
};

function setLanguage(lang) {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang]?.[key]) el.innerText = translations[lang][key];
    });
    localStorage.setItem('selectedLang', lang);
}

function toggleTheme() {
    const theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    const icon = document.getElementById('themeIcon');
    if(icon) icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

window.toggleCartModal = (show) => {
    const modal = document.getElementById('cartModal');
    if (modal) {
        modal.style.display = show ? "block" : "none";
        if(show) updateCart();
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const theme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);
    const themeIcon = document.getElementById('themeIcon');
    if(themeIcon) themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    
    const savedLang = localStorage.getItem('selectedLang') || 'en';
    const langSelect = document.getElementById('langSelect');
    if (langSelect) {
        langSelect.value = savedLang;
        langSelect.addEventListener('change', (e) => setLanguage(e.target.value));
    }
    setLanguage(savedLang);

    loadProductsFromServer();
    updateCart();
    updateWishCount();

    // Smart Search input
    const sInput = document.getElementById('searchInput');
    const autoDiv = document.getElementById('searchAutocomplete');
    if (sInput) {
        sInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            filteredProducts = allProducts.filter(p => p.name.toLowerCase().includes(term));
            renderPage(1);
            if (term.length > 0) {
                const matches = allProducts.filter(p => p.name.toLowerCase().includes(term)).slice(0, 5);
                if (autoDiv) {
                    autoDiv.style.display = matches.length ? 'block' : 'none';
                    autoDiv.innerHTML = matches.map(p => `
                        <div onclick="window.location.href='product-detail.html?id=${p.id}'" style="display:flex; align-items:center; gap:10px; padding:10px; cursor:pointer; border-bottom:1px solid #eee;">
                            <img src="${p.image}" style="width:30px; height:30px; object-fit:cover; border-radius:3px;">
                            <span style="font-size:12px; color:var(--text-color);">${p.name}</span>
                        </div>`).join('');
                }
            } else if(autoDiv) { autoDiv.style.display = 'none'; }
        });
    }

    const priceF = document.getElementById('priceFilter');
    if (priceF) {
        priceF.addEventListener('change', (e) => {
            const val = e.target.value;
            if (val === 'all') filteredProducts = [...allProducts];
            else if (val === '0-50') filteredProducts = allProducts.filter(p => p.price <= 50);
            else if (val === '51-100') filteredProducts = allProducts.filter(p => p.price > 50 && p.price <= 100);
            else if (val === '101+') filteredProducts = allProducts.filter(p => p.price > 100);
            renderPage(1);
        });
    }

    const burger = document.getElementById('hamburger');
    if (burger) {
        burger.addEventListener('click', () => {
            const nav = document.getElementById('navMenu');
            if(nav) nav.classList.toggle('active');
            burger.querySelector('i').classList.toggle('fa-bars');
            burger.querySelector('i').classList.toggle('fa-times');
        });
    }

    window.onclick = (e) => { 
        if (e.target.classList.contains('modal')) {
            e.target.style.display = "none";
        }
    };
});
