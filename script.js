/* =========================================
   RUST MOBILE SHOP
   script.js
========================================= */


/* =========================================
   TELEGRAM
========================================= */

const TELEGRAM_SELLER = "luxanixx";


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

let cart = loadJSON(
    "rustCart",
    []
);


/* =========================================
   START
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const first =
            document.querySelector(
                ".category"
            );

        showCategory(
            "coins",
            first
        );

        updateCart();

        renderOrders();

        updateProfile();

    }
);


/* =========================================
   STORAGE
========================================= */

function loadJSON(
    key,
    fallback
) {

    try {

        const data =
            localStorage.getItem(key);

        if (!data) {
            return fallback;
        }

        const parsed =
            JSON.parse(data);

        return parsed ?? fallback;

    } catch {

        return fallback;

    }

}


function saveJSON(
    key,
    value
) {

    localStorage.setItem(
        key,
        JSON.stringify(value)
    );

}


/* =========================================
   CATEGORY
========================================= */

function showCategory(
    category,
    button
) {

    document
        .querySelectorAll(
            ".category"
        )
        .forEach(
            item =>
                item.classList.remove(
                    "active"
                )
        );

    if (button) {
        button.classList.add(
            "active"
        );
    }

    const container =
        document.getElementById(
            "products"
        );

    if (
        !container ||
        !products[category]
    ) {
        return;
    }

    container.innerHTML = "";

    products[category]
        .forEach(
            product => {

                container.innerHTML +=
                    createProductHTML(
                        product
                    );

            }
        );

}


/* =========================================
   PRODUCT
========================================= */

function createProductHTML(
    product
) {

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
                .find(
                    item =>
                        item.id === id
                );

        if (product) {
            return product;
        }

    }

    return null;

}


/* =========================================
   CART
========================================= */

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
        description: product.description
    });

    saveJSON(
        "rustCart",
        cart
    );

    updateCart();

    showToast(
        "Товар добавлен в корзину"
    );

}


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

    saveJSON(
        "rustCart",
        cart
    );

    updateCart();

    renderCart();

}


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


function openCart() {

    renderCart();

    openModal(
        "cartModal"
    );

}


function renderCart() {

    const container =
        document.getElementById(
            "cartItems"
        );

    const totalElement =
        document.getElementById(
            "cartTotal"
        );

    if (
        !container ||
        !totalElement
    ) {
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
                        type="button"
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

    const savedContact =
        localStorage.getItem(
            "rustContact"
        );

    const contact =
        document.getElementById(
            "checkoutContact"
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

    return (
        `RM-${year}${month}${day}-${random}`
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

    if (
        !container ||
        !totalElement
    ) {
        return;
    }

    container.innerHTML = "";

    let total = 0;

    cart.forEach(
        item => {

            total +=
                Number(item.price) || 0;

            container.innerHTML += `

                <div class="checkout-item">

                    <span class="checkout-item-name">
                        ${escapeHTML(
                            item.name
                        )}
                    </span>

                    <span class="checkout-item-price">
                        ${formatPrice(
                            item.price
                        )} ₽
                    </span>

                </div>

            `;

        }
    );

    totalElement.textContent =
        formatPrice(total) + " ₽";

}


/* =========================================
   CREATE ORDER
========================================= */

function createOrder() {

    const contactElement =
        document.getElementById(
            "checkoutContact"
        );

    const paymentElement =
        document.getElementById(
            "paymentMethod"
        );

    const agreementElement =
        document.getElementById(
            "agreement"
        );

    const numberElement =
        document.getElementById(
            "orderNumber"
        );

    const contact =
        contactElement
            ? contactElement.value.trim()
            : "";

    const payment =
        paymentElement
            ? paymentElement.value
            : "card";

    const agreement =
        agreementElement
            ? agreementElement.checked
            : false;

    const orderNumber =
        numberElement
            ? numberElement.textContent
            : generateOrderNumber();


    if (!contact) {

        showToast(
            "Введите Почту / WeChat ID"
        );

        contactElement?.focus();

        return;

    }


    if (!agreement) {

        showToast(
            "Подтвердите правильность данных"
        );

        return;

    }


    let total = 0;

    cart.forEach(
        item => {

            total +=
                Number(item.price) || 0;

        }
    );


    const paymentNames = {

        card:
            "Банковская карта",

        sbp:
            "СБП",

        crypto:
            "Криптовалюта"

    };


    const paymentName =
        paymentNames[payment] ||
        "Не указан";


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


    const itemsText =
        cart
            .map(
                item =>
                    `${item.name} — ${formatPrice(item.price)} ₽`
            )
            .join("\n");


    const order = {

        id:
            orderNumber,

        contact:
            contact,

        items:
            [...cart],

        total:
            total,

        paymentMethod:
            paymentName,

        status:
            "Ожидает оплаты",

        date:
            now.toISOString()

    };


    const orders =
        loadJSON(
            "rustOrders",
            []
        );


    orders.unshift(
        order
    );


    saveJSON(
        "rustOrders",
        orders
    );


    localStorage.setItem(
        "rustContact",
        contact
    );


    const message =

`🛒 НОВЫЙ ЗАКАЗ

🔢 Номер:
${orderNumber}

📦 Товар:
${itemsText}

💰 Сумма:
${formatPrice(total)} ₽

📧 Почта / WeChat ID:
${contact}

💳 Оплата:
${paymentName}

📅 Дата:
${date}

🕐 Время:
${time}

⏳ Статус:
Ожидает оплаты`;


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
            formatPrice(total) + " ₽";

    }


    cart = [];


    saveJSON(
        "rustCart",
        cart
    );


    updateCart();

    renderOrders();

    updateProfile();


    closeModal(
        "checkoutModal"
    );


    openModal(
        "successModal"
    );


    /*
       Через небольшую задержку
       открываем Telegram.
    */

    setTimeout(
        () => {

            openTelegramSeller(
                message
            );

        },
        700
    );

}


/* =========================================
   TELEGRAM
========================================= */

function openTelegramSeller(
    message
) {

    const encoded =
        encodeURIComponent(
            message
        );

    const url =
        `https://t.me/${TELEGRAM_SELLER}?text=${encoded}`;

    window.location.href =
        url;

}


function openLastTelegramOrder() {

    const message =
        sessionStorage.getItem(
            "lastTelegramMessage"
        );

    if (!message) {

        showToast(
            "Нет последнего заказа"
        );

        return;

    }

    openTelegramSeller(
        message
    );

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


    orders.forEach(
        order => {

            spent +=
                Number(
                    order.total
                ) || 0;

        }
    );


    const contactElement =
        document.getElementById(
            "profileContact"
        );

    const ordersElement =
        document.getElementById(
            "profileOrders"
        );

    const spentElement =
        document.getElementById(
            "profileSpent"
        );


    if (contactElement) {

        contactElement.textContent =
            contact;

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

                <div
                    class="order-history-item"
                >

                    <div
                        class="order-history-top"
                    >

                        <span
                            class="order-history-number"
                        >
                            ${escapeHTML(
                                order.id
                            )}
                        </span>

                        <span
                            class="order-history-status"
                        >
                            ${escapeHTML(
                                order.status
                            )}
                        </span>

                    </div>

                    <div
                        class="order-history-info"
                    >

                        📦 ${items}

                        <br>

                        📧
                        ${escapeHTML(
                            order.contact
                        )}

                        <br>

                        💰
                        ${formatPrice(
                            order.total
                        )} ₽

                        <br>

                        💳
                        ${escapeHTML(
                            order.paymentMethod
                        )}

                        <br>

                        🕐
                        ${date}

                    </div>

                </div>

            `;

        }
    );

}


/* =========================================
   FAQ
========================================= */

function openFAQ() {

    const faq =
        document.getElementById(
            "faq"
        );

    if (faq) {

        faq.scrollIntoView({
            behavior: "smooth"
        });

    }

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


/* =========================================
   MODAL OUTSIDE CLICK
========================================= */

document.addEventListener(
    "click",
    event => {

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
    event => {

        if (
            event.key !== "Escape"
        ) {
            return;
        }

        document
            .querySelectorAll(
                ".modal.open"
            )
            .forEach(
                modal =>
                    modal.classList.remove(
                        "open"
                    )
            );

        document.body.style.overflow =
            "";

    }
);


/* =========================================
   COPY
========================================= */

function copyOrderNumber() {

    const element =
        document.getElementById(
            "orderNumber"
        );

    if (element) {

        copyText(
            element.textContent
        );

    }

}


function copySuccessOrder() {

    const element =
        document.getElementById(
            "successOrderNumber"
        );

    if (element) {

        copyText(
            element.textContent
        );

    }

}


function copyText(text) {

    if (
        navigator.clipboard &&
        navigator.clipboard.writeText
    ) {

        navigator.clipboard
            .writeText(text)
            .then(
                () =>
                    showToast(
                        "Скопировано"
                    )
            )
            .catch(
                () =>
                    showToast(
                        "Не удалось скопировать"
                    )
            );

        return;

    }


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


/* =========================================
   SCROLL
========================================= */

function scrollToSection(
    id
) {

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


/* =========================================
   FORMAT
========================================= */

function formatPrice(
    price
) {

    return Number(
        price || 0
    ).toLocaleString(
        "ru-RU"
    );

}


/* =========================================
   ESCAPE
========================================= */

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


/* =========================================
   TOAST
========================================= */

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

    toast.style.cssText = `
        position:fixed;
        left:50%;
        bottom:25px;
        transform:translateX(-50%) translateY(20px);
        z-index:9999;
        padding:13px 18px;
        border-radius:12px;
        background:#171b23;
        color:#fff;
        border:1px solid rgba(255,255,255,.1);
        box-shadow:0 15px 40px rgba(0,0,0,.4);
        opacity:0;
        transition:.25s;
        font-weight:700;
    `;


    document.body.appendChild(
        toast
    );


    requestAnimationFrame(
        () => {

            toast.style.opacity =
                "1";

            toast.style.transform =
                "translateX(-50%) translateY(0)";

        }
    );


    setTimeout(
        () => {

            toast.style.opacity =
                "0";

            toast.style.transform =
                "translateX(-50%) translateY(20px)";

            setTimeout(
                () => toast.remove(),
                250
            );

        },
        2200
    );

}