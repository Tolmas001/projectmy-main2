// 1. O'zgaruvchilar
let currentPage = 1;
const itemsPerPage = 12;
let allProducts = [];
let filteredProducts = [];
let cart = JSON.parse(localStorage.getItem('krist_cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('krist_wishlist')) || [];

const API_URL = "http://localhost:3000/api";

// 2. Kirishni tekshirish
function checkAuth() {
    const user = JSON.parse(localStorage.getItem('krist_user'));
    if (!user && !window.location.pathname.includes('register.html')) {
        window.location.href = 'register.html';
    }
}
checkAuth();

// 3. Ma'lumotlarni yuklash
async function loadProductsFromServer() {
    try {
        const res = await fetch(`${API_URL}/products`);
        if (!res.ok) throw new Error();
        allProducts = await res.json();
        localStorage.setItem('krist_products', JSON.stringify(allProducts));
        filteredProducts = [...allProducts];
        renderPage(1);
    } catch (err) {
        console.warn("Server xatosi, keshdan o'qiladi.");
        allProducts = JSON.parse(localStorage.getItem('krist_products')) || [];
        filteredProducts = [...allProducts];
        renderPage(1);
    }
}

// 4. Mahsulotlarni chiqarish
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
                    <p>$${parseFloat(p.price).toFixed(2)}</p>
                </div>
            </div>`;
    });
}

// 5. SAVATCHA (Eng muhim qism)
window.addToCart = (id) => {
    // 1. Mahsulotni topamiz
    const p = allProducts.find(prod => prod.id.toString() === id.toString());
    
    if (p) {
        // 2. Savatchaga qo'shamiz
        cart.push({...p, uniqueKey: Date.now()});
        
        // 3. Bazani va UI ni yangilaymiz
        updateCart();
        
        // 4. Xabar chiqaramiz
        Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Savatchaga qo\'shildi!',
            showConfirmButton: false,
            timer: 1500
        });
    } else {
        console.error("Mahsulot topilmadi: ID", id);
    }
};

function updateCart() {
    // LocalStorage-ga saqlash
    localStorage.setItem('krist_cart', JSON.stringify(cart));
    
    // Savatchadagi sonni yangilash (Header)
    const countEl = document.getElementById('cartCount');
    if (countEl) countEl.innerText = cart.length;
    
    // Modal ichidagi ro'yxatni yangilash
    const itemsDiv = document.getElementById('cartItems');
    const totalEl = document.getElementById('cartTotalSum');
    
    if (itemsDiv) {
        if (cart.length === 0) {
            itemsDiv.innerHTML = '<p style="text-align:center; padding:20px; color:#888;">Savatchangiz bo\'sh.</p>';
        } else {
            itemsDiv.innerHTML = cart.map((item, index) => `
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; border-bottom:1px solid #eee; padding-bottom:10px;">
                    <div style="display:flex; align-items:center; gap:12px;">
                        <img src="${item.image}" style="width:45px; height:45px; object-fit:cover; border-radius:8px;">
                        <div>
                            <h5 style="margin:0; font-size:13px; color:var(--text-color);">${item.name}</h5>
                            <span style="font-size:12px; color:var(--primary-color);">$${parseFloat(item.price).toFixed(2)}</span>
                        </div>
                    </div>
                    <i class="fas fa-trash-alt" style="color:#ff4757; cursor:pointer; font-size:14px;" onclick="removeFromCart(${index})"></i>
                </div>
            `).join('');
        }
    }
    
    if (totalEl) {
        const total = cart.reduce((sum, item) => sum + parseFloat(item.price), 0);
        totalEl.innerText = total.toFixed(2);
    }
}

window.removeFromCart = (index) => {
    cart.splice(index, 1);
    updateCart();
};

window.toggleCartModal = (show) => {
    const modal = document.getElementById('cartModal');
    if (modal) {
        modal.style.display = show ? "block" : "none";
        if (show) updateCart(); // Oynani ochganda har doim yangilash
    }
};

// 6. Pagination va boshqalar
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
        container.innerHTML += `<button onclick="renderPage(${i})" style="padding:6px 14px; margin:0 3px; border:1px solid #ddd; background:${i === currentPage ? 'var(--black)' : 'white'}; color:${i === currentPage ? 'white' : 'var(--text-color)'}; border-radius:8px; cursor:pointer;">${i}</button>`;
    }
}

// 7. Til va Mavzu
function setLanguage(lang) {
    const translations = {
        uz: { "nav-home": "Bosh sahifa", "nav-shop": "Katalog", "bestseller-title": "Eng ko'p sotilganlar" },
        en: { "nav-home": "Home", "nav-shop": "Shop", "bestseller-title": "Our Bestsellers" },
        ru: { "nav-home": "Главная", "nav-shop": "Каталог", "bestseller-title": "Хиты продаж" }
    };
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) el.innerText = translations[lang][key];
    });
    localStorage.setItem('selectedLang', lang);
}

document.addEventListener('DOMContentLoaded', () => {
    loadProductsFromServer();
    updateCart();
    
    // Mavzu
    const theme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);
    if(document.getElementById('themeIcon')) document.getElementById('themeIcon').className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';

    // Til
    const lang = localStorage.getItem('selectedLang') || 'uz';
    setLanguage(lang);
    
    window.onclick = (e) => {
        if (e.target.classList.contains('modal')) e.target.style.display = "none";
    };
});
