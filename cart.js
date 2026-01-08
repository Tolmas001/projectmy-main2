// cart.js - Savatcha tizimi uchun alohida mantiq
let cart = JSON.parse(localStorage.getItem('krist_cart')) || [];

// 1. Savatchaga qo'shish funksiyasi
window.addToCart = (productId) => {
    // Bazadagi barcha mahsulotlarni olamiz
    const allProducts = JSON.parse(localStorage.getItem('krist_products')) || [];
    const product = allProducts.find(p => p.id.toString() === productId.toString());

    if (product) {
        cart.push({
            ...product,
            uniqueId: Date.now() // O'chirishda adashmaslik uchun
        });
        saveCart();
        showToast("Savatchaga qo'shildi!");
    } else {
        console.error("Mahsulot topilmadi: ID", productId);
    }
};

// 2. Savatchadan o'chirish
window.removeFromCart = (index) => {
    cart.splice(index, 1);
    saveCart();
    renderCartModal();
};

// 3. Savatchani saqlash va hisoblagichni yangilash
function saveCart() {
    localStorage.setItem('krist_cart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const countEl = document.getElementById('cartCount');
    if (countEl) countEl.innerText = cart.length;
}

// 4. Savatcha modalini chizish (Render)
window.renderCartModal = () => {
    const itemsDiv = document.getElementById('cartItems');
    const totalEl = document.getElementById('cartTotalSum');
    
    if (!itemsDiv) return;

    if (cart.length === 0) {
        itemsDiv.innerHTML = '<p style="text-align:center; padding:20px; color:#888;">Savatchangiz hozircha bo\'sh.</p>';
        if (totalEl) totalEl.innerText = "0.00";
        return;
    }

    let total = 0;
    itemsDiv.innerHTML = cart.map((item, index) => {
        total += parseFloat(item.price);
        return `
            <div class="cart-item" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; border-bottom:1px solid #eee; padding-bottom:10px;">
                <div style="display:flex; align-items:center; gap:12px;">
                    <img src="${item.image}" style="width:45px; height:45px; object-fit:cover; border-radius:8px;">
                    <div>
                        <h5 style="margin:0; font-size:13px; color:var(--text-color);">${item.name}</h5>
                        <span style="font-size:12px; color:var(--primary-color);">$${parseFloat(item.price).toFixed(2)}</span>
                    </div>
                </div>
                <i class="fas fa-trash-alt" style="color:#ff4757; cursor:pointer; font-size:14px;" onclick="removeFromCart(${index})"></i>
            </div>
        `;
    }).join('');

    if (totalEl) totalEl.innerText = total.toFixed(2);
};

// 5. Modalni ochish/yopish
window.toggleCartModal = (show) => {
    const modal = document.getElementById('cartModal');
    if (modal) {
        modal.style.display = show ? "block" : "none";
        if (show) renderCartModal();
    }
};

// 6. Yordamchi Toast xabari
function showToast(msg) {
    if (window.Swal) {
        Swal.fire({
            toast: true, position: 'top-end', icon: 'success',
            title: msg, showConfirmButton: false, timer: 1500
        });
    } else {
        alert(msg);
    }
}

// Sahifa yuklanganda ishga tushirish
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    
    // Modal tashqarisini bossa yopish
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('cartModal');
        if (e.target === modal) toggleCartModal(false);
    });
});
