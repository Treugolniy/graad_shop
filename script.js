// ========== ФУНКЦИИ КОРЗИНЫ (твои старые) ==========

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
    
    if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
    }
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

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: ${type === 'success' ? '#8A1538' : '#ff3b30'};
        color: #E6E6E6;
        padding: 12px 24px;
        border-radius: 30px;
        font-size: 14px;
        font-family: 'Bebas Neue Cyrillic', sans-serif;
        z-index: 1000;
        animation: slideUp 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Добавляем анимацию для уведомлений
const notificationStyle = document.createElement('style');
notificationStyle.textContent = `
    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }
`;
document.head.appendChild(notificationStyle);

// ========== НОВЫЙ КОД ДЛЯ ГЛАВНОЙ СТРАНИЦЫ ==========

function startBackgroundSlider() {
    let currentSlide = 0;
    const slides = document.querySelectorAll('.slider-slide');
    
    if (slides.length === 0) return;
    
    // Убедимся, что первый слайд активен
    slides.forEach((slide, index) => {
        if (index === 0) {
            slide.classList.add('active');
        } else {
            slide.classList.remove('active');
        }
    });
    
    // Перелистывание каждые 5 секунд
    setInterval(() => {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }, 5000);
}

function startSplashAnimation(splashScreen, mainContent) {
    const heroTitle = document.getElementById('heroTitle');
    const heroButtons = document.getElementById('heroButtons');
    const socialIcons = document.getElementById('socialIcons');
    
    setTimeout(() => {
        splashScreen.classList.add('animate-in');
    }, 100);
    
    setTimeout(() => {
        splashScreen.classList.add('animate-out');
    }, 2800);
    
    setTimeout(() => {
        splashScreen.style.display = 'none';
        mainContent.classList.remove('hidden');
        
        // Запускаем фоновый слайдер
        startBackgroundSlider();
        
        setTimeout(() => {
            if (heroTitle) heroTitle.classList.add('visible');
        }, 100);
        
        setTimeout(() => {
            if (heroButtons) heroButtons.classList.add('visible');
        }, 300);
        
        setTimeout(() => {
            if (socialIcons) socialIcons.classList.add('visible');
        }, 500);
        
    }, 3600);
}

// ========== ЗАПУСК ВСЕГО ==========

document.addEventListener('DOMContentLoaded', () => {
    initTelegram();
    updateCartCounter();
    
    const splashScreen = document.getElementById('splashScreen');
    const mainContent = document.getElementById('mainContent');
    
    if (splashScreen && mainContent) {
        // Это главная страница — добавляем класс для прозрачного фона
        document.body.classList.add('has-slider');
        startSplashAnimation(splashScreen, mainContent);
    }
    
    // Обработчики кнопок хедера
    const cartBtn = document.getElementById('cartBtn');
    if (cartBtn) {
        cartBtn.addEventListener('click', () => {
            window.location.href = 'cart.html';
        });
    }
    
    const menuBtn = document.getElementById('menuBtn');
    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            if (window.Telegram?.WebApp) {
                window.Telegram.WebApp.showPopup({
                    title: 'Меню',
                    message: 'Здесь будет навигация',
                    buttons: [{type: 'close'}]
                });
            }
        });
    }
});
