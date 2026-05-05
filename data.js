// data.js - ТВОИ ТОВАРЫ

const products = [
    {
        id: 1,
        name: "Футболка BRYANSK белая",
        price: 2120,
        oldPrice: 2650,
        discount: 20,
        sale: true,
        description: "Переосмысление городского стиля в духе университетских лиг. Эта футболка — база, которая заявляет о ваших корнях, сочетая премиальный комфорт и эстетику «старой школы».\n\n• Материал: 100% плотный хлопок (240 г/м²) — держит форму и не просвечивает.\n\n• Крой: Базовый, свободная посадка и идеальный силуэт.\n\n• Принт: Износостойкая винтажная графика в стиле Varsity.\n\n• Детали: Усиленная горловина и швы для долгой службы.",
        images: ["photos/white_t-shirt.png"],
        sizes: ["XS", "S", "M", "L", "XL", "2XL"],
        category: "одежда"
    },
    {
        id: 2,
        name: "Футболка BRYANSK бордовая",
        price: 2120,
        oldPrice: 2650,
        discount: 20,
        sale: true,
        description: "Переосмысление городского стиля в духе университетских лиг. Эта футболка — база, которая заявляет о ваших корнях, сочетая премиальный комфорт и эстетику «старой школы».\n\n• Материал: 100% плотный хлопок (240 г/м²) — держит форму и не просвечивает.\n\n• Крой: Базовый, свободная посадка и идеальный силуэт.\n\n• Принт: Износостойкая винтажная графика в стиле Varsity.\n\n• Детали: Усиленная горловина и швы для долгой службы.",
        images: ["photos/red_t-shirt.png"],
        sizes: ["XS", "S", "M", "L", "XL", "2XL"],
        category: "одежда"
    },
    {
        id: 3,
        name: "Футболка BRYANSK черная",
        price: 2120,
        oldPrice: 2650,
        discount: 20,
        sale: true,
        description: "Переосмысление городского стиля в духе университетских лиг. Эта футболка — база, которая заявляет о ваших корнях, сочетая премиальный комфорт и эстетику «старой школы».\n\n• Материал: 100% плотный хлопок (240 г/м²) — держит форму и не просвечивает.\n\n• Крой: Базовый, свободная посадка и идеальный силуэт.\n\n• Принт: Износостойкая винтажная графика в стиле Varsity.\n\n• Детали: Усиленная горловина и швы для долгой службы.",
        images: ["photos/black_t-shirt.png"],
        sizes: ["XS", "S", "M", "L", "XL", "2XL"],
        category: "одежда"
    },
    {
        id: 4,
        name: "Рубашка-поло 32 белая",
        price: 1960,
        oldPrice: 2615,
        discount: 25,
        sale: true,
        description: "Премиальное поло, в котором уличный характер встречается с классическим силуэтом. Идеальный выбор для тех, кто ценит лаконичность и статус в деталях.\n\n• Материал: 100% органический хлопок «пике» — фактурная ткань, которая отлично дышит.\n\n• Крой: Classic Fit — выверенная посадка, подчеркивающая силуэт.\n\n• Детали: Контрастный логотип и аккуратный воротник на пуговицах.\n\n• Стиль: Casual / Minimal — от офиса до вечерней прогулки по городу.",
        images: ["photos/white_polo.png"],
        sizes: ["XS", "S", "M", "L", "XL", "2XL"],
        category: "одежда"
    },
    {
        id: 5,
        name: "Рубашка-поло 32 черная",
        price: 1960,
        oldPrice: 2615,
        discount: 25,
        sale: true,
        description: "Премиальное поло, в котором уличный характер встречается с классическим силуэтом. Идеальный выбор для тех, кто ценит лаконичность и статус в деталях.\n\n• Материал: 100% органический хлопок «пике» — фактурная ткань, которая отлично дышит.\n\n• Крой: Classic Fit — выверенная посадка, подчеркивающая силуэт.\n\n• Детали: Контрастный логотип и аккуратный воротник на пуговицах.\n\n• Стиль: Casual / Minimal — от офиса до вечерней прогулки по городу.",
        images: ["photos/black_polo.png"],
        sizes: ["XS", "S", "M", "L", "XL", "2XL"],
        category: "одежда"
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
        if (product) {
            cart.push({
                id: productId,
                name: product.name,
                price: product.price,
                size: size,
                quantity: quantity,
                image: product.images[0]
            });
        }
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
        
        const backButton = tg.BackButton;
        if (backButton) {
            backButton.onClick(() => {
                window.history.back();
            });
        }
    }
}
