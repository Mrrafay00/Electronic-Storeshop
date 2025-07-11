/**
 * Electronic Store Shop - Main JavaScript File
 * Handles: Navbar, Cart, Product Interactions, etc.
 */

// ========== GLOBAL VARIABLES ==========
let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
const cartCountElements = document.querySelectorAll('.cart-count');

// ========== INITIAL SETUP ==========
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    initProductInteractions();
    initMobileMenu();
});

// ========== CART FUNCTIONALITY ==========
function updateCartCount() {
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElements.forEach(el => {
        el.textContent = totalItems;
    });
}

function addToCart(productId, productName, price, quantity = 1) {
    const existingItem = cartItems.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cartItems.push({
            id: productId,
            name: productName,
            price: price,
            quantity: quantity
        });
    }
    
    saveCart();
    updateCartCount();
}

function removeFromCart(productId) {
    cartItems = cartItems.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cartItems));
}

// ========== PRODUCT INTERACTIONS ==========
function initProductInteractions() {
    // Add to Cart Buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productId = this.dataset.productId || productCard.dataset.productId;
            const productName = productCard.querySelector('.card-title').textContent;
            const priceText = productCard.querySelector('.current-price').textContent;
            const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
            
            addToCart(productId, productName, price);
            
            // Visual feedback
            this.innerHTML = '<i class="fas fa-check me-1"></i> Added!';
            this.classList.remove('btn-warning');
            this.classList.add('btn-success');
            
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-cart-plus me-1"></i> Add to Cart';
                this.classList.remove('btn-success');
                this.classList.add('btn-warning');
            }, 2000);
        });
    });
    
    // Product Quantity Controls
    document.querySelectorAll('.quantity-control').forEach(control => {
        control.addEventListener('click', function() {
            const input = this.parentElement.querySelector('.quantity-input');
            let value = parseInt(input.value);
            
            if (this.classList.contains('quantity-minus')) {
                value = value > 1 ? value - 1 : 1;
            } else {
                value = value + 1;
            }
            
            input.value = value;
        });
    });
}

// ========== MOBILE MENU ==========
function initMobileMenu() {
    const navbarToggler = document.querySelector('.navbar-toggler');
    if (navbarToggler) {
        navbarToggler.addEventListener('click', function() {
            document.querySelector('.navbar-collapse').classList.toggle('show');
        });
    }
}

// ========== UTILITY FUNCTIONS ==========
function formatCurrency(amount) {
    return '₹' + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

// ========== EXPORT FOR MODULAR USE ==========
// (Only needed if you'll split code into modules later)
export { addToCart, removeFromCart, updateCartCount };