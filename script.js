/* =========================================
   TELEGRAM
========================================= */

/*
    СЮДА ПОТОМ ВСТАВИМ URL GOOGLE APPS SCRIPT.

    Например:

    const TELEGRAM_API =
        "https://script.google.com/macros/s/XXXXXXXX/exec";
*/

const https://script.google.com/macros/s/AKfycbwiX84qNk35rApQRrv3OZzvWVjXQhI_5tkuD5T9_ZnpqS_qKppVXANPfk55E04OBL04/exec = "";


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

let cart =
    JSON.parse(
        localStorage.getItem("rustCart") || "[]"
    );


/* =========================================
   START
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        showCategory(
            "coins",
            document.querySelector(".category")
        );

        updateCart();

        renderOrders();

        updateProfile();

    }
);


/* =========================================
   CATEGORY
========================================= */

function showCategory(
    category,
    button
) {

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


    container.innerHTML = "";


    products[category].forEach(product => {

        container.innerHTML +=
            createProductHTML(product);

    });

}


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
                ${product.name}
            </h3>


            <div class="product-description">
                ${product.description}
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
   FIND PRODUCT
========================================= */

function findProduct(id) {

    for (
        const category in products
    ) {

        const product =
            products[category]
                .find(item => item.id === id);


        if (product) {

            return product;

        }

    }

    return null;

}


/* =========================================
   ADD CART
========================================= */

function addToCart(id) {

    const product =
        findProduct(id);


    if (!product) {

        return;

    }


    cart.push({
        ...product
    });


    saveCart();

    updateCart();

    showToast(
        "Товар добавлен в корзину"
    );

}


/* =========================================
   REMOVE CART
========================================= */

function removeFromCart(index) {

    cart.splice(
        index,
        1
    );


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
        document.getElementById(
            "cartCount"
        );


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

    openModal(
        "cartModal"
    );

}


/* =========================================
   RENDER CART
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

            total += item.price;


            container.innerHTML += `

                <div class="cart-item">

                    <div class="cart-item-info">

                        <strong>
                            ${item.name}
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


    if (savedId) {

        document
            .getElementById(
                "checkoutPlayerId"
            )
            .value = savedId;

    }


    const orderNumber =
        generateOrderNumber();


    document
        .getElementById(
            "orderNumber"
        )
        .textContent =
            orderNumber;


    renderCheckoutItems();


    closeModal(
        "cartModal"
    );


    openModal(
        "checkoutModal"
    );

}


/* =========================================
   ORDER NUMBER
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


    return `RM-${year}${month}${day}-${random}`;

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


    container.innerHTML = "";


    let total = 0;


    cart.forEach(item => {

        total += item.price;


        container.innerHTML += `

            <div class="checkout-item">

                <span class="checkout-item-name">
                    ${item.name}
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
   CREATE ORDER
========================================= */

function createOrder() {

    const playerId =
        document
            .getElementById(
                "checkoutPlayerId"
            )
            .value
            .trim();


    const paymentMethod =
        document
            .getElementById(
                "paymentMethod"
            )
            .value;


    const agreement =
        document
            .getElementById(
                "agreement"
            )
            .checked;


    const orderNumber =
        document
            .getElementById(
                "orderNumber"
            )
            .textContent;


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

        total += item.price;

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


    const order = {

        id: orderNumber,

        playerId: playerId,

        items: [...cart],

        total: total,

        paymentMethod:
            paymentNames[paymentMethod],

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


    /*
        Отправляем заказ продавцу.
    */

    sendOrderToTelegram(
        order
    );


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
   SEND TELEGRAM
========================================= */

function sendOrderToTelegram(order) {

    /*
        Если URL ещё не указан —
        просто пропускаем отправку.
    */

    if (!TELEGRAM_API) {

        console.warn(
            "Telegram API URL не указан"
        );

        return;

    }


    const items =
        order.items
            .map(item => {

                return `${item.name} — ${formatPrice(item.price)} ₽`;

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


    /*
        no-cors нужен для Google Apps Script.
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
    .then(() => {

        console.log(
            "Заказ отправлен в Telegram"
        );

    })
    .catch(error => {

        console.error(
            "Telegram error:",
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
                        ${order.id}
                    </span>

                    <span class="order-history-status">
                        ${order.status}
                    </span>

                </div>


                <div class="order-history-info">

                    🎮 ID:
                    ${order.playerId}

                    <br>

                    💰 Сумма:
                    ${formatPrice(order.total)} ₽

                    <br>

                    💳 Оплата:
                    ${order.paymentMethod}

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
   OPEN PROFILE
========================================= */

function openProfile() {

    updateProfile();

    openModal(
        "profileModal"
    );

}


/* =========================================
   OPEN ORDERS
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


    if (modal) {

        modal.classList.add("open");

        document.body.style.overflow =
            "hidden";

    }

}


function closeModal(id) {

    const modal =
        document.getElementById(id);


    if (modal) {

        modal.classList.remove("open");

        document.body.style.overflow =
            "";

    }

}


/* =========================================
   CLICK OUTSIDE MODAL
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
   COPY
========================================= */

function copyOrderNumber() {

    const number =
        document
            .getElementById(
                "orderNumber"
            )
            .textContent;


    navigator.clipboard
        .writeText(number)
        .then(() => {

            showToast(
                "Номер заказа скопирован"
            );

        });

}


function copySuccessOrder() {

    const number =
        document
            .getElementById(
                "successOrderNumber"
            )
            .textContent;


    navigator.clipboard
        .writeText(number)
        .then(() => {

            showToast(
                "Номер заказа скопирован"
            );

        });

}


/* =========================================
   SCROLL
========================================= */

function scrollToSection(id) {

    const element =
        document.getElementById(id);


    if (element) {

        element.scrollIntoView({
            behavior: "smooth"
        });

    }

}


/* =========================================
   FORMAT PRICE
========================================= */

function formatPrice(price) {

    return Number(price)
        .toLocaleString(
            "ru-RU"
        );

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

            toast.remove();

        }, 250);

    }, 2200);

}