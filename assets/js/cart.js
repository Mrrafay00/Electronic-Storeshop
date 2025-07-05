/**
 * Electronic Store Shop - Cart JavaScript
 * Handles: Cart Operations, Checkout, and Cart Page Updates
 */

// ========== CART CLASS ==========
class Cart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
        this.initCart();
    }

    // Initialize cart functionality
    initCart() {
        this.updateCartCount();
        this.setupCartInteractions();
    }

    // Update cart count in navbar
    updateCartCount() {
        const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
        document.querySelectorAll('.cart-count').forEach(el => {
            el.textContent = totalItems;
        });
    }

    // Add item to cart
    addItem(productId, productName, price, quantity = 1, imageUrl = '') {
        const existingItem = this.items.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                id: productId,
                name: productName,
                price: price,
                quantity: quantity,
                image: imageUrl
            });
        }
        
        this.saveCart();
        this.updateCartCount();
    }

    // Remove item from cart
    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartCount();
    }

    // Update item quantity
    updateQuantity(productId, newQuantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = Math.max(1, newQuantity);
            this.saveCart();
        }
    }

    // Calculate cart total
    calculateTotal() {
        return this.items.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    }

    // Save cart to localStorage
    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    // Render cart items (for cart page)
    renderCartItems() {
        const cartContainer = document.querySelector('.cart-items-container');
        if (!cartContainer) return;

        if (this.items.length === 0) {
            cartContainer.innerHTML = `
                <div class="empty-cart text-center py-5">
                    <i class="fas fa-shopping-cart fa-3x mb-3 text-muted"></i>
                    <h4>Your cart is empty</h4>
                    <a href="shop.html" class="btn btn-warning mt-3">Continue Shopping</a>
                </div>
            `;
            return;
        }

        let html = '';
        this.items.forEach(item => {
            html += `
                <div class="cart-item row align-items-center mb-3" data-id="${item.id}">
                    <div class="col-md-2 col-4">
                        <img src="${item.image || 'assets/img/placeholder-product.jpg'}" 
                             alt="${item.name}" 
                             class="img-fluid rounded">
                    </div>
                    <div class="col-md-4 col-8">
                        <h6 class="mb-1">${item.name}</h6>
                        <div class="text-muted small">${this.formatCurrency(item.price)} each</div>
                    </div>
                    <div class="col-md-3 col-6 mt-2 mt-md-0">
                        <div class="input-group">
                            <button class="btn btn-outline-secondary quantity-minus" type="button">-</button>
                            <input type="number" class="form-control quantity-input text-center" 
                                   value="${item.quantity}" min="1">
                            <button class="btn btn-outline-secondary quantity-plus" type="button">+</button>
                        </div>
                    </div>
                    <div class="col-md-2 col-4 mt-2 mt-md-0 text-end">
                        <span class="fw-bold">${this.formatCurrency(item.price * item.quantity)}</span>
                    </div>
                    <div class="col-md-1 col-2 mt-2 mt-md-0 text-end">
                        <button class="btn btn-sm btn-danger remove-item">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </div>
            `;
        });

        // Add totals section
        const subtotal = this.calculateTotal();
        const tax = subtotal * 0.18; // 18% tax
        const shipping = subtotal > 5000 ? 0 : 99; // Free shipping over ₹5000
        const total = subtotal + tax + shipping;

        html += `
            <hr>
            <div class="cart-totals">
                <div class="d-flex justify-content-between mb-2">
                    <span>Subtotal:</span>
                    <span>${this.formatCurrency(subtotal)}</span>
                </div>
                <div class="d-flex justify-content-between mb-2">
                    <span>Shipping:</span>
                    <span>${shipping === 0 ? 'FREE' : this.formatCurrency(shipping)}</span>
                </div>
                <div class="d-flex justify-content-between mb-2">
                    <span>Tax (18%):</span>
                    <span>${this.formatCurrency(tax)}</span>
                </div>
                <div class="d-flex justify-content-between fw-bold fs-5 mt-3">
                    <span>Total:</span>
                    <span>${this.formatCurrency(total)}</span>
                </div>
            </div>
            <div class="d-grid mt-4">
                <a href="checkout.html" class="btn btn-warning btn-lg">Proceed to Checkout</a>
            </div>
        `;

        cartContainer.innerHTML = html;
        this.setupCartInteractions();
    }

    // Setup event listeners for cart
    setupCartInteractions() {
        // Quantity controls
        document.querySelectorAll('.quantity-minus, .quantity-plus').forEach(button => {
            button.addEventListener('click', (e) => {
                const input = e.target.closest('.input-group').querySelector('.quantity-input');
                const cartItem = e.target.closest('.cart-item');
                const productId = cartItem.dataset.id;
                let quantity = parseInt(input.value);

                if (e.target.classList.contains('quantity-minus')) {
                    quantity = Math.max(1, quantity - 1);
                } else {
                    quantity = quantity + 1;
                }

                input.value = quantity;
                this.updateQuantity(productId, quantity);
                this.renderCartItems(); // Refresh display
            });
        });

        // Remove item buttons
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.target.closest('.cart-item').dataset.id;
                this.removeItem(productId);
                this.renderCartItems(); // Refresh display
            });
        });
    }

    // Format currency (₹1,234.56)
    formatCurrency(amount) {
        return '₹' + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }
}

// ========== INITIALIZE CART ==========
const ElectronicStoreShopCart = new Cart();

// Export for use in other files (if needed)
export default ElectronicStoreShopCart;