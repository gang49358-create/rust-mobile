/* =========================================
   TELEGRAM GOOGLE APPS SCRIPT
========================================= */

const TELEGRAM_API =
    "https://script.google.com/macros/s/AKfycbxJyvekI9LWKhueYWzeQB8j5NMslqbdOYChwpIiH0w5hF6_l9Hyz2nBTsU8axJpNStwgw/exec";


/* =========================================
   ТОВАРЫ
========================================= */

const products = {

    coins: [

        {
            id: "coins-320",
            name: "320 монет",
            price: 520,
            description: "300 + 20 бонусных монет"
        },

        {
            id: "coins-740",
            name: "740 монет",
            price: 1190,
            description: "680 + 60 бонусных монет"
        },

        {
            id: "coins-1060",
            name: "1060 монет",
            price: 1700,
            description: "Большой пакет монет"
        },

        {
            id: "coins-1400",
            name: "1400 монет",
            price: 2240,
            description: "1280 + 120 бонусных монет"
        },

        {
            id: "coins-1720",
            name: "1720 монет",
            price: 2740,
            description: "Большой пакет"
        },

        {
            id: "coins-2140",
            name: "2140 монет",
            price: 3390,
            description: "Выгодный пакет"
        },

        {
            id: "coins-2880",
            name: "2880 монет",
            price: 4520,
            description: "Большой пакет"
        },

        {
            id: "coins-3680",
            name: "3680 монет",
            price: 5730,
            description: "3280 + 400 бонусных"
        },

        {
            id: "coins-7480",
            name: "7480 монет",
            price: 11320,
            description: "6480 + 1000 бонусных"
        }

    ],


    battlepass: [

        {
            id: "battlepass",
            name: "Battle Pass",
            price: 590,
            description: "Battle Pass — 455 ⭐"
        }

    ],


    promotions: [

        {
            id: "promo-1",
            name: "Акция — 1400 монет",
            price: 1990,
            description: "Специальная цена"
        },

        {
            id: "promo-2",
            name: "Акция — 3680 монет",
            price: 4990,
            description: "Выгодное предложение"
        }

    ]

};


/* =========================================
   КОРЗИНА
========================================= */

let cart =
    JSON.parse(
        localStorage.getItem("rustCart") || "[]"
    );


/* =========================================
   ЗАПУСК
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const firstCategory =
            document.querySelector(".category");

        showCategory(
            "coins",
            firstCategory
        );

        updateCart();

        renderOrders();

        updateProfile();

    }
);


/* =========================================
   КАТЕГОРИИ
========================================= */

function showCategory(category, button) {

    document
        .querySelectorAll(".category")
        .forEach(item => {

            item.classList.remove("active");

        });


    if (button) {

        button.classList.add("active");

    }


    const container =
        document.getElementById("products");


    if (!container) {

        return;

    }


    container.innerHTML = "";


    if (!products[category]) {

        return;

    }


    products[category].forEach(product => {

        container.innerHTML +=
            createProductHTML(product);

    });

}


/* =========================================
   HTML ТОВАРА
========================================= */

function createProductHTML(product) {

    return `

        <article class="product">

            <div class="product-image">

                <div class="product-coins">

                    <div class="mini-coin">
                        ✦
                    </div>

                    <div class="mini-coin">
                        ✦
                    </div>

                    <div class="mini-coin">
                        ✦
                    </div>

                </div>

            </div>


            <h3>
                ${escapeHTML(product.name)}
            </h3>


            <div class="product-description">
                ${escapeHTML(product.description)}
            </div>


            <div class="product-bottom">

                <div class="price">
                    ${formatPrice(product.price)} ₽
                </div>


                <button
                    onclick="addToCart('${product.id}')"
                >
                    🛒 Купить
                </button>

            </div>

        </article>

    `;

}


/* =========================================
   ПОИСК ТОВАРА
========================================= */

function findProduct(id) {

    for (const category in products) {

        const product =
            products[category].find(
                item => item.id === id
            );


        if (product) {

            return product;

        }

    }


    return null;

}


/* =========================================
   ДОБАВИТЬ В КОРЗИНУ
========================================= */

function addToCart(id) {

    const product =
        findProduct(id);


    if (!product) {

        showToast("Товар не найден");

        return;

    }


    cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        description: product.description
    });


    saveCart();

    updateCart();

    showToast(
        "Товар добавлен в корзину"
    );

}


/* =========================================
   УДАЛИТЬ ИЗ КОРЗИНЫ
========================================= */

function removeFromCart(index) {

    if (
        index < 0 ||
        index >= cart.length
    ) {

        return;

    }


    cart.splice(index, 1);

    saveCart();

    updateCart();

    renderCart();

}


/* =========================================
   СОХРАНИТЬ КОРЗИНУ
========================================= */

function saveCart() {

    localStorage.setItem(
        "rustCart",
        JSON.stringify(cart)
    );

}


/* =========================================
   СЧЁТЧИК КОРЗИНЫ
========================================= */

function updateCart() {

    const count =
        document.getElementById(
            "cartCount"
        );


    if (count) {

        count.textContent =
            cart.length;

    }

}


/* =========================================
   ОТКРЫТЬ КОРЗИНУ
========================================= */

function openCart() {

    renderCart();

    openModal("cartModal");

}


/* =========================================
   КОРЗИНА
========================================= */

function renderCart() {

    const container =
        document.getElementById(
            "cartItems"
        );


    const totalElement =
        document.getElementById(
            "cartTotal"
        );


    if (!container || !totalElement) {

        return;

    }


    if (!cart.length) {

        container.innerHTML = `

            <div class="empty">

                🛒

                <br><br>

                Корзина пустая

            </div>

        `;


        totalElement.textContent =
            "0 ₽";


        return;

    }


    container.innerHTML = "";


    let total = 0;


    cart.forEach(
        (item, index) => {

            total +=
                Number(item.price) || 0;


            container.innerHTML += `

                <div class="cart-item">

                    <div class="cart-item-info">

                        <strong>
                            ${escapeHTML(item.name)}
                        </strong>

                        <span>
                            ${formatPrice(item.price)} ₽
                        </span>

                    </div>


                    <button
                        class="cart-remove"
                        onclick="removeFromCart(${index})"
                    >
                        🗑
                    </button>

                </div>

            `;

        }
    );


    totalElement.textContent =
        formatPrice(total) + " ₽";

}


/* =========================================
   ОФОРМЛЕНИЕ ЗАКАЗА
========================================= */

function checkout() {

    if (!cart.length) {

        showToast("Корзина пустая");

        return;

    }


    const savedId =
        localStorage.getItem(
            "rustPlayerId"
        );


    const playerInput =
        document.getElementById(
            "checkoutPlayerId"
        );


    if (playerInput && savedId) {

        playerInput.value =
            savedId;

    }


    const orderNumber =
        generateOrderNumber();


    const orderNumberElement =
        document.getElementById(
            "orderNumber"
        );


    if (orderNumberElement) {

        orderNumberElement.textContent =
            orderNumber;

    }


    renderCheckoutItems();


    closeModal("cartModal");

    openModal("checkoutModal");

}


/* =========================================
   НОМЕР ЗАКАЗА
========================================= */

function generateOrderNumber() {

    const now =
        new Date();


    const year =
        now.getFullYear();


    const month =
        String(
            now.getMonth() + 1
        ).padStart(2, "0");


    const day =
        String(
            now.getDate()
        ).padStart(2, "0");


    const random =
        Math.floor(
            100000 +
            Math.random() * 900000
        );


    return (
        "RM-" +
        year +
        month +
        day +
        "-" +
        random
    );

}


/* =========================================
   ТОВАРЫ В ОФОРМЛЕНИИ
========================================= */

function renderCheckoutItems() {

    const container =
        document.getElementById(
            "checkoutItems"
        );


    const totalElement =
        document.getElementById(
            "checkoutTotal"
        );


    if (!container || !totalElement) {

        return;

    }


    container.innerHTML = "";


    let total = 0;


    cart.forEach(item => {

        total +=
            Number(item.price) || 0;


        container.innerHTML += `

            <div class="checkout-item">

                <span class="checkout-item-name">
                    ${escapeHTML(item.name)}
                </span>

                <span class="checkout-item-price">
                    ${formatPrice(item.price)} ₽
                </span>

            </div>

        `;

    });


    totalElement.textContent =
        formatPrice(total) + " ₽";

}


/* =========================================
   СОЗДАНИЕ ЗАКАЗА
========================================= */

function createOrder() {

    const playerInput =
        document.getElementById(
            "checkoutPlayerId"
        );


    const paymentInput =
        document.getElementById(
            "paymentMethod"
        );


    const agreementInput =
        document.getElementById(
            "agreement"
        );


    const orderNumberElement =
        document.getElementById(
            "orderNumber"
        );


    if (
        !playerInput ||
        !paymentInput ||
        !agreementInput ||
        !orderNumberElement
    ) {

        showToast(
            "Ошибка формы заказа"
        );

        return;

    }


    const playerId =
        playerInput.value.trim();


    const paymentMethod =
        paymentInput.value;


    const agreement =
        agreementInput.checked;


    const orderNumber =
        orderNumberElement.textContent;


    if (!playerId) {

        showToast(
            "Введите игровой ID"
        );

        return;

    }


    if (!agreement) {

        showToast(
            "Подтвердите правильность ID"
        );

        return;

    }


    let total = 0;


    cart.forEach(item => {

        total +=
            Number(item.price) || 0;

    });


    localStorage.setItem(
        "rustPlayerId",
        playerId
    );


    const paymentNames = {

        card: "Банковская карта",

        sbp: "СБП",

        crypto: "Криптовалюта"

    };


    const paymentName =
        paymentNames[paymentMethod] ||
        paymentMethod ||
        "Не указан";


    const order = {

        id: orderNumber,

        playerId: playerId,

        items: [...cart],

        total: total,

        paymentMethod:
            paymentName,

        status: "Новый",

        date:
            new Date().toISOString()

    };


    let orders =
        JSON.parse(
            localStorage.getItem(
                "rustOrders"
            ) || "[]"
        );


    orders.unshift(order);


    localStorage.setItem(
        "rustOrders",
        JSON.stringify(orders)
    );


    /*
       Показываем успех сразу.
       Отправка в Telegram идёт отдельно.
    */

    document
        .getElementById(
            "successOrderNumber"
        )
        .textContent =
            orderNumber;


    document
        .getElementById(
            "successPlayerId"
        )
        .textContent =
            playerId;


    document
        .getElementById(
            "successTotal"
        )
        .textContent =
            formatPrice(total) + " ₽";


    sendOrderToTelegram(order);


    cart = [];

    saveCart();

    updateCart();

    renderOrders();

    updateProfile();


    closeModal("checkoutModal");

    openModal("successModal");

}


/* =========================================
   ОТПРАВКА ЗАКАЗА В TELEGRAM
========================================= */

function sendOrderToTelegram(order) {

    if (!TELEGRAM_API) {

        console.error(
            "TELEGRAM_API не указан"
        );

        return;

    }


    const items =
        order.items
            .map(item => {

                return (
                    item.name +
                    " — " +
                    formatPrice(item.price) +
                    " ₽"
                );

            })
            .join("\n");


    const payload = {

        orderNumber:
            order.id,

        playerId:
            order.playerId,

        total:
            order.total,

        paymentMethod:
            order.paymentMethod,

        items:
            items

    };


    fetch(
        TELEGRAM_API,
        {

            method: "POST",

            mode: "no-cors",

            headers: {
                "Content-Type":
                    "text/plain;charset=utf-8"
            },

            body:
                JSON.stringify(payload)

        }
    )
    .then(() => {

        console.log(
            "Запрос заказа отправлен"
        );

    })
    .catch(error => {

        console.error(
            "Ошибка отправки заказа:",
            error
        );

    });

}


/* =========================================
   ЗАКАЗЫ
========================================= */

function renderOrders() {

    const container =
        document.getElementById(
            "ordersList"
        );


    if (!container) {

        return;

    }


    const orders =
        JSON.parse(
            localStorage.getItem(
                "rustOrders"
            ) || "[]"
        );


    if (!orders.length) {

        container.innerHTML = `

            <div class="empty">

                📋

                <br><br>

                Заказов пока нет.

            </div>

        `;

        return;

    }


    container.innerHTML = "";


    orders.forEach(order => {

        const date =
            new Date(order.date)
                .toLocaleString(
                    "ru-RU"
                );


        container.innerHTML += `

            <div class="order-history-item">

                <div class="order-history-top">

                    <span class="order-history-number">
                        ${escapeHTML(order.id)}
                    </span>

                    <span class="order-history-status">
                        ${escapeHTML(order.status)}
                    </span>

                </div>


                <div class="order-history-info">

                    🎮 ID:
                    ${escapeHTML(order.playerId)}

                    <br>

                    💰 Сумма:
                    ${formatPrice(order.total)} ₽

                    <br>

                    💳 Оплата:
                    ${escapeHTML(order.paymentMethod)}

                    <br>

                    🕐 ${date}

                </div>

            </div>

        `;

    });

}


/* =========================================
   ПРОФИЛЬ
========================================= */

function updateProfile() {

    const playerId =
        localStorage.getItem(
            "rustPlayerId"
        ) || "Не указан";


    const orders =
        JSON.parse(
            localStorage.getItem(
                "rustOrders"
            ) || "[]"
        );


    let spent = 0;


    orders.forEach(order => {

        spent +=
            Number(order.total) || 0;

    });


    const idElement =
        document.getElementById(
            "profileId"
        );


    const ordersElement =
        document.getElementById(
            "profileOrders"
        );


    const spentElement =
        document.getElementById(
            "profileSpent"
        );


    if (idElement) {

        idElement.textContent =
            playerId;

    }


    if (ordersElement) {

        ordersElement.textContent =
            orders.length;

    }


    if (spentElement) {

        spentElement.textContent =
            formatPrice(spent) + " ₽";

    }

}


/* =========================================
   ПРОФИЛЬ
========================================= */

function openProfile() {

    updateProfile();

    openModal("profileModal");

}


/* =========================================
   ЗАКАЗЫ
========================================= */

function openOrders() {

    renderOrders();

    closeModal("profileModal");

    openModal("ordersModal");

}


/* =========================================
   ПОДДЕРЖКА
========================================= */

function openSupport() {

    openModal("supportModal");

}


/* =========================================
   МОДАЛЬНОЕ ОКНО
========================================= */

function openModal(id) {

    const modal =
        document.getElementById(id);


    if (!modal) {

        return;

    }


    modal.classList.add("open");

    document.body.style.overflow =
        "hidden";

}


function closeModal(id) {

    const modal =
        document.getElementById(id);


    if (!modal) {

        return;

    }


    modal.classList.remove("open");

    document.body.style.overflow =
        "";

}


/* =========================================
   ЗАКРЫТИЕ ПО ФОНУ
========================================= */

document.addEventListener(
    "click",
    function(event) {

        if (
            event.target.classList.contains(
                "modal"
            )
        ) {

            event.target.classList.remove(
                "open"
            );

            document.body.style.overflow =
                "";

        }

    }
);


/* =========================================
   ESC
========================================= */

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Escape"
        ) {

            document
                .querySelectorAll(
                    ".modal.open"
                )
                .forEach(modal => {

                    modal.classList.remove(
                        "open"
                    );

                });


            document.body.style.overflow =
                "";

        }

    }
);


/* =========================================
   КОПИРОВАНИЕ НОМЕРА
========================================= */

function copyOrderNumber() {

    const element =
        document.getElementById(
            "orderNumber"
        );


    if (!element) {

        return;

    }


    const number =
        element.textContent;


    copyText(number);

}


function copySuccessOrder() {

    const element =
        document.getElementById(
            "successOrderNumber"
        );


    if (!element) {

        return;

    }


    const number =
        element.textContent;


    copyText(number);

}


function copyText(text) {

    if (
        navigator.clipboard &&
        navigator.clipboard.writeText
    ) {

        navigator.clipboard
            .writeText(text)
            .then(() => {

                showToast(
                    "Номер заказа скопирован"
                );

            })
            .catch(() => {

                showToast(text);

            });

    } else {

        showToast(text);

    }

}


/* =========================================
   ПРОКРУТКА
========================================= */

function scrollToSection(id) {

    const element =
        document.getElementById(id);


    if (!element) {

        return;

    }


    element.scrollIntoView({
        behavior: "smooth"
    });

}


/* =========================================
   ФОРМАТ ЦЕНЫ
========================================= */

function formatPrice(price) {

    return Number(price)
        .toLocaleString("ru-RU");

}


/* =========================================
   ЭКРАНИРОВАНИЕ HTML
========================================= */

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================
   УВЕДОМЛЕНИЕ
========================================= */

function showToast(message) {

    const old =
        document.querySelector(
            ".toast"
        );


    if (old) {

        old.remove();

    }


    const toast =
        document.createElement(
            "div"
        );


    toast.className =
        "toast";


    toast.textContent =
        message;


    document.body.appendChild(
        toast
    );


    setTimeout(() => {

        toast.classList.add(
            "show"
        );

    }, 10);


    setTimeout(() => {

        toast.classList.remove(
            "show"
        );


        setTimeout(() => {

            if (toast.parentNode) {

                toast.remove();

            }

        }, 250);

    }, 2200);

}