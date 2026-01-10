// cart.js - Savatcha tizimi
if (!localStorage.getItem('krist_cart')) localStorage.setItem('krist_cart', JSON.stringify([]));

function getCart() { return JSON.parse(localStorage.getItem('krist_cart')) || []; }
function saveCart(cart) { 
    localStorage.setItem('krist_cart', JSON.stringify(cart)); 
    window.updateCartCount();
}

window.updateCartCount = () => {
    const countEl = document.getElementById('cartCount');
    const currentCart = getCart();
    if (countEl) countEl.innerText = currentCart.length;
};

window.addToCart = (productId) => {
    // Bazadagi barcha mahsulotlarni olamiz
    const allProducts = JSON.parse(localStorage.getItem('krist_products')) || [];
    const product = allProducts.find(p => p.id.toString() === productId.toString());

    if (product) {
        let cart = getCart();
        cart.push({ ...product, cartId: Date.now() });
        saveCart(cart);
        
        if (window.Swal) {
            Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Savatchaga qo\'shildi!', showConfirmButton: false, timer: 1500 });
        }
        if (document.getElementById('cartModal')?.style.display === "block") renderCartModal();
    }
};

window.removeFromCart = (index) => {
    let cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
    renderCartModal();
};

window.renderCartModal = () => {
    const itemsDiv = document.getElementById('cartItems');
    const totalEl = document.getElementById('cartTotalSum');
    if (!itemsDiv) return;

    const cart = getCart();
    if (cart.length === 0) {
        itemsDiv.innerHTML = '<p style="text-align:center; padding:20px;">Savatchangiz bo\'sh.</p>';
        if (totalEl) totalEl.innerText = "0";
        return;
    }

    itemsDiv.innerHTML = cart.map((item, i) => `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; border-bottom:1px solid #eee; padding-bottom:8px;">
            <div style="display:flex; align-items:center; gap:10px;">
                <img src="${item.image}" style="width:40px; height:40px; object-fit:cover; border-radius:5px;">
                <div>
                    <h5 style="margin:0; font-size:13px; color:var(--text-color);">${item.name}</h5>
                    <span style="font-size:12px; color:var(--primary-color);">${new Intl.NumberFormat('uz-UZ').format(item.price)} so'm</span>
                </div>
            </div>
            <i class="fas fa-times" style="color:#ccc; cursor:pointer;" onclick="removeFromCart(${i})"></i>
        </div>`).join('');

    const total = cart.reduce((s, p) => s + parseFloat(p.price), 0);
    if (totalEl) totalEl.innerText = new Intl.NumberFormat('uz-UZ').format(total);
};

window.toggleCartModal = (show) => {
    const modal = document.getElementById('cartModal');
    if (modal) {
        modal.style.display = show ? "block" : "none";
        if (show) renderCartModal();
    }
};

document.addEventListener('DOMContentLoaded', () => {
    window.updateCartCount();
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('cartModal');
        if (e.target === modal) toggleCartModal(false);
    });
});
