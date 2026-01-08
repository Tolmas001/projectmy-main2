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
        allProducts = JSON.parse(localStorage.getItem('krist_products')) || [];
        filteredProducts = [...allProducts];
        renderPage(1);
    }
}

// 4. Mahsulotlarni chiqarish (Render)
function renderProducts(data) {
    const grid = document.getElementById('productGrid');
    if (!grid) return;
    grid.innerHTML = data.length === 0 ? '<div style="grid-column: 1/-1; text-align: center; padding: 50px;"><h3>Mahsulotlar topilmadi</h3></div>' : '';

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

// 5. SAVATCHA MANTIQI (DIQQAT!)
window.addToCart = (id) => {
    const p = allProducts.find(prod => prod.id.toString() === id.toString());
    if (p) {
        cart.push({...p, cartId: Date.now()}); // Har biriga unik ID beramiz
        updateCart();
        Swal.fire({
            toast: true, position: 'top-end', icon: 'success',
            title: 'Savatchaga qo\'shildi', showConfirmButton: false, timer: 1500
        });
    }
};

function updateCart() {
    // 1. Savatchadagi sonni yangilash
    const countEl = document.getElementById('cartCount');
    if (countEl) countEl.innerText = cart.length;
    
    // 2. Lokal saqlash
    localStorage.setItem('krist_cart', JSON.stringify(cart));
    
    // 3. Modal oynani yangilash
    const itemsDiv = document.getElementById('cartItems');
    const totalEl = document.getElementById('cartTotalSum');
    
    if (itemsDiv) {
        if (cart.length === 0) {
            itemsDiv.innerHTML = '<p style="text-align:center; padding:20px;">Savatchangiz bo\'sh.</p>';
        } else {
            itemsDiv.innerHTML = cart.map((p, i) => `
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; border-bottom:1px solid #eee; padding-bottom:8px;">
                    <div style="display:flex; align-items:center; gap:10px;">
                        <img src="${p.image}" style="width:40px; height:40px; object-fit:cover; border-radius:5px;">
                        <div>
                            <h5 style="font-size:13px; margin:0; color:var(--text-color);">${p.name}</h5>
                            <span style="font-size:12px; color:var(--primary-color);">$${parseFloat(p.price).toFixed(2)}</span>
                        </div>
                    </div>
                    <i class="fas fa-trash-alt" style="color:#ff4757; cursor:pointer; font-size:14px;" onclick="removeFromCart(${i})"></i>
                </div>`).join('');
        }
    }
    
    if (totalEl) {
        const sum = cart.reduce((total, p) => total + parseFloat(p.price), 0);
        totalEl.innerText = sum.toFixed(2);
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
        if (show) updateCart();
    }
};

// 6. Boshqa funksiyalar (Pagination, Search, etc.)
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
    if (!container || totalPages <= 1) { if(container) container.innerHTML=''; return; }
    container.innerHTML = '';
    for (let i = 1; i <= totalPages; i++) {
        container.innerHTML += `<button onclick="renderPage(${i})" style="padding:5px 12px; margin:0 2px; border:1px solid #ddd; background:${i === currentPage ? '#000' : '#fff'}; color:${i === currentPage ? '#fff' : '#000'}; cursor:pointer; border-radius:5px;">${i}</button>`;
    }
}

// Sahifa yuklanganda
document.addEventListener('DOMContentLoaded', () => {
    loadProductsFromServer();
    updateCart();
    // Mavzu va Til sozlamalari
    document.documentElement.setAttribute('data-theme', localStorage.getItem('theme') || 'light');
    const lang = localStorage.getItem('selectedLang') || 'uz';
    const langSelect = document.getElementById('langSelect');
    if (langSelect) langSelect.value = lang;
    
    window.onclick = (e) => {
        if (e.target.classList.contains('modal')) e.target.style.display = "none";
    };
});
