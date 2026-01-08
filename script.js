// script.js - Katalog va umumiy mantiq
let currentPage = 1;
const itemsPerPage = 12;
let allProducts = [];
let filteredProducts = [];

const API_URL = "http://localhost:3000/api";

// 1. Kirish tekshiruvi
function checkAuth() {
    const user = JSON.parse(localStorage.getItem('krist_user'));
    if (!user && !window.location.pathname.includes('register.html')) window.location.href = 'register.html';
}
checkAuth();

// 2. Ma'lumotlarni yuklash
async function loadProductsFromServer() {
    try {
        const res = await fetch(`${API_URL}/products`);
        allProducts = await res.json();
        localStorage.setItem('krist_products', JSON.stringify(allProducts));
        filteredProducts = [...allProducts];
        renderPage(1);
    } catch (err) {
        allProducts = JSON.parse(localStorage.getItem('krist_products')) || [];
        filteredProducts = [...allProducts];
        renderPage(1);
    }
}

function renderProducts(data) {
    const grid = document.getElementById('productGrid');
    if (!grid) return;
    grid.innerHTML = data.length === 0 ? '<div style="grid-column: 1/-1; text-align: center; padding: 50px;"><h3>Hech narsa topilmadi</h3></div>' : '';

    const wishlist = JSON.parse(localStorage.getItem('krist_wishlist')) || [];
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

// 3. Pagination & Filters
window.renderPage = (page) => {
    currentPage = page;
    const start = (page - 1) * itemsPerPage;
    renderProducts(filteredProducts.slice(start, start + itemsPerPage));
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const container = document.getElementById('pagination');
    if (container) {
        container.innerHTML = totalPages > 1 ? Array.from({length: totalPages}, (_, i) => `
            <button onclick="renderPage(${i+1})" style="padding:6px 14px; margin:0 3px; border:1px solid #ddd; background:${(i+1) === currentPage ? '#000' : '#fff'}; color:${(i+1) === currentPage ? '#fff' : '#000'}; border-radius:8px; cursor:pointer;">${i+1}</button>
        `).join('') : '';
    }
};

window.sortProducts = (type) => {
    if (type === 'low') filteredProducts.sort((a, b) => a.price - b.price);
    else if (type === 'high') filteredProducts.sort((a, b) => b.price - a.price);
    else if (type === 'new') filteredProducts.sort((a, b) => b.id.toString().localeCompare(a.id.toString()));
    renderPage(1);
};

window.filterByCategory = (cat) => {
    filteredProducts = allProducts.filter(p => p.category === cat);
    renderPage(1);
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
};

// 4. Wishlist
window.toggleWishlist = (id) => {
    let wishlist = JSON.parse(localStorage.getItem('krist_wishlist')) || [];
    const idx = wishlist.findIndex(p => p.id.toString() === id.toString());
    if (idx > -1) wishlist.splice(idx, 1);
    else wishlist.push(allProducts.find(item => item.id.toString() === id.toString()));
    localStorage.setItem('krist_wishlist', JSON.stringify(wishlist));
    document.getElementById('wishCount').innerText = wishlist.length;
    renderPage(currentPage);
};

// 5. Init
document.addEventListener('DOMContentLoaded', () => {
    loadProductsFromServer();
    document.documentElement.setAttribute('data-theme', localStorage.getItem('theme') || 'light');
    
    const sInput = document.getElementById('searchInput');
    if (sInput) {
        sInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            filteredProducts = allProducts.filter(p => p.name.toLowerCase().includes(term));
            renderPage(1);
        });
    }

    window.onclick = (e) => { if (e.target.classList.contains('modal')) e.target.style.display = "none"; };
});
