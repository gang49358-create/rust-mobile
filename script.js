/* =====================================================
   RUST MOBILE SHOP
   COMPLETE SCRIPT
===================================================== */


/* =====================================================
   SETTINGS
===================================================== */

const TELEGRAM_SELLER = "luxanixx";

const ADMIN_LOGIN = "AkashiSK8";

/*
   ВАЖНО:
   Для настоящего магазина такой пароль на клиентском
   JavaScript не является безопасной защитой.
   Это подходит только для текущей статической версии.
*/
const ADMIN_PASSWORD = "AKASHI2026";


/* =====================================================
   PRODUCTS
===================================================== */

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


/* =====================================================
   PROMOCODES
===================================================== */

const promoCodes = {

    RUST10: 10,

    AKASHI: 15,

    RUSTSHOP: 5

};


let activePromo = null;


/* =====================================================
   STATE
===================================================== */

let cart =
    JSON.parse(
        localStorage.getItem("rustCart") || "[]"
    );

let currentCategory = "coins";


/* =====================================================
   START
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        showCategory(
            "coins",
            document.querySelector(".category")
        );

        updateCart();

        renderOrders();

        updateProfile();

        preparePromo();

        prepareAdmin();

    }
);


/* =====================================================
   CATEGORY
===================================================== */

function showCategory(
    category,
    button
) {

    currentCategory = category;


    document
        .querySelectorAll(".category")
        .forEach(
            item => {
                item.classList.remove("active");
            }
        );


    if (button) {
        button.classList.add("active");
    }


    filterProducts();

}


/* =====================================================
   FILTER PRODUCTS
===================================================== */

function filterProducts() {

    const container =
        document.getElementById(
            "products"
        );

    if (!container) {
        return;
    }


    const searchInput =
        document.getElementById(
            "productSearch"
        );


    const sortInput =
        document.getElementById(
            "sortProducts"
        );


    const search =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";


    const sort =
        sortInput
            ? sortInput.value
            : "default";


    let list =
        products[currentCategory]
            ? [...products[currentCategory]]
            : [];


    if (search) {

        list =
            list.filter(
                product =>
                    product.name
                        .toLowerCase()
                        .includes(search) ||

                    product.description
                        .toLowerCase()
                        .includes(search)
            );

    }


    if (sort === "cheap") {

        list.sort(
            (a, b) =>
                a.price - b.price
        );

    }


    if (sort === "expensive") {

        list.sort(
            (a, b) =>
                b.price - a.price
        );

    }


    if (!list.length) {

        container.innerHTML = `
            <div class="empty">
                🔎
                <br><br>
                Ничего не найдено
            </div>
        `;

        return;
    }


    container.innerHTML = "";


    list.forEach(
        (product, index) => {

            const element =
                document.createElement(
                    "article"
                );

            element.className =
                "product";

            element.style.animationDelay =
                `${index * 0.06}s`;


            element.innerHTML =
                createProductHTML(
                    product
                );


            container.appendChild(
                element
            );

        }
    );

}


/* =====================================================
   PRODUCT HTML
===================================================== */

function createProductHTML(product) {

    return `

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

    `;
}


/* =====================================================
   FIND PRODUCT
===================================================== */

function findProduct(id) {

    for (
        const category in products
    ) {

        const product =
            products[category].find(
                item =>
                    item.id === id
            );


        if (product) {
            return product;
        }

    }

    return null;
}


/* =====================================================
   ADD CART
===================================================== */

function addToCart(id) {

    const product =
        findProduct(id);


    if (!product) {

        showToast(
            "Товар не найден"
        );

        return;
    }


    cart.push({

        id: product.id,

        name: product.name,

        price: product.price,

        description:
            product.description

    });


    saveCart();

    updateCart();

    animateCart();

    showToast(
        `${product.name} добавлен в корзину`
    );

}


/* =====================================================
   REMOVE CART
===================================================== */

function removeFromCart(index) {

    if (
        index < 0 ||
        index >= cart.length
    ) {
        return;
    }


    cart.splice(
        index,
        1
    );


    saveCart();

    updateCart();

    renderCart();

}


/* =====================================================
   SAVE CART
===================================================== */

function saveCart() {

    localStorage.setItem(
        "rustCart",
        JSON.stringify(cart)
    );

}


/* =====================================================
   UPDATE CART
===================================================== */

function updateCart() {

    const element =
        document.getElementById(
            "cartCount"
        );


    if (element) {

        element.textContent =
            cart.length;

    }

}


/* =====================================================
   CART ANIMATION
===================================================== */

function animateCart() {

    const cartButton =
        document.querySelector(
            ".cart-button"
        );


    if (!cartButton) {
        return;
    }


    cartButton.classList.remove(
        "cart-bump"
    );


    void cartButton.offsetWidth;


    cartButton.classList.add(
        "cart-bump"
    );

}


/* =====================================================
   OPEN CART
===================================================== */

function openCart() {

    renderCart();

    openModal(
        "cartModal"
    );

}


/* =====================================================
   CART TOTAL
===================================================== */

function calculateSubtotal() {

    return cart.reduce(
        (
            total,
            item
        ) => {

            return total +
                (
                    Number(item.price) || 0
                );

        },
        0
    );

}


function getDiscount(
    subtotal
) {

    if (
        !activePromo ||
        !promoCodes[activePromo]
    ) {
        return 0;
    }


    const percent =
        promoCodes[activePromo];


    return Math.round(
        subtotal *
        percent /
        100
    );

}


function getFinalTotal() {

    const subtotal =
        calculateSubtotal();


    const discount =
        getDiscount(
            subtotal
        );


    return Math.max(
        0,
        subtotal - discount
    );

}


/* =====================================================
   RENDER CART
===================================================== */

function renderCart() {

    const container =
        document.getElementById(
            "cartItems"
        );


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

    } else {

        container.innerHTML = "";


        cart.forEach(
            (
                item,
                index
            ) => {

                container.innerHTML += `

                    <div class="cart-item">

                        <div class="cart-item-info">

                            <strong>
                                ${escapeHTML(
                                    item.name
                                )}
                            </strong>

                            <span>
                                ${formatPrice(
                                    item.price
                                )} ₽
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

    }


    const subtotal =
        calculateSubtotal();


    const discount =
        getDiscount(
            subtotal
        );


    const total =
        Math.max(
            0,
            subtotal - discount
        );


    const subtotalElement =
        document.getElementById(
            "cartSubtotal"
        );


    const discountElement =
        document.getElementById(
            "cartDiscount"
        );


    const totalElement =
        document.getElementById(
            "cartTotal"
        );


    const discountRow =
        document.getElementById(
            "discountRow"
        );


    if (subtotalElement) {

        subtotalElement.textContent =
            formatPrice(
                subtotal
            ) + " ₽";

    }


    if (discountElement) {

        discountElement.textContent =
            "-" +
            formatPrice(
                discount
            ) +
            " ₽";

    }


    if (totalElement) {

        totalElement.textContent =
            formatPrice(
                total
            ) + " ₽";

    }


    if (discountRow) {

        discountRow.classList.toggle(
            "hidden",
            discount <= 0
        );

    }

}


/* =====================================================
   PROMO
===================================================== */

function preparePromo() {

    const saved =
        localStorage.getItem(
            "rustPromo"
        );


    if (
        saved &&
        promoCodes[saved]
    ) {

        activePromo =
            saved;

    }

}


function applyPromo() {

    const input =
        document.getElementById(
            "promoInput"
        );


    const message =
        document.getElementById(
            "promoMessage"
        );


    if (!input) {
        return;
    }


    const code =
        input.value
            .trim()
            .toUpperCase();


    if (!code) {

        if (message) {

            message.textContent =
                "Введите промокод";

        }

        return;
    }


    if (
        promoCodes[code]
    ) {

        activePromo =
            code;


        localStorage.setItem(
            "rustPromo",
            code
        );


        if (message) {

            message.textContent =
                `✓ Промокод применён: -${promoCodes[code]}%`;

        }


        showToast(
            `Скидка ${promoCodes[code]}% применена`
        );


        renderCart();

        return;
    }


    activePromo =
        null;


    localStorage.removeItem(
        "rustPromo"
    );


    if (message) {

        message.textContent =
            "✕ Такой промокод не найден";

    }


    renderCart();

}


/* =====================================================
   CHECKOUT
===================================================== */

function checkout() {

    if (!cart.length) {

        showToast(
            "Корзина пустая"
        );

        return;
    }


    const contact =
        document.getElementById(
            "checkoutContact"
        );


    const savedContact =
        localStorage.getItem(
            "rustContact"
        );


    if (
        contact &&
        savedContact
    ) {

        contact.value =
            savedContact;

    }


    const orderNumber =
        generateOrderNumber();


    const numberElement =
        document.getElementById(
            "orderNumber"
        );


    if (numberElement) {

        numberElement.textContent =
            orderNumber;

    }


    renderCheckoutItems();


    closeModal(
        "cartModal"
    );


    openModal(
        "checkoutModal"
    );

}


/* =====================================================
   ORDER NUMBER
===================================================== */

function generateOrderNumber() {

    const now =
        new Date();


    const year =
        now.getFullYear();


    const month =
        String(
            now.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const day =
        String(
            now.getDate()
        ).padStart(
            2,
            "0"
        );


    const random =
        Math.floor(
            100000 +
            Math.random() *
            900000
        );


    return `RM-${year}${month}${day}-${random}`;

}


/* =====================================================
   CHECKOUT ITEMS
===================================================== */

function renderCheckoutItems() {

    const container =
        document.getElementById(
            "checkoutItems"
        );


    const totalElement =
        document.getElementById(
            "checkoutTotal"
        );


    const discountElement =
        document.getElementById(
            "checkoutDiscount"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    cart.forEach(
        item => {

            container.innerHTML += `

                <div class="checkout-item">

                    <span>
                        ${escapeHTML(
                            item.name
                        )}
                    </span>

                    <strong>
                        ${formatPrice(
                            item.price
                        )} ₽
                    </strong>

                </div>

            `;

        }
    );


    const subtotal =
        calculateSubtotal();


    const discount =
        getDiscount(
            subtotal
        );


    const total =
        subtotal - discount;


    if (discountElement) {

        discountElement.textContent =
            "-" +
            formatPrice(
                discount
            ) +
            " ₽";

    }


    if (totalElement) {

        totalElement.textContent =
            formatPrice(
                total
            ) + " ₽";

    }

}


/* =====================================================
   CREATE ORDER
===================================================== */

function createOrder() {

    const contactElement =
        document.getElementById(
            "checkoutContact"
        );


    const commentElement =
        document.getElementById(
            "checkoutComment"
        );


    const paymentElement =
        document.getElementById(
            "paymentMethod"
        );


    const agreementElement =
        document.getElementById(
            "agreement"
        );


    const orderElement =
        document.getElementById(
            "orderNumber"
        );


    const contact =
        contactElement
            ? contactElement.value.trim()
            : "";


    const comment =
        commentElement
            ? commentElement.value.trim()
            : "";


    const payment =
        paymentElement
            ? paymentElement.value
            : "card";


    if (!contact) {

        showToast(
            "Введите почту или WeChat ID"
        );

        if (contactElement) {
            contactElement.focus();
        }

        return;
    }


    if (
        agreementElement &&
        !agreementElement.checked
    ) {

        showToast(
            "Подтвердите данные заказа"
        );

        return;
    }


    const orderNumber =
        orderElement
            ? orderElement.textContent
            : generateOrderNumber();


    const subtotal =
        calculateSubtotal();


    const discount =
        getDiscount(
            subtotal
        );


    const total =
        subtotal - discount;


    const paymentNames = {

        card: "Банковская карта",

        sbp: "СБП",

        crypto: "Криптовалюта"

    };


    const paymentName =
        paymentNames[payment] ||
        payment;


    const now =
        new Date();


    const order = {

        id:
            orderNumber,

        items:
            [...cart],

        subtotal:
            subtotal,

        discount:
            discount,

        total:
            total,

        promo:
            activePromo || "",

        contact:
            contact,

        comment:
            comment,

        paymentMethod:
            paymentName,

        status:
            "Новый",

        date:
            now.toISOString()

    };


    let orders =
        JSON.parse(
            localStorage.getItem(
                "rustOrders"
            ) || "[]"
        );


    orders.unshift(
        order
    );


    localStorage.setItem(
        "rustOrders",
        JSON.stringify(
            orders
        )
    );


    localStorage.setItem(
        "rustContact",
        contact
    );


    const itemsText =
        cart
            .map(
                item =>
                    `${item.name} — ${formatPrice(item.price)} ₽`
            )
            .join("\n");


    const message =
`🛒 НОВЫЙ ЗАКАЗ

🔢 Номер:
${orderNumber}

📦 Товары:
${itemsText}

💰 Сумма:
${formatPrice(total)} ₽

🏷️ Промокод:
${activePromo || "Нет"}

📉 Скидка:
${formatPrice(discount)} ₽

📧 Почта / WeChat:
${contact}

💳 Оплата:
${paymentName}

📝 Комментарий:
${comment || "Нет"}

📅 Дата:
${now.toLocaleDateString("ru-RU")}

🕐 Время:
${now.toLocaleTimeString(
    "ru-RU",
    {
        hour: "2-digit",
        minute: "2-digit"
    }
)}

⏳ Статус:
Новый`;


    sessionStorage.setItem(
        "lastTelegramMessage",
        message
    );


    const successNumber =
        document.getElementById(
            "successOrderNumber"
        );


    const successContact =
        document.getElementById(
            "successContact"
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
            formatPrice(
                total
            ) + " ₽";

    }


    const telegram =
        document.getElementById(
            "successTelegram"
        );


    if (telegram) {

        telegram.href =
            `https://t.me/${TELEGRAM_SELLER}?text=${encodeURIComponent(message)}`;

    }


    cart = [];


    saveCart();

    updateCart();

    renderOrders();

    updateProfile();


    closeModal(
        "checkoutModal"
    );


    activePromo =
        null;


    localStorage.removeItem(
        "rustPromo"
    );


    setTimeout(
        () => {

            openModal(
                "successModal"
            );

        },
        250
    );

}


/* =====================================================
   PROFILE
===================================================== */

function openProfile() {

    updateProfile();

    openModal(
        "profileModal"
    );

}


function updateProfile() {

    const orders =
        getOrders();


    let spent = 0;


    orders.forEach(
        order => {

            spent +=
                Number(
                    order.total
                ) || 0;

        }
    );


    const ordersElement =
        document.getElementById(
            "profileOrders"
        );


    const spentElement =
        document.getElementById(
            "profileSpent"
        );


    if (ordersElement) {

        ordersElement.textContent =
            orders.length;

    }


    if (spentElement) {

        spentElement.textContent =
            formatPrice(
                spent
            ) + " ₽";

    }

}


/* =====================================================
   ORDERS
===================================================== */

function getOrders() {

    const orders =
        JSON.parse(
            localStorage.getItem(
                "rustOrders"
            ) || "[]"
        );


    return Array.isArray(
        orders
    )
        ? orders
        : [];

}


function openOrders() {

    renderOrders();

    closeModal(
        "profileModal"
    );

    openModal(
        "ordersModal"
    );

}


function renderOrders() {

    const container =
        document.getElementById(
            "ordersList"
        );


    if (!container) {
        return;
    }


    const orders =
        getOrders();


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


    orders.forEach(
        order => {

            const date =
                new Date(
                    order.date
                ).toLocaleString(
                    "ru-RU"
                );


            const items =
                Array.isArray(
                    order.items
                )
                    ? order.items
                        .map(
                            item =>
                                escapeHTML(
                                    item.name
                                )
                        )
                        .join(", ")
                    : "—";


            container.innerHTML += `

                <div class="order-card">

                    <div class="order-top">

                        <span class="order-number">
                            ${escapeHTML(
                                order.id
                            )}
                        </span>

                        <span class="status">
                            ${escapeHTML(
                                order.status ||
                                "Новый"
                            )}
                        </span>

                    </div>


                    <div class="order-info">

                        📦 ${items}

                        <br>

                        💰 ${formatPrice(
                            order.total
                        )} ₽

                        <br>

                        🕐 ${date}

                    </div>

                </div>

            `;

        }
    );

}


/* =====================================================
   SUPPORT
===================================================== */

function openSupport() {

    openModal(
        "supportModal"
    );

}


/* =====================================================
   ADMIN LOGIN
===================================================== */

function prepareAdmin() {

    const password =
        document.getElementById(
            "adminPassword"
        );


    if (password) {

        password.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Enter"
                ) {

                    loginAdmin();

                }

            }
        );

    }

}


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
                "✕ Неверный логин или пароль";

        }

        return;
    }


    if (error) {
        error.textContent = "";
    }


    closeModal(
        "adminLoginModal"
    );


    openAdminPanel();

}


/* =====================================================
   ADMIN PANEL
===================================================== */

function openAdminPanel() {

    renderAdminOrders();

    openModal(
        "adminModal"
    );

}


function refreshAdminOrders() {

    renderAdminOrders();

    showToast(
        "Заказы обновлены"
    );

}


function renderAdminOrders() {

    const orders =
        getOrders();


    const total =
        document.getElementById(
            "adminTotalOrders"
        );


    const newOrders =
        document.getElementById(
            "adminNewOrders"
        );


    const sales =
        document.getElementById(
            "adminSales"
        );


    const completed =
        document.getElementById(
            "adminCompletedOrders"
        );


    const list =
        document.getElementById(
            "adminOrdersList"
        );


    const searchElement =
        document.getElementById(
            "adminSearch"
        );


    const filterElement =
        document.getElementById(
            "adminStatusFilter"
        );


    if (!list) {
        return;
    }


    let filtered =
        [...orders];


    const search =
        searchElement
            ? searchElement.value
                .trim()
                .toLowerCase()
            : "";


    const filter =
        filterElement
            ? filterElement.value
            : "all";


    if (search) {

        filtered =
            filtered.filter(
                order => {

                    const text =
                        JSON.stringify(
                            order
                        ).toLowerCase();

                    return text.includes(
                        search
                    );

                }
            );

    }


    if (
        filter !== "all"
    ) {

        filtered =
            filtered.filter(
                order =>
                    order.status ===
                    filter
            );

    }


    let totalSales = 0;


    orders.forEach(
        order => {

            if (
                order.status !==
                "Отменён"
            ) {

                totalSales +=
                    Number(
                        order.total
                    ) || 0;

            }

        }
    );


    const newCount =
        orders.filter(
            order =>
                order.status ===
                "Новый"
        ).length;


    const completedCount =
        orders.filter(
            order =>
                order.status ===
                "Выполнен"
        ).length;


    if (total) {
        total.textContent =
            orders.length;
    }


    if (newOrders) {
        newOrders.textContent =
            newCount;
    }


    if (sales) {

        sales.textContent =
            formatPrice(
                totalSales
            ) + " ₽";

    }


    if (completed) {

        completed.textContent =
            completedCount;

    }


    if (!filtered.length) {

        list.innerHTML = `

            <div class="empty">

                📦

                <br><br>

                Заказов не найдено

            </div>

        `;

        return;
    }


    list.innerHTML = "";


    filtered.forEach(
        order => {

            const originalIndex =
                orders.indexOf(
                    order
                );


            const date =
                new Date(
                    order.date
                ).toLocaleString(
                    "ru-RU"
                );


            const items =
                Array.isArray(
                    order.items
                )
                    ? order.items
                        .map(
                            item =>
                                escapeHTML(
                                    item.name
                                )
                        )
                        .join(", ")
                    : "—";


            list.innerHTML += `

                <div class="admin-order">

                    <div class="admin-order-top">

                        <span
                            class="admin-order-number"
                        >
                            ${escapeHTML(
                                order.id ||
                                "Без номера"
                            )}
                        </span>


                        <span
                            class="admin-order-status"
                        >
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
                                Товары:
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
                                Контакт:
                            </strong>

                            ${escapeHTML(
                                order.contact ||
                                "Не указан"
                            )}
                        </div>


                        <div>
                            🏷️
                            <strong>
                                Промокод:
                            </strong>

                            ${escapeHTML(
                                order.promo ||
                                "Нет"
                            )}
                        </div>


                        <div>
                            🕐
                            <strong>
                                Дата:
                            </strong>

                            ${date}
                        </div>

                    </div>


                    <div
                        class="admin-order-actions"
                    >

                        <select
                            onchange="
                                changeOrderStatus(
                                    ${originalIndex},
                                    this.value
                                )
                            "
                        >

                            ${statusOption(
                                "Новый",
                                order.status
                            )}

                            ${statusOption(
                                "Ожидает оплаты",
                                order.status
                            )}

                            ${statusOption(
                                "Оплачен",
                                order.status
                            )}

                            ${statusOption(
                                "Выполнен",
                                order.status
                            )}

                            ${statusOption(
                                "Отменён",
                                order.status
                            )}

                        </select>


                        <button
                            onclick="
                                copyText(
                                    '${escapeJS(
                                        order.id
                                    )}'
                                )
                            "
                        >
                            📋 Номер
                        </button>


                        <button
                            onclick="
                                deleteAdminOrder(
                                    ${originalIndex}
                                )
                            "
                        >
                            🗑 Удалить
                        </button>

                    </div>

                </div>

            `;

        }
    );

}


function statusOption(
    value,
    current
) {

    return `

        <option
            value="${escapeHTML(value)}"
            ${value === current
                ? "selected"
                : ""
            }
        >
            ${escapeHTML(value)}
        </option>

    `;

}


/* =====================================================
   CHANGE STATUS
===================================================== */

function changeOrderStatus(
    index,
    status
) {

    const orders =
        getOrders();


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
        JSON.stringify(
            orders
        )
    );


    renderAdminOrders();

    renderOrders();

    updateProfile();


    showToast(
        "Статус заказа изменён"
    );

}


/* =====================================================
   DELETE ORDER
===================================================== */

function deleteAdminOrder(
    index
) {

    const orders =
        getOrders();


    if (
        index < 0 ||
        index >= orders.length
    ) {
        return;
    }


    if (
        !confirm(
            "Удалить этот заказ?"
        )
    ) {
        return;
    }


    orders.splice(
        index,
        1
    );


    localStorage.setItem(
        "rustOrders",
        JSON.stringify(
            orders
        )
    );


    renderAdminOrders();

    renderOrders();

    updateProfile();


    showToast(
        "Заказ удалён"
    );

}


/* =====================================================
   CLEAR ORDERS
===================================================== */

function clearAdminOrders() {

    if (
        !confirm(
            "Удалить ВСЮ историю заказов?"
        )
    ) {
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


/* =====================================================
   MODALS
===================================================== */

function openModal(id) {

    const modal =
        document.getElementById(
            id
        );


    if (!modal) {
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
        document.getElementById(
            id
        );


    if (!modal) {
        return;
    }


    modal.classList.remove(
        "open"
    );


    document.body.style.overflow =
        "";

}


/* =====================================================
   CLICK OUTSIDE
===================================================== */

document.addEventListener(
    "click",
    event => {

        if (
            event.target.classList.contains(
                "modal"
            )
        ) {

            closeModal(
                event.target.id
            );

        }

    }
);


/* =====================================================
   ESC
===================================================== */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key !==
            "Escape"
        ) {
            return;
        }


        document
            .querySelectorAll(
                ".modal.open"
            )
            .forEach(
                modal => {

                    modal.classList.remove(
                        "open"
                    );

                }
            );


        document.body.style.overflow =
            "";

    }
);


/* =====================================================
   COPY
===================================================== */

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


function copyText(text) {

    if (
        navigator.clipboard &&
        navigator.clipboard.writeText
    ) {

        navigator.clipboard
            .writeText(
                text
            )
            .then(
                () => {

                    showToast(
                        "Скопировано"
                    );

                }
            )
            .catch(
                () => {

                    fallbackCopy(
                        text
                    );

                }
            );

        return;
    }


    fallbackCopy(
        text
    );

}


function fallbackCopy(text) {

    const textarea =
        document.createElement(
            "textarea"
        );


    textarea.value =
        text;


    document.body.appendChild(
        textarea
    );


    textarea.select();


    try {

        document.execCommand(
            "copy"
        );


        showToast(
            "Скопировано"
        );

    } catch {

        showToast(
            "Не удалось скопировать"
        );

    }


    textarea.remove();

}


/* =====================================================
   SCROLL
===================================================== */

function scrollToSection(id) {

    const element =
        document.getElementById(
            id
        );


    if (!element) {
        return;
    }


    element.scrollIntoView({
        behavior: "smooth"
    });

}


/* =====================================================
   FORMAT PRICE
===================================================== */

function formatPrice(
    price
) {

    return Number(
        price || 0
    ).toLocaleString(
        "ru-RU"
    );

}


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHTML(
    value
) {

    return String(
        value ?? ""
    )
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


function escapeJS(
    value
) {

    return String(
        value ?? ""
    )
        .replace(
            /\\/g,
            "\\\\"
        )
        .replace(
            /'/g,
            "\\'"
        )
        .replace(
            /"/g,
            '\\"'
        )
        .replace(
            /\n/g,
            "\\n"
        )
        .replace(
            /\r/g,
            "\\r"
        );

}


/* =====================================================
   TOAST
===================================================== */

function showToast(
    message
) {

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


    setTimeout(
        () => {

            toast.classList.add(
                "show"
            );

        },
        10
    );


    setTimeout(
        () => {

            toast.classList.remove(
                "show"
            );


            setTimeout(
                () => {

                    toast.remove();

                },
                250
            );

        },
        2200
    );

}
/* =========================================
   REVIEWS
========================================= */

let selectedRating = 0;


/* =========================================
   GET REVIEWS
========================================= */

function getReviews() {

    const reviews =
        JSON.parse(
            localStorage.getItem("rustReviews") || "[]"
        );

    return Array.isArray(reviews)
        ? reviews
        : [];
}


/* =========================================
   SAVE REVIEWS
========================================= */

function saveReviews(reviews) {

    localStorage.setItem(
        "rustReviews",
        JSON.stringify(reviews)
    );

}


/* =========================================
   SHOW REVIEWS
========================================= */

function renderReviews() {

    const container =
        document.getElementById("reviewsList");

    const empty =
        document.getElementById("reviewsEmpty");

    if (!container) {
        return;
    }

    const reviews = getReviews();

    if (!reviews.length) {

        container.innerHTML = "";

        if (empty) {
            empty.style.display = "block";
        }

        return;
    }

    if (empty) {
        empty.style.display = "none";
    }

    container.innerHTML = "";

    reviews.forEach(review => {

        const stars =
            "★".repeat(
                Number(review.rating) || 0
            ) +
            "☆".repeat(
                5 - (Number(review.rating) || 0)
            );

        const date =
            review.date
                ? new Date(review.date)
                    .toLocaleDateString("ru-RU")
                : "";

        const items =
            Array.isArray(review.items)
                ? review.items
                    .map(item =>
                        escapeHTML(item.name)
                    )
                    .join(", ")
                : "";

        container.innerHTML += `

            <article class="review-card">

                <div class="review-card-top">

                    <div class="review-user">

                        <div class="review-avatar">
                            ${escapeHTML(
                                (review.name || "A")
                                    .charAt(0)
                                    .toUpperCase()
                            )}
                        </div>

                        <div>

                            <strong>
                                ${escapeHTML(
                                    review.name || "Покупатель"
                                )}
                            </strong>

                            <span>
                                ${date}
                            </span>

                        </div>

                    </div>


                    <div class="review-stars">
                        ${stars}
                    </div>

                </div>


                <p class="review-card-text">
                    ${escapeHTML(
                        review.text
                    )}
                </p>


                ${
                    items
                    ? `
                        <div class="review-product">
                            🛒 ${items}
                        </div>
                    `
                    : ""
                }

            </article>

        `;

    });

}


/* =========================================
   OPEN REVIEW
========================================= */

function openReview(orderIndex) {

    const orders =
        JSON.parse(
            localStorage.getItem(
                "rustOrders"
            ) || "[]"
        );

    if (
        orderIndex < 0 ||
        orderIndex >= orders.length
    ) {
        showToast(
            "Заказ не найден"
        );

        return;
    }

    const order =
        orders[orderIndex];

    /*
       Проверяем, не оставлял ли пользователь
       отзыв на этот заказ.
    */

    const reviews = getReviews();

    const alreadyReviewed =
        reviews.some(
            review =>
                review.orderId === order.id
        );

    if (alreadyReviewed) {

        showToast(
            "Вы уже оставили отзыв на этот заказ"
        );

        return;
    }


    selectedRating = 0;

    const orderNumber =
        document.getElementById(
            "reviewOrderNumber"
        );

    const name =
        document.getElementById(
            "reviewName"
        );

    const text =
        document.getElementById(
            "reviewText"
        );

    const ratingText =
        document.getElementById(
            "reviewRatingText"
        );


    if (orderNumber) {

        orderNumber.textContent =
            order.id || "—";

    }


    if (name) {

        name.value =
            localStorage.getItem(
                "rustReviewName"
            ) || "";

    }


    if (text) {

        text.value = "";

    }


    if (ratingText) {

        ratingText.textContent =
            "Выберите оценку";

    }


    updateRatingButtons();

    /*
       Запоминаем заказ,
       чтобы submitReview() знал,
       к какому заказу относится отзыв.
    */

    sessionStorage.setItem(
        "reviewOrderIndex",
        String(orderIndex)
    );


    openModal(
        "reviewModal"
    );

}


/* =========================================
   SELECT RATING
========================================= */

function selectRating(rating) {

    rating =
        Number(rating);


    if (
        rating < 1 ||
        rating > 5
    ) {
        return;
    }


    selectedRating =
        rating;


    updateRatingButtons();


    const ratingText =
        document.getElementById(
            "reviewRatingText"
        );


    const texts = {

        1: "Очень плохо",

        2: "Плохо",

        3: "Нормально",

        4: "Хорошо",

        5: "Отлично!"

    };


    if (ratingText) {

        ratingText.textContent =
            texts[rating];

    }

}


/* =========================================
   UPDATE RATING BUTTONS
========================================= */

function updateRatingButtons() {

    document
        .querySelectorAll(
            "#reviewModal .review-rating button"
        )
        .forEach(button => {

            const rating =
                Number(
                    button.dataset.rating
                );

            button.classList.toggle(
                "active",
                rating <= selectedRating
            );

        });

}


/* =========================================
   SUBMIT REVIEW
========================================= */

function submitReview() {

    const orderIndex =
        Number(
            sessionStorage.getItem(
                "reviewOrderIndex"
            )
        );


    const orders =
        JSON.parse(
            localStorage.getItem(
                "rustOrders"
            ) || "[]"
        );


    if (
        !Number.isInteger(orderIndex) ||
        !orders[orderIndex]
    ) {

        showToast(
            "Заказ не найден"
        );

        return;
    }


    if (selectedRating < 1) {

        showToast(
            "Поставьте оценку"
        );

        return;
    }


    const nameElement =
        document.getElementById(
            "reviewName"
        );


    const textElement =
        document.getElementById(
            "reviewText"
        );


    const name =
        nameElement
            ? nameElement.value.trim()
            : "";


    const text =
        textElement
            ? textElement.value.trim()
            : "";


    if (!name) {

        showToast(
            "Введите ваше имя"
        );

        if (nameElement) {
            nameElement.focus();
        }

        return;
    }


    if (!text) {

        showToast(
            "Напишите отзыв"
        );

        if (textElement) {
            textElement.focus();
        }

        return;
    }


    const order =
        orders[orderIndex];


    const reviews =
        getReviews();


    /*
       Дополнительная проверка,
       чтобы нельзя было оставить
       два отзыва на один заказ.
    */

    const exists =
        reviews.some(
            review =>
                review.orderId === order.id
        );


    if (exists) {

        closeModal(
            "reviewModal"
        );

        showToast(
            "Отзыв на этот заказ уже опубликован"
        );

        return;
    }


    const review = {

        id:
            "review-" +
            Date.now(),

        orderId:
            order.id,

        name:
            name,

        text:
            text,

        rating:
            selectedRating,

        items:
            Array.isArray(order.items)
                ? order.items.map(item => ({
                    name: item.name
                }))
                : [],

        date:
            new Date().toISOString()

    };


    reviews.unshift(
        review
    );


    saveReviews(
        reviews
    );


    localStorage.setItem(
        "rustReviewName",
        name
    );


    /*
       Помечаем заказ,
       что отзыв уже оставлен.
    */

    order.reviewed = true;


    localStorage.setItem(
        "rustOrders",
        JSON.stringify(orders)
    );


    selectedRating = 0;


    closeModal(
        "reviewModal"
    );


    renderReviews();

    renderOrders();


    showToast(
        "Спасибо! Ваш отзыв опубликован ⭐"
    );


    setTimeout(() => {

        scrollToSection(
            "reviews"
        );

    }, 300);

}


/* =========================================
   INIT REVIEWS
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        renderReviews();

    }
);