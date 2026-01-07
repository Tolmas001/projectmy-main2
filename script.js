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
    { id: 1, name: "Roadster Printed T-Shirt", price: 38.00, oldPrice: 48.00, category: "Casual Wear", image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500" },
    { id: 2, name: "Allen Solly Handheld Bag", price: 80.00, oldPrice: 100.00, category: "Western Wear", image: "https://images.unsplash.com/photo-1584917033904-47e120121300?w=500" },
    { id: 3, name: "Louis Philippe Sport T-Shirt", price: 50.00, oldPrice: 65.00, category: "Casual Wear", image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500" },
    { id: 4, name: "Adidas Running Shoes", price: 60.00, oldPrice: 75.00, category: "Kids Wear", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500" },
    { id: 5, name: "Trendyol Maxi Dress", price: 35.00, oldPrice: 45.00, category: "Ethnic Wear", image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500" },
    { id: 6, name: "YK Disney Printed Dress", price: 80.00, oldPrice: 100.00, category: "Kids Wear", image: "https://images.unsplash.com/photo-1621335829175-95f437384d7c?w=500" },
    { id: 7, name: "US Polo Casual Shirt", price: 40.00, oldPrice: 50.00, category: "Casual Wear", image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500" },
    { id: 8, name: "Zyla Women Sandals", price: 35.00, oldPrice: 40.00, category: "Western Wear", image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500" }
];

let cart = JSON.parse(localStorage.getItem('krist_cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('krist_wishlist')) || [];

// SweetAlert simulyatsiyasi
window.alert = (msg) => {
    Swal.fire({ text: msg, confirmButtonColor: '#131118', icon: 'success' });
};

// Wishlist Logic
window.toggleWishlist = (id) => {
    const index = wishlist.findIndex(p => p.id === id);
    if (index > -1) {
        wishlist.splice(index, 1);
        Swal.fire({ toast: true, position: 'top-end', icon: 'info', title: 'O\'chirildi', showConfirmButton: false, timer: 1500 });
    } else {
        const p = products.find(item => item.id === id);
        wishlist.push(p);
        Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Qo\'shildi', showConfirmButton: false, timer: 1500 });
    }
    updateWishCount();
    renderProducts(products); // UI ni yangilash
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

// Render
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

// Filters
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

window.filterByCategory = (cat) => {
    renderProducts(products.filter(p => p.category === cat));
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
};

// Cart
window.addToCart = (id) => {
    cart.push(products.find(p => p.id === id));
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

// Theme
function toggleTheme() {
    const theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    const icon = document.getElementById('themeIcon');
    if(icon) icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    const theme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);
    const icon = document.getElementById('themeIcon');
    if(icon) icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    
    renderProducts(products);
    updateCart();
    updateWishCount();

    const cartBtn = document.getElementById('cartBtn');
    const cartModal = document.getElementById('cartModal');
    if (cartBtn) cartBtn.onclick = () => cartModal.style.display = "block";
    const closeBtn = document.querySelector('.close');
    if (closeBtn) closeBtn.onclick = () => { cartModal.style.display = "none"; };
    window.onclick = (e) => { 
        if (e.target == cartModal) cartModal.style.display = "none";
        if (e.target == document.getElementById('wishlistModal')) e.target.style.display = "none";
    };
});
