/* =========================================================
   RUST MOBILE SHOP
   script.js
   ========================================================= */


/* =========================================================
   TELEGRAM
   ========================================================= */

const TELEGRAM_SELLER = "luxanixx";


/* =========================================================
   ADMIN
   ВАЖНО:
   такой пароль нельзя считать настоящей защитой,
   потому что GitHub Pages отдаёт JS пользователю.
   ========================================================= */

const ADMIN_LOGIN = "AkashiSK8";
const ADMIN_PASSWORD = "CHANGE_ME";


/* =========================================================
   PRODUCTS
   ========================================================= */

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


/* =========================================================
   CART
   ========================================================= */

let cart = loadJSON("rustCart", []);


/* =========================================================
   START
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    showCategory(
        "coins",
        document.querySelector(".category")
    );

    updateCart();
    renderOrders();
    updateProfile();

});


/* =========================================================
   CATEGORY
   ========================================================= */

function showCategory(category, button) {

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


    if (!products[category]) {

        container.innerHTML = `
            <div class="empty">
                Категория не найдена
            </div>
        `;

        return;
    }


    container.innerHTML = "";


    products[category].forEach(function (product) {

        container.innerHTML +=
            createProductHTML(product);

    });

}


/* =========================================================
   PRODUCT HTML
   ========================================================= */

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
                    type="button"
                    onclick="addToCart('${escapeJS(product.id)}')"
                >
                    🛒 Купить
                </button>

            </div>

        </article>
    `;

}


/* =========================================================
   FIND PRODUCT
   ========================================================= */

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


/* =========================================================
   ADD CART
   ========================================================= */

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

        price: Number(product.price),

        description: product.description

    });


    saveCart();

    updateCart();

    showToast(
        "Товар добавлен в корзину"
    );

}


/* =========================================================
   REMOVE CART
   ========================================================= */

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


/* =========================================================
   SAVE CART
   ========================================================= */

function saveCart() {

    localStorage.setItem(
        "rustCart",
        JSON.stringify(cart)
    );

}


/* =========================================================
   UPDATE CART
   ========================================================= */

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


/* =========================================================
   OPEN CART
   ========================================================= */

function openCart() {

    renderCart();

    openModal("cartModal");

}


/* =========================================================
   RENDER CART
   ========================================================= */

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


    cart.forEach(function (item, index) {

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
                    type="button"
                    class="cart-remove"
                    onclick="removeFromCart(${index})"
                >
                    🗑
                </button>

            </div>

        `;

    });


    totalElement.textContent =
        formatPrice(total) + " ₽";

}


/* =========================================================
   CHECKOUT
   ========================================================= */

function checkout() {

    if (!cart.length) {

        showToast(
            "Корзина пустая"
        );

        return;

    }


    const savedContact =
        localStorage.getItem(
            "rustContact"
        );


    const contactInput =
        document.getElementById(
            "checkoutPlayerId"
        );


    if (
        contactInput &&
        savedContact
    ) {

        contactInput.value =
            savedContact;

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


/* =========================================================
   GENERATE ORDER NUMBER
   ========================================================= */

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


/* =========================================================
   RENDER CHECKOUT ITEMS
   ========================================================= */

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


    totalElement.textContent =
        formatPrice(total) + " ₽";

}


/* =========================================================
   CREATE ORDER
   ========================================================= */

function createOrder() {

    const contactInput =
        document.getElementById(
            "checkoutPlayerId"
        );


    const commentInput =
        document.getElementById(
            "checkoutComment"
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


    const contact =
        contactInput
            ? contactInput.value.trim()
            : "";


    const comment =
        commentInput
            ? commentInput.value.trim()
            : "";


    const paymentValue =
        paymentInput
            ? paymentInput.value
            : "card";


    const agreement =
        agreementInput
            ? agreementInput.checked
            : false;


    const orderNumber =
        orderNumberElement
            ? orderNumberElement.textContent.trim()
            : generateOrderNumber();


    /* CONTACT */

    if (!contact) {

        showToast(
            "Введите Почту / WeChat ID"
        );


        if (contactInput) {

            contactInput.focus();

        }


        return;

    }


    /* AGREEMENT */

    if (!agreement) {

        showToast(
            "Подтвердите правильность данных"
        );

        return;

    }


    /* TOTAL */

    let total = 0;


    cart.forEach(function (item) {

        total +=
            Number(item.price) || 0;

    });


    /* PAYMENT */

    const paymentNames = {

        card: "Банковская карта",

        sbp: "СБП",

        crypto: "Криптовалюта"

    };


    const paymentName =
        paymentNames[paymentValue] ||
        "Не указан";


    /* DATE */

    const now =
        new Date();


    const date =
        now.toLocaleDateString(
            "ru-RU"
        );


    const time =
        now.toLocaleTimeString(
            "ru-RU",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );


    /* ITEMS */

    const itemsText =
        cart
            .map(function (item) {

                return (
                    item.name +
                    " — " +
                    formatPrice(item.price) +
                    " ₽"
                );

            })
            .join("\n");


    /* ORDER OBJECT */

    const order = {

        id: orderNumber,

        contact: contact,

        items: cart.map(function (item) {

            return {

                id: item.id,

                name: item.name,

                price: item.price,

                description:
                    item.description

            };

        }),

        total: total,

        paymentMethod:
            paymentName,

        comment:
            comment,

        status:
            "Новый",

        date:
            now.toISOString()

    };


    /* SAVE CONTACT */

    localStorage.setItem(
        "rustContact",
        contact
    );


    /* SAVE ORDER */

    let orders =
        loadJSON(
            "rustOrders",
            []
        );


    if (!Array.isArray(orders)) {

        orders = [];

    }


    orders.unshift(order);


    localStorage.setItem(
        "rustOrders",
        JSON.stringify(orders)
    );


    /* SUCCESS */

    const successNumber =
        document.getElementById(
            "successOrderNumber"
        );


    const successContact =
        document.getElementById(
            "successPlayerId"
        );


    const successTotal =
        document.getElementById(
            "successTotal"
        );


    if (successNumber) {

        successNumber.textContent =
            orderNumber;

    }


    if (successContact) {

        successContact.textContent =
            contact;

    }


    if (successTotal) {

        successTotal.textContent =
            formatPrice(total) + " ₽";

    }


    /* TELEGRAM MESSAGE */

    const message =

`🛒 НОВЫЙ ЗАКАЗ

🔢 Номер заказа:
${orderNumber}

📦 Товар:
${itemsText}

💰 Сумма:
${formatPrice(total)} ₽

📧 Почта / WeChat ID:
${contact}

💳 Способ оплаты:
${paymentName}

📝 Комментарий:
${comment || "Нет"}

📅 Дата:
${date}

🕐 Время:
${time}

⏳ Статус:
Новый`;


    sessionStorage.setItem(
        "lastTelegramMessage",
        message
    );


    /* CLEAR CART */

    cart = [];

    saveCart();

    updateCart();

    renderOrders();

    updateProfile();


    /* CLOSE CHECKOUT */

    closeModal(
        "checkoutModal"
    );


    /* SUCCESS */

    openModal(
        "successModal"
    );


    /*
       Telegram открываем через небольшую задержку.
       Это удобнее на мобильном Safari.
    */

    setTimeout(function () {

        openTelegramSeller(message);

    }, 350);

}


/* =========================================================
   TELEGRAM
   ========================================================= */

function openTelegramSeller(message) {

    if (!message) {

        message =
            sessionStorage.getItem(
                "lastTelegramMessage"
            );

    }


    if (!message) {

        showToast(
            "Данные заказа не найдены"
        );

        return;

    }


    const encoded =
        encodeURIComponent(message);


    const url =
        "https://t.me/" +
        TELEGRAM_SELLER +
        "?text=" +
        encoded;


    window.location.href =
        url;

}


/* =========================================================
   OPEN LAST TELEGRAM
   ========================================================= */

function openLastTelegramOrder() {

    const message =
        sessionStorage.getItem(
            "lastTelegramMessage"
        );


    if (!message) {

        showToast(
            "Последний заказ не найден"
        );

        return;

    }


    openTelegramSeller(
        message
    );

}


/* =========================================================
   ORDERS
   ========================================================= */

function renderOrders() {

    const container =
        document.getElementById(
            "ordersList"
        );


    if (!container) {

        return;

    }


    const orders =
        loadJSON(
            "rustOrders",
            []
        );


    if (!Array.isArray(orders) ||
        !orders.length) {

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
            formatDate(order.date);


        container.innerHTML += `

            <div class="order-history-item">

                <div class="order-history-top">

                    <span class="order-history-number">
                        ${escapeHTML(
                            order.id
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

                    📧 Контакт:
                    ${escapeHTML(
                        order.contact ||
                        "Не указан"
                    )}

                    <br>

                    💰 Сумма:
                    ${formatPrice(
                        order.total
                    )} ₽

                    <br>

                    💳 Оплата:
                    ${escapeHTML(
                        order.paymentMethod ||
                        "Не указана"
                    )}

                    <br>

                    🕐 ${date}

                </div>

            </div>

        `;

    });

}


/* =========================================================
   PROFILE
   ========================================================= */

function updateProfile() {

    const contact =
        localStorage.getItem(
            "rustContact"
        ) ||
        "Не указан";


    const orders =
        loadJSON(
            "rustOrders",
            []
        );


    let spent = 0;


    if (Array.isArray(orders)) {

        orders.forEach(function (order) {

            spent +=
                Number(order.total) || 0;

        });

    }


    const profileId =
        document.getElementById(
            "profileId"
        );


    const profileOrders =
        document.getElementById(
            "profileOrders"
        );


    const profileSpent =
        document.getElementById(
            "profileSpent"
        );


    if (profileId) {

        profileId.textContent =
            contact;

    }


    if (profileOrders) {

        profileOrders.textContent =
            Array.isArray(orders)
                ? orders.length
                : 0;

    }


    if (profileSpent) {

        profileSpent.textContent =
            formatPrice(spent) +
            " ₽";

    }

}


/* =========================================================
   OPEN PROFILE
   ========================================================= */

function openProfile() {

    updateProfile();

    openModal(
        "profileModal"
    );

}


/* =========================================================
   OPEN ORDERS
   ========================================================= */

function openOrders() {

    renderOrders();

    closeModal(
        "profileModal"
    );

    openModal(
        "ordersModal"
    );

}


/* =========================================================
   SUPPORT
   ========================================================= */

function openSupport() {

    openModal(
        "supportModal"
    );

}


/* =========================================================
   MODALS
   ========================================================= */

function openModal(id) {

    const modal =
        document.getElementById(id);


    if (!modal) {

        console.warn(
            "Modal not found:",
            id
        );

        return;

    }


    modal.classList.add(
        "open"
    );


    document.body.style.overflow =
        "hidden";

}


function closeModal(id) {

    const modal =
        document.getElementById(id);


    if (!modal) {

        return;

    }


    modal.classList.remove(
        "open"
    );


    document.body.style.overflow =
        "";

}


/* =========================================================
   CLICK OUTSIDE
   ========================================================= */

document.addEventListener(
    "click",
    function (event) {

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


/* =========================================================
   ESC
   ========================================================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key !== "Escape"
        ) {

            return;

        }


        document
            .querySelectorAll(
                ".modal.open"
            )
            .forEach(function (modal) {

                modal.classList.remove(
                    "open"
                );

            });


        document.body.style.overflow =
            "";

    }
);


/* =========================================================
   COPY ORDER
   ========================================================= */

function copyOrderNumber() {

    const element =
        document.getElementById(
            "orderNumber"
        );


    if (!element) {

        return;

    }


    copyText(
        element.textContent
    );

}


function copySuccessOrder() {

    const element =
        document.getElementById(
            "successOrderNumber"
        );


    if (!element) {

        return;

    }


    copyText(
        element.textContent
    );

}


/* =========================================================
   COPY TEXT
   ========================================================= */

function copyText(text) {

    text =
        String(text || "");


    if (
        navigator.clipboard &&
        navigator.clipboard.writeText
    ) {

        navigator.clipboard
            .writeText(text)
            .then(function () {

                showToast(
                    "Скопировано"
                );

            })
            .catch(function () {

                fallbackCopy(text);

            });

        return;

    }


    fallbackCopy(text);

}


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


    textarea.focus();

    textarea.select();


    try {

        document.execCommand(
            "copy"
        );


        showToast(
            "Скопировано"
        );

    } catch (error) {

        showToast(
            "Не удалось скопировать"
        );

    }


    textarea.remove();

}


/* =========================================================
   SCROLL
   ========================================================= */

function scrollToSection(id) {

    const element =
        document.getElementById(id);


    if (!element) {

        return;

    }


    element.scrollIntoView({

        behavior: "smooth",

        block: "start"

    });

}


/* =========================================================
   ADMIN LOGIN
   ========================================================= */

function openAdminLogin() {

    closeModal(
        "profileModal"
    );


    const login =
        document.getElementById(
            "adminLogin"
        );


    const password =
        document.getElementById(
            "adminPassword"
        );


    const error =
        document.getElementById(
            "adminLoginError"
        );


    if (login) {

        login.value = "";

    }


    if (password) {

        password.value = "";

    }


    if (error) {

        error.textContent = "";

    }


    openModal(
        "adminLoginModal"
    );

}


/* =========================================================
   ADMIN LOGIN CHECK
   ========================================================= */

function loginAdmin() {

    const loginElement =
        document.getElementById(
            "adminLogin"
        );


    const passwordElement =
        document.getElementById(
            "adminPassword"
        );


    const error =
        document.getElementById(
            "adminLoginError"
        );


    const login =
        loginElement
            ? loginElement.value.trim()
            : "";


    const password =
        passwordElement
            ? passwordElement.value
            : "";


    if (
        login !== ADMIN_LOGIN ||
        password !== ADMIN_PASSWORD
    ) {

        if (error) {

            error.textContent =
                "Неверный логин или пароль";

        }


        return;

    }


    sessionStorage.setItem(
        "rustAdminLoggedIn",
        "true"
    );


    closeModal(
        "adminLoginModal"
    );


    openAdminPanel();

}


/* =========================================================
   ADMIN PANEL
   ========================================================= */

function openAdminPanel() {

    if (
        sessionStorage.getItem(
            "rustAdminLoggedIn"
        ) !== "true"
    ) {

        openAdminLogin();

        return;

    }


    renderAdminOrders();

    openModal(
        "adminModal"
    );

}


/* =========================================================
   ADMIN REFRESH
   ========================================================= */

function refreshAdminOrders() {

    renderAdminOrders();

    showToast(
        "Заказы обновлены"
    );

}


/* =========================================================
   GET ADMIN ORDERS
   ========================================================= */

function getAdminOrders() {

    const orders =
        loadJSON(
            "rustOrders",
            []
        );


    return Array.isArray(orders)
        ? orders
        : [];

}


/* =========================================================
   RENDER ADMIN
   ========================================================= */

function renderAdminOrders() {

    const orders =
        getAdminOrders();


    const totalElement =
        document.getElementById(
            "adminTotalOrders"
        );


    const newElement =
        document.getElementById(
            "adminNewOrders"
        );


    const waitingElement =
        document.getElementById(
            "adminWaitingOrders"
        );


    const completedElement =
        document.getElementById(
            "adminCompletedOrders"
        );


    const list =
        document.getElementById(
            "adminOrdersList"
        );


    if (!list) {

        return;

    }


    const newCount =
        orders.filter(function (order) {

            return order.status === "Новый";

        }).length;


    const waitingCount =
        orders.filter(function (order) {

            return (
                order.status ===
                "Ожидает оплаты"
            );

        }).length;


    const completedCount =
        orders.filter(function (order) {

            return (
                order.status ===
                "Выполнен"
            );

        }).length;


    if (totalElement) {

        totalElement.textContent =
            orders.length;

    }


    if (newElement) {

        newElement.textContent =
            newCount;

    }


    if (waitingElement) {

        waitingElement.textContent =
            waitingCount;

    }


    if (completedElement) {

        completedElement.textContent =
            completedCount;

    }


    if (!orders.length) {

        list.innerHTML = `

            <div class="admin-empty">

                📦

                <br><br>

                Заказов пока нет

            </div>

        `;

        return;

    }


    list.innerHTML = "";


    orders.forEach(function (order, index) {

        const items =
            Array.isArray(order.items)
                ? order.items
                    .map(function (item) {

                        return escapeHTML(
                            item.name
                        );

                    })
                    .join(", ")
                : "—";


        const date =
            formatDate(
                order.date
            );


        list.innerHTML += `

            <div class="admin-order">

                <div class="admin-order-top">

                    <span class="admin-order-number">

                        ${escapeHTML(
                            order.id ||
                            "Без номера"
                        )}

                    </span>


                    <span class="admin-order-status">

                        ${escapeHTML(
                            order.status ||
                            "Новый"
                        )}

                    </span>

                </div>


                <div class="admin-order-info">

                    <div>

                        📦

                        <strong>
                            Товар:
                        </strong>

                        ${items}

                    </div>


                    <div>

                        💰

                        <strong>
                            Сумма:
                        </strong>

                        ${formatPrice(
                            order.total
                        )} ₽

                    </div>


                    <div>

                        📧

                        <strong>
                            WeChat / Email:
                        </strong>

                        ${escapeHTML(
                            order.contact ||
                            "Не указан"
                        )}

                    </div>


                    <div>

                        💳

                        <strong>
                            Оплата:
                        </strong>

                        ${escapeHTML(
                            order.paymentMethod ||
                            "Не указана"
                        )}

                    </div>


                    <div>

                        🕐

                        <strong>
                            Дата:
                        </strong>

                        ${date}

                    </div>


                    ${
                        order.comment
                            ? `
                                <div>
                                    📝
                                    <strong>
                                        Комментарий:
                                    </strong>
                                    ${escapeHTML(
                                        order.comment
                                    )}
                                </div>
                              `
                            : ""
                    }

                </div>


                <div class="admin-order-actions">

                    <select
                        onchange="
                            changeOrderStatus(
                                ${index},
                                this.value
                            )
                        "
                    >

                        <option
                            value="Новый"
                            ${
                                order.status ===
                                "Новый"
                                    ? "selected"
                                    : ""
                            }
                        >
                            Новый
                        </option>


                        <option
                            value="Ожидает оплаты"
                            ${
                                order.status ===
                                "Ожидает оплаты"
                                    ? "selected"
                                    : ""
                            }
                        >
                            Ожидает оплаты
                        </option>


                        <option
                            value="Оплачен"
                            ${
                                order.status ===
                                "Оплачен"
                                    ? "selected"
                                    : ""
                            }
                        >
                            Оплачен
                        </option>


                        <option
                            value="Выполнен"
                            ${
                                order.status ===
                                "Выполнен"
                                    ? "selected"
                                    : ""
                            }
                        >
                            Выполнен
                        </option>


                        <option
                            value="Отменён"
                            ${
                                order.status ===
                                "Отменён"
                                    ? "selected"
                                    : ""
                            }
                        >
                            Отменён
                        </option>

                    </select>


                    <button
                        type="button"
                        onclick="copyText('${escapeJS(
                            order.id || ""
                        )}')"
                    >
                        📋 Номер
                    </button>


                    <button
                        type="button"
                        onclick="deleteAdminOrder(${index})"
                    >
                        🗑 Удалить
                    </button>

                </div>

            </div>

        `;

    });

}


/* =========================================================
   CHANGE ORDER STATUS
   ========================================================= */

function changeOrderStatus(index, status) {

    const orders =
        getAdminOrders();


    if (
        index < 0 ||
        index >= orders.length
    ) {

        return;

    }


    orders[index].status =
        status;


    localStorage.setItem(
        "rustOrders",
        JSON.stringify(orders)
    );


    renderAdminOrders();

    renderOrders();

    showToast(
        "Статус заказа изменён"
    );

}


/* =========================================================
   DELETE ADMIN ORDER
   ========================================================= */

function deleteAdminOrder(index) {

    const orders =
        getAdminOrders();


    if (
        index < 0 ||
        index >= orders.length
    ) {

        return;

    }


    const confirmed =
        window.confirm(
            "Удалить этот заказ?"
        );


    if (!confirmed) {

        return;

    }


    orders.splice(
        index,
        1
    );


    localStorage.setItem(
        "rustOrders",
        JSON.stringify(orders)
    );


    renderAdminOrders();

    renderOrders();

    updateProfile();


    showToast(
        "Заказ удалён"
    );

}


/* =========================================================
   CLEAR ADMIN ORDERS
   ========================================================= */

function clearAdminOrders() {

    const confirmed =
        window.confirm(
            "Удалить ВСЮ историю заказов?"
        );


    if (!confirmed) {

        return;

    }


    localStorage.removeItem(
        "rustOrders"
    );


    renderAdminOrders();

    renderOrders();

    updateProfile();


    showToast(
        "История заказов очищена"
    );

}


/* =========================================================
   SECRET ADMIN KEY
   ========================================================= */

let adminKeys = "";


document.addEventListener(
    "keydown",
    function (event) {

        if (
            !event.key ||
            event.key.length !== 1
        ) {

            return;

        }


        adminKeys +=
            event.key.toUpperCase();


        if (
            adminKeys.length > 30
        ) {

            adminKeys =
                adminKeys.slice(-30);

        }


        if (
            adminKeys.includes(
                "AKASHISK8"
            )
        ) {

            adminKeys = "";

            openAdminLogin();

        }

    }
);


/* =========================================================
   TOAST
   ========================================================= */

function showToast(message) {

    const oldToast =
        document.querySelector(
            ".toast"
        );


    if (oldToast) {

        oldToast.remove();

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


/* =========================================================
   FORMAT PRICE
   ========================================================= */

function formatPrice(price) {

    return Number(price || 0)
        .toLocaleString("ru-RU");

}


/* =========================================================
   FORMAT DATE
   ========================================================= */

function formatDate(date) {

    if (!date) {

        return "—";

    }


    const parsed =
        new Date(date);


    if (
        Number.isNaN(
            parsed.getTime()
        )
    ) {

        return "—";

    }


    return parsed.toLocaleString(
        "ru-RU"
    );

}


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHTML(value) {

    return String(value ?? "")

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================================
   ESCAPE JS
   ========================================================= */

function escapeJS(value) {

    return String(value ?? "")

        .replace(
            /\\/g,
            "\\\\"
        )

        .replace(
            /'/g,
            "\\'"
        )

        .replace(
            /\r/g,
            "\\r"
        )

        .replace(
            /\n/g,
            "\\n"
        );

}


/* =========================================================
   LOAD JSON
   ========================================================= */

function loadJSON(key, fallback) {

    try {

        const value =
            localStorage.getItem(key);


        if (!value) {

            return fallback;

        }


        const parsed =
            JSON.parse(value);


        return parsed;

    } catch (error) {

        console.error(
            "Ошибка чтения localStorage:",
            error
        );


        return fallback;

    }

}