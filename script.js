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

let cart = [];

const productGrid = document.getElementById('productGrid');
const cartCount = document.getElementById('cartCount');
const cartBtn = document.getElementById('cartBtn');
const cartModal = document.getElementById('cartModal');
const closeBtn = document.querySelector('.close');

if (productGrid) {
    products.forEach(p => {
        productGrid.innerHTML += `
            <div class="product-card-krist">
                <div class="img-container">
                    <img src="${p.image}" alt="${p.name}">
                    <div class="add-to-cart-overlay" onclick="addToCart(${p.id})">Add to Cart</div>
                </div>
                <div class="product-info-krist">
                    <h4>${p.name}</h4>
                    <p>$${p.price.toFixed(2)} <span style="text-decoration: line-through; color: #999; font-size: 0.8em; margin-left: 10px;">$${p.oldPrice.toFixed(2)}</span></p>
                </div>
            </div>
        `;
    });
}

window.addToCart = (id) => {
    const p = products.find(item => item.id === id);
    cart.push(p);
    updateCart();
};

function updateCart() {
    cartCount.innerText = cart.length;
    const itemsDiv = document.getElementById('cartItems');
    if (itemsDiv) {
        itemsDiv.innerHTML = cart.map((i, index) => `
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span>${i.name}</span>
                <span>$${i.price.toFixed(2)} <i class="fas fa-trash" style="margin-left: 10px; cursor: pointer; color: red;" onclick="removeFromCart(${index})"></i></span>
            </div>
        `).join('');
        const total = cart.reduce((sum, i) => sum + i.price, 0);
        document.getElementById('cartTotalSum').innerText = total.toFixed(2);
    }
}

window.removeFromCart = (index) => {
    cart.splice(index, 1);
    updateCart();
};

if (cartBtn) {
    cartBtn.onclick = () => cartModal.style.display = "block";
}
if (closeBtn) {
    closeBtn.onclick = () => cartModal.style.display = "none";
}
window.onclick = (e) => { if (e.target == cartModal) cartModal.style.display = "none"; };
