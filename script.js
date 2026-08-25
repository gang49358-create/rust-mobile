/* =========================================
   TELEGRAM / GOOGLE APPS SCRIPT
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
   CART
========================================= */

let cart = [];

try {
    cart = JSON.parse(
        localStorage.getItem("rustCart") || "[]"
    );

    if (!Array.isArray(cart)) {
        cart = [];
    }

} catch (error) {

    cart = [];

}


/* =========================================
   START
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
   CATEGORY
========================================= */

function showCategory(category, button) {

    if (!products[category]) {
        return;
    }

    document
        .querySelectorAll(".category")
        .forEach(function (item) {

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


    products[category].forEach(function (product) {

        container.innerHTML +=
            createProductHTML(product);

    });

}


/* =========================================
   PRODUCT HTML
========================================= */

function createProductHTML(product) {

    return `

        <article class="product">

            <div class="product-image">

                <div class="product-coins">

                    <div class="mini-coin">✦</div>
                    <div class="mini-coin">✦</div>
                    <div class="mini-coin">✦</div>

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
                    type="button"
                    onclick="addToCart('${product.id}')"
                >
                    🛒 Купить
                </button>

            </div>

        </article>

    `;

}


/* =========================================
   FIND PRODUCT
========================================= */

function findProduct(id) {

    for (const category in products) {

        const product =
            products[category].find(function (item) {

                return item.id === id;

            });


        if (product) {
            return product;
        }

    }

    return null;

}


/* =========================================
   ADD TO CART
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
   REMOVE FROM CART
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
   SAVE CART
========================================= */

function saveCart() {

    localStorage.setItem(
        "rustCart",
        JSON.stringify(cart)
    );

}


/* =========================================
   UPDATE CART
========================================= */

function updateCart() {

    const count =
        document.getElementById("cartCount");


    if (count) {

        count.textContent =
            cart.length;

    }

}


/* =========================================
   OPEN CART
========================================= */

function openCart() {

    renderCart();

    openModal("cartModal");

}


/* =========================================
   RENDER CART
========================================= */

function renderCart() {

    const container =
        document.getElementById("cartItems");


    const totalElement =
        document.getElementById("cartTotal");


    if (!container) {
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


        if (totalElement) {
            totalElement.textContent = "0 ₽";
        }

        return;

    }


    container.innerHTML = "";


    let total = 0;


    cart.forEach(function (item, index) {

        total += Number(item.price) || 0;


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
                    type="button"
                    class="cart-remove"
                    onclick="removeFromCart(${index})"
                >
                    🗑
                </button>

            </div>

        `;

    });


    if (totalElement) {

        totalElement.textContent =
            formatPrice(total) + " ₽";

    }

}


/* =========================================
   CHECKOUT
========================================= */

function checkout() {

    if (!cart.length) {

        showToast(
            "Корзина пустая"
        );

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


    if (savedId && playerInput) {

        playerInput.value =
            savedId;

    }


    const orderNumber =
        generateOrderNumber();


    const orderElement =
        document.getElementById(
            "orderNumber"
        );


    if (orderElement) {

        orderElement.textContent =
            orderNumber;

    }


    renderCheckoutItems();

    closeModal("cartModal");

    openModal("checkoutModal");

}


/* =========================================
   ORDER NUMBER
========================================= */

function generateOrderNumber() {

    const now = new Date();


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


    const hours =
        String(
            now.getHours()
        ).padStart(2, "0");


    const minutes =
        String(
            now.getMinutes()
        ).padStart(2, "0");


    const random =
        Math.floor(
            1000 +
            Math.random() * 9000
        );


    return (
        "RM-" +
        year +
        month +
        day +
        "-" +
        hours +
        minutes +
        "-" +
        random
    );

}


/* =========================================
   CHECKOUT ITEMS
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


    if (!container) {
        return;
    }


    container.innerHTML = "";


    let total = 0;


    cart.forEach(function (item) {

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


    if (totalElement) {

        totalElement.textContent =
            formatPrice(total) + " ₽";

    }

}


/* =========================================
   CREATE ORDER
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


    const orderElement =
        document.getElementById(
            "orderNumber"
        );


    if (!playerInput) {

        showToast(
            "Поле игрового ID не найдено"
        );

        return;

    }


    const playerId =
        playerInput.value.trim();


    const paymentMethod =
        paymentInput
            ? paymentInput.value
            : "Не указан";


    const agreement =
        agreementInput
            ? agreementInput.checked
            : true;


    const orderNumber =
        orderElement
            ? orderElement.textContent.trim()
            : generateOrderNumber();


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


    if (!cart.length) {

        showToast(
            "Корзина пустая"
        );

        return;

    }


    let total = 0;


    cart.forEach(function (item) {

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


    const readablePayment =
        paymentNames[paymentMethod]
        || paymentMethod
        || "Не указан";


    const order = {

        id: orderNumber,

        orderNumber: orderNumber,

        playerId: playerId,

        items: cart.map(function (item) {

            return {

                id: item.id,

                name: item.name,

                price: Number(item.price) || 0

            };

        }),

        total: total,

        paymentMethod:
            readablePayment,

        status: "Новый",

        date:
            new Date().toISOString()

    };


    let orders = [];


    try {

        orders = JSON.parse(
            localStorage.getItem(
                "rustOrders"
            ) || "[]"
        );

        if (!Array.isArray(orders)) {
            orders = [];
        }

    } catch (error) {

        orders = [];

    }


    orders.unshift(order);


    localStorage.setItem(
        "rustOrders",
        JSON.stringify(orders)
    );


    const successOrderNumber =
        document.getElementById(
            "successOrderNumber"
        );


    const successPlayerId =
        document.getElementById(
            "successPlayerId"
        );


    const successTotal =
        document.getElementById(
            "successTotal"
        );


    if (successOrderNumber) {

        successOrderNumber.textContent =
            orderNumber;

    }


    if (successPlayerId) {

        successPlayerId.textContent =
            playerId;

    }


    if (successTotal) {

        successTotal.textContent =
            formatPrice(total) + " ₽";

    }


    /*
        Отправляем заказ в Google Apps Script.
    */

    sendOrderToTelegram(order);


    /*
        Очищаем корзину.
    */

    cart = [];

    saveCart();

    updateCart();

    renderOrders();

    updateProfile();


    closeModal(
        "checkoutModal"
    );


    openModal(
        "successModal"
    );

}


/* =========================================
   SEND ORDER TO TELEGRAM
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
            .map(function (item) {

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
            order.orderNumber,

        playerId:
            order.playerId,

        total:
            order.total,

        paymentMethod:
            order.paymentMethod,

        items:
            items

    };


    /*
        Google Apps Script Web App
        принимает POST-запрос.
    */

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
    .then(function () {

        console.log(
            "Запрос заказа отправлен"
        );

    })
    .catch(function (error) {

        console.error(
            "Ошибка отправки заказа:",
            error
        );

    });

}


/* =========================================
   ORDERS
========================================= */

function renderOrders() {

    const container =
        document.getElementById(
            "ordersList"
        );


    if (!container) {
        return;
    }


    let orders = [];


    try {

        orders = JSON.parse(
            localStorage.getItem(
                "rustOrders"
            ) || "[]"
        );


        if (!Array.isArray(orders)) {
            orders = [];
        }

    } catch (error) {

        orders = [];

    }


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


    orders.forEach(function (order) {

        const date =
            order.date
                ? new Date(order.date)
                    .toLocaleString("ru-RU")
                : "—";


        container.innerHTML += `

            <div class="order-history-item">

                <div class="order-history-top">

                    <span class="order-history-number">

                        ${escapeHTML(
                            order.orderNumber ||
                            order.id ||
                            "—"
                        )}

                    </span>

                    <span class="order-history-status">

                        ${escapeHTML(
                            order.status ||
                            "Новый"
                        )}

                    </span>

                </div>


                <div class="order-history-info">

                    🎮 ID:
                    ${escapeHTML(
                        order.playerId || "—"
                    )}

                    <br>

                    💰 Сумма:
                    ${formatPrice(
                        order.total || 0
                    )} ₽

                    <br>

                    💳 Оплата:
                    ${escapeHTML(
                        order.paymentMethod || "—"
                    )}

                    <br>

                    🕐 ${date}

                </div>

            </div>

        `;

    });

}


/* =========================================
   PROFILE
========================================= */

function updateProfile() {

    const playerId =
        localStorage.getItem(
            "rustPlayerId"
        ) || "Не указан";


    let orders = [];


    try {

        orders = JSON.parse(
            localStorage.getItem(
                "rustOrders"
            ) || "[]"
        );


        if (!Array.isArray(orders)) {
            orders = [];
        }

    } catch (error) {

        orders = [];

    }


    let spent = 0;


    orders.forEach(function (order) {

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
   PROFILE
========================================= */

function openProfile() {

    updateProfile();

    openModal(
        "profileModal"
    );

}


/* =========================================
   ORDERS
========================================= */

function openOrders() {

    renderOrders();

    closeModal(
        "profileModal"
    );

    openModal(
        "ordersModal"
    );

}


/* =========================================
   SUPPORT
========================================= */

function openSupport() {

    openModal(
        "supportModal"
    );

}


/* =========================================
   MODALS
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
   CLICK OUTSIDE
========================================= */

document.addEventListener(
    "click",
    function (event) {

        if (
            event.target &&
            event.target.classList &&
            event.target.classList.contains("modal")
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
    function (event) {

        if (event.key !== "Escape") {
            return;
        }


        document
            .querySelectorAll(".modal.open")
            .forEach(function (modal) {

                modal.classList.remove(
                    "open"
                );

            });


        document.body.style.overflow =
            "";

    }
);


/* =========================================
   COPY ORDER NUMBER
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
        element.textContent.trim();


    copyText(number);

}


/* =========================================
   COPY SUCCESS ORDER
========================================= */

function copySuccessOrder() {

    const element =
        document.getElementById(
            "successOrderNumber"
        );


    if (!element) {
        return;
    }


    const number =
        element.textContent.trim();


    copyText(number);

}


/* =========================================
   COPY TEXT
========================================= */

function copyText(text) {

    if (
        navigator.clipboard &&
        window.isSecureContext
    ) {

        navigator.clipboard
            .writeText(text)
            .then(function () {

                showToast(
                    "Номер заказа скопирован"
                );

            })
            .catch(function () {

                fallbackCopy(text);

            });

        return;

    }


    fallbackCopy(text);

}


/* =========================================
   FALLBACK COPY
========================================= */

function fallbackCopy(text) {

    const textarea =
        document.createElement(
            "textarea"
        );


    textarea.value =
        text;


    textarea.style.position =
        "fixed";

    textarea.style.opacity =
        "0";


    document.body.appendChild(
        textarea
    );


    textarea.select();


    try {

        document.execCommand(
            "copy"
        );

        showToast(
            "Номер заказа скопирован"
        );

    } catch (error) {

        showToast(
            "Не удалось скопировать"
        );

    }


    document.body.removeChild(
        textarea
    );

}


/* =========================================
   SCROLL
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
   FORMAT PRICE
========================================= */

function formatPrice(price) {

    return Number(price || 0)
        .toLocaleString("ru-RU");

}


/* =========================================
   ESCAPE HTML
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
   TOAST
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


    setTimeout(function () {

        toast.classList.add(
            "show"
        );

    }, 10);


    setTimeout(function () {

        toast.classList.remove(
            "show"
        );


        setTimeout(function () {

            if (toast.parentNode) {
                toast.remove();
            }

        }, 250);

    }, 2200);

}