// Tizimga kirganlikni tekshirish
function checkAuth() {
    const user = JSON.parse(localStorage.getItem('krist_user'));
    const currentPage = window.location.pathname;
    if (!user && !currentPage.includes('register.html')) {
        window.location.href = 'register.html';
    }
}
checkAuth();

const translations = {
    uz: {
        "nav-home": "Bosh sahifa",
        "nav-shop": "Katalog",
        "nav-story": "Biz haqimizda",
        "nav-blog": "Maslahatlar",
        "nav-contact": "Aloqa",
        "hero-sub": "Tabiiy va Nafis",
        "hero-title": "Go'zallik siri sizning qo'lingizda",
        "hero-off": "HAMMA MAHSULOTLARGA -30%",
        "shop-now": "Sotib olish",
        "category-title": "Toifalar bo'yicha saralash",
        "bestseller-title": "Eng ko'p sotilganlar",
        "footer-info": "Ma'lumotlar",
        "footer-service": "Xizmatlar",
        "footer-subscribe": "Yangi mahsulotlardan xabardor bo'ling"
    },
    en: {
        "nav-home": "Home",
        "nav-shop": "Shop",
        "nav-story": "About Us",
        "nav-blog": "Beauty Blog",
        "nav-contact": "Contact Us",
        "hero-sub": "Natural & Elegant",
        "hero-title": "Unveil Your Natural Beauty",
        "hero-off": "UPTO 30% OFF ALL PRODUCTS",
        "shop-now": "Shop Now",
        "category-title": "Shop by Categories",
        "bestseller-title": "Our Bestsellers",
        "footer-info": "Information",
        "footer-service": "Service",
        "footer-subscribe": "Subscribe to Updates"
    },
    ru: {
        "nav-home": "Главная",
        "nav-shop": "Каталог",
        "nav-story": "О нас",
        "nav-blog": "Советы",
        "nav-contact": "Контакты",
        "hero-sub": "Натурально и Изящно",
        "hero-title": "Секрет красоты в ваших руках",
        "hero-off": "СКИДКА -30% НА ВСЁ",
        "shop-now": "Купить",
        "category-title": "Сортировка по категориям",
        "bestseller-title": "Хиты продаж",
        "footer-info": "Информация",
        "footer-service": "Услуги",
        "footer-subscribe": "Подпишитесь на новости"
    }
};

const productData = [
    { name: "Matte Lipstick", category: "Make Up", basePrice: 12, img: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d" },
    { name: "Vitamin C Serum", category: "Skin Care", basePrice: 35, img: "https://images.unsplash.com/photo-1599733594230-6b823276abcc" },
    { name: "Luxury Perfume", category: "Fragrances", basePrice: 75, img: "https://images.unsplash.com/photo-1541643600914-78b084683601" },
    { name: "Cleansing Gel", category: "Skin Care", basePrice: 20, img: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571" },
    { name: "Eyeshadow Palette", category: "Make Up", basePrice: 30, img: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796" },
    { name: "Hair Mask", category: "Hair Care", basePrice: 25, img: "https://images.unsplash.com/photo-1527799822340-304bc6475a6c" },
    { name: "Sunscreen SPF 50", category: "Skin Care", basePrice: 18, img: "https://images.unsplash.com/photo-1556229167-731913076839" },
    { name: "Moisturizing Cream", category: "Skin Care", basePrice: 28, img: "https://images.unsplash.com/photo-1552046122-03184de85e08" },
    { name: "Floral Cologne", category: "Fragrances", basePrice: 55, img: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539" },
    { name: "Shampoo Revive", category: "Hair Care", basePrice: 15, img: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d" },
    { name: "Foundation Glow", category: "Make Up", basePrice: 40, img: "https://images.unsplash.com/photo-1599733589046-9b8308b5b50d" },
    { name: "Eyeliner Black", category: "Make Up", basePrice: 10, img: "https://images.unsplash.com/photo-1625093742435-6fa192b6fb1a" },
    { name: "Night Repair Oil", category: "Skin Care", basePrice: 50, img: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19" },
    { name: "Body Mist Vanilla", category: "Fragrances", basePrice: 25, img: "https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc" },
    { name: "Conditioner Silk", category: "Hair Care", basePrice: 16, img: "https://images.unsplash.com/photo-1519735810594-4556ef79b5b6" }
];

const products = [];
for (let i = 1; i <= 150; i++) {
    const baseProduct = productData[(i - 1) % productData.length];
    const variation = Math.floor((i - 1) / productData.length) + 1;
    const price = baseProduct.basePrice + (i % 10);
    products.push({
        id: i,
        name: `${baseProduct.name} ${variation > 1 ? '#' + variation : ''}`,
        price: price,
        oldPrice: price + 10,
        category: baseProduct.category,
        image: `${baseProduct.img}?w=500&sig=${i}`
    });
}

let cart = JSON.parse(localStorage.getItem('krist_cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('krist_wishlist')) || [];

function setLanguage(lang) {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            el.innerText = translations[lang][key];
        }
    });
    localStorage.setItem('selectedLang', lang);
}

function renderProducts(data) {
    const grid = document.getElementById('productGrid');
    if (!grid) return;
    grid.innerHTML = '';
    data.forEach(p => {
        const isWished = wishlist.some(item => item.id === p.id);
        grid.innerHTML += `
            <div class="product-card-krist" data-aos="fade-up">
                <div class="img-container">
                    <img src="${p.image}" alt="${p.name}" onclick="window.location.href='product-detail.html?id=${p.id}'" style="cursor:pointer">
                    <div class="wishlist-btn" onclick="toggleWishlist(${p.id})" style="position:absolute; top:15px; right:15px; font-size:18px; color:${isWished ? 'red' : '#ccc'}; cursor:pointer; z-index:10;">
                        <i class="${isWished ? 'fas' : 'far'} fa-heart"></i>
                    </div>
                    <div class="add-to-cart-overlay" onclick="addToCart(${p.id})">Add to Cart</div>
                </div>
                <div class="product-info-krist">
                    <h4>${p.name}</h4>
                    <p>$${p.price.toFixed(2)}</p>
                </div>
            </div>
        `;
    });
}

window.toggleWishlist = (id) => {
    const index = wishlist.findIndex(p => p.id === id);
    if (index > -1) {
        wishlist.splice(index, 1);
        Swal.fire({ toast: true, position: 'top-end', icon: 'info', title: 'O\'chirildi', showConfirmButton: false, timer: 1500 });
    } else {
        const p = products.find(item => item.id === id);
        if(p) wishlist.push(p);
        Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Qo\'shildi', showConfirmButton: false, timer: 1500 });
    }
    updateWishCount();
    const currentSearch = document.getElementById('searchInput')?.value || "";
    if(currentSearch) {
        renderProducts(products.filter(p => p.name.toLowerCase().includes(currentSearch.toLowerCase())));
    } else {
        renderProducts(products);
    }
};

function updateWishCount() {
    const el = document.getElementById('wishCount');
    if (el) el.innerText = wishlist.length;
    localStorage.setItem('krist_wishlist', JSON.stringify(wishlist));
}

window.showWishlist = () => {
    const modal = document.getElementById('wishlistModal');
    const itemsDiv = document.getElementById('wishlistItems');
    if(!modal) return;
    modal.style.display = "block";
    itemsDiv.innerHTML = wishlist.length === 0 ? '<p style="text-align:center;">Saralanganlar bo\'sh.</p>' : 
        wishlist.map(p => `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; border-bottom:1px solid #eee; padding-bottom:5px;">
                <span>${p.name}</span>
                <i class="fas fa-trash" style="color:red; cursor:pointer;" onclick="toggleWishlist(${p.id}); showWishlist();"></i>
            </div>
        `).join('');
};

window.closeWishlist = () => { document.getElementById('wishlistModal').style.display = "none"; };

window.filterByCategory = (cat) => {
    renderProducts(products.filter(p => p.category === cat));
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
};

window.addToCart = (id) => {
    const p = products.find(prod => prod.id === id);
    if(p) cart.push(p);
    updateCart();
    Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Savatchaga qo\'shildi', showConfirmButton: false, timer: 1500 });
};

function updateCart() {
    const count = document.getElementById('cartCount');
    if (count) count.innerText = cart.length;
    localStorage.setItem('krist_cart', JSON.stringify(cart));
    const itemsDiv = document.getElementById('cartItems');
    if (itemsDiv) {
        itemsDiv.innerHTML = cart.map((p, i) => `
            <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                <span>${p.name}</span>
                <span>$${p.price.toFixed(2)} <i class="fas fa-trash" style="color:red; cursor:pointer;" onclick="removeFromCart(${i})"></i></span>
            </div>
        `).join('');
        document.getElementById('cartTotalSum').innerText = cart.reduce((s, p) => s + p.price, 0).toFixed(2);
    }
}

window.removeFromCart = (i) => { cart.splice(i, 1); updateCart(); };

function toggleTheme() {
    const theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    const icon = document.getElementById('themeIcon');
    if(icon) icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

window.toggleCartModal = (show) => {
    const modal = document.getElementById('cartModal');
    if (modal) modal.style.display = show ? "block" : "none";
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

    renderProducts(products);
    updateCart();
    updateWishCount();

    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.addEventListener('input', (e) => {
        const filtered = products.filter(p => p.name.toLowerCase().includes(e.target.value.toLowerCase()));
        renderProducts(filtered);
    });

    const priceFilter = document.getElementById('priceFilter');
    if (priceFilter) priceFilter.addEventListener('change', (e) => {
        let filtered = products;
        if (e.target.value === '0-50') filtered = products.filter(p => p.price <= 50);
        else if (e.target.value === '51-100') filtered = products.filter(p => p.price > 50 && p.price <= 100);
        else if (e.target.value === '101+') filtered = products.filter(p => p.price > 100);
        renderProducts(filtered);
    });

    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.querySelector('i').classList.toggle('fa-bars');
            hamburger.querySelector('i').classList.toggle('fa-times');
        });
    }

    window.onclick = (e) => { 
        if (e.target == document.getElementById('cartModal')) toggleCartModal(false);
        if (e.target == document.getElementById('wishlistModal')) closeWishlist();
    };
});
