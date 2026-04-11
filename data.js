// data.js - ТВОИ ТОВАРЫ (редактируй здесь)

const products = [
    {
        id: 1,
        name: "Футболка Classic",
        price: 1500,
        description: "Удобная хлопковая футболка. Подходит для повседневной носки.",
        images: [
            "https://placehold.co/600x400/1e90ff/white?text=Футболка+1",
            "https://placehold.co/600x400/4169e1/white?text=Футболка+2",
            "https://placehold.co/600x400/0000cd/white?text=Футболка+3"
        ],
        sizes: ["XS", "S", "M", "L", "XL"],
        category: "одежда"
    },
    {
        id: 2,
        name: "Кепка Street",
        price: 890,
        description: "Стильная кепка с регулировкой. Отличный аксессуар для города.",
        images: [
            "https://placehold.co/600x400/32cd32/white?text=Кепка+1",
            "https://placehold.co/600x400/228b22/white?text=Кепка+2"
        ],
        sizes: ["S", "M", "L"],
        category: "аксессуары"
    },
    {
        id: 3,
        name: "Толстовка Hoodie",
        price: 3500,
        description: "Тёплая толстовка с капюшоном. Идеально для прохладной погоды.",
        images: [
            "https://placehold.co/600x400/ff6347/white?text=Худи+1",
            "https://placehold.co/600x400/ff4500/white?text=Худи+2"
        ],
        sizes: ["S", "M", "L", "XL"],
        category: "одежда"
    },
    {
        id: 4,
        name: "Шоппер сумка",
        price: 550,
        description: "Экологичная сумка для покупок. Вместительная и прочная.",
        images: [
            "https://placehold.co/600x400/daa520/white?text=Сумка+1",
            "https://placehold.co/600x400/b8860b/white?text=Сумка+2"
        ],
        sizes: ["One size"],
        category: "аксессуары"
    }
];

// Функции для работы с корзиной (localStorage)
function getCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(productId, size, quantity = 1) {
    const cart = getCart();
    const existingItem = cart.find(item => item.id === productId && item.size === size);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        const product = products.find(p => p.id === productId);
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            size: size,
            quantity: quantity,
            image: product.images[0]
        });
    }
    
    saveCart(cart);
    updateCartCounter();
}

function removeFromCart(productId, size) {
    let cart = getCart();
    cart = cart.filter(item => !(item.id === productId && item.size === size));
    saveCart(cart);
    updateCartCounter();
}

function updateQuantity(productId, size, newQuantity) {
    const cart = getCart();
    const item = cart.find(item => item.id === productId && item.size === size);
    if (item && newQuantity > 0) {
        item.quantity = newQuantity;
        saveCart(cart);
    } else if (newQuantity <= 0) {
        removeFromCart(productId, size);
    }
    updateCartCounter();
}

function getCartTotal() {
    const cart = getCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function updateCartCounter() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const counters = document.querySelectorAll('.cart-count');
    counters.forEach(counter => {
        if (totalItems > 0) {
            counter.textContent = totalItems;
            counter.style.display = 'flex';
        } else {
            counter.style.display = 'none';
        }
    });
}

// Инициализация Telegram WebApp
function initTelegram() {
    if (window.Telegram && window.Telegram.WebApp) {
        const tg = window.Telegram.WebApp;
        tg.ready();
        tg.expand();
        tg.enableClosingConfirmation();
        
        // Меняем цвет кнопки "Назад" в теме Telegram
        const backButton = tg.BackButton;
        if (backButton) {
            backButton.onClick(() => {
                window.history.back();
            });
        }
    }
}