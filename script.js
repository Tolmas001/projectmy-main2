// 1. O'zgaruvchilar
let currentPage = 1;
const itemsPerPage = 12;
let allProducts = [];
let filteredProducts = [];

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
        console.warn("Server ulanmadi, kesh ishlatiladi.");
        allProducts = JSON.parse(localStorage.getItem('krist_products')) || [];
        filteredProducts = [...allProducts];
        renderPage(1);
    }
}

// 4. Mahsulotlarni chiqarish
function renderProducts(data) {
    const grid = document.getElementById('productGrid');
    if (!grid) return;
    grid.innerHTML = data.length === 0 ? '<div style="grid-column: 1/-1; text-align: center; padding: 50px;"><h3>Mahsulotlar topilmadi</h3></div>' : '';

    data.forEach(p => {
        const wishlist = JSON.parse(localStorage.getItem('krist_wishlist')) || [];
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

// 5. Pagination
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
        container.innerHTML += `<button onclick="renderPage(${i})" style="padding:6px 14px; margin:0 3px; border:1px solid #ddd; background:${i === currentPage ? '#000' : '#fff'}; color:${i === currentPage ? '#fff' : '#000'}; border-radius:8px; cursor:pointer;">${i}</button>`;
    }
}

// 6. Qidiruv va Saralash
document.addEventListener('DOMContentLoaded', () => {
    loadProductsFromServer();
    
    // Headerdagi qidiruv
    const sInput = document.getElementById('searchInput');
    if (sInput) {
        sInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            filteredProducts = allProducts.filter(p => p.name.toLowerCase().includes(term));
            renderPage(1);
        });
    }

    // Mavzu
    const theme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);
    if(document.getElementById('themeIcon')) document.getElementById('themeIcon').className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';

    // Savatcha hisobini yangilab qo'yamiz (agar cart.js yuklangan bo'lsa)
    if (window.updateCartCount) window.updateCartCount();
});

// Wishlist
window.toggleWishlist = (id) => {
    let wishlist = JSON.parse(localStorage.getItem('krist_wishlist')) || [];
    const idx = wishlist.findIndex(p => p.id.toString() === id.toString());
    if (idx > -1) {
        wishlist.splice(idx, 1);
    } else {
        const prod = allProducts.find(item => item.id.toString() === id.toString());
        if (prod) wishlist.push(prod);
    }
    localStorage.setItem('krist_wishlist', JSON.stringify(wishlist));
    if(window.updateWishCount) window.updateWishCount();
    renderPage(currentPage);
};
