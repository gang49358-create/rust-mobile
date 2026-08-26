/* =========================================
   RUST MOBILE SHOP
   script.js
========================================= */


/* =========================================
   TELEGRAM ПРОДАВЦА
========================================= */

const TELEGRAM_SELLER = "luxanixx";


/* =========================================
   АДМИН
========================================= */

const ADMIN_LOGIN = "AkashiSK8";

/*
   Замени пароль на свой.
   Не используй пароль от GitHub/Telegram.
*/
const ADMIN_PASSWORD = "CHANGE_ME";


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

        prepareCheckoutFields();

    }
);


/* =========================================
   LOCAL STORAGE
========================================= */

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
            "Ошибка localStorage:",
            error
        );

        return fallback;
    }
}


function saveJSON(key, value) {

    try {

        localStorage.setItem(
            key,
            JSON.stringify(value)
        );

    } catch (error) {

        console.error(
            "Ошибка сохранения:",
            error
        );

    }

}


/* =========================================
   CATEGORY
========================================= */

function showCategory(
    category,
    button
) {

    document
        .querySelectorAll(".category")
        .forEach(function (item) {

            item.classList.remove(
                "active"
            );

        });


    if (button) {

        button.classList.add(
            "active"
        );

    }


    const container =
        document.getElementById(
            "products"
        );


    if (!container) {
        return;
    }


    if (!products[category]) {

        container.innerHTML = `
            <div class="empty">
                Товары не найдены
            </div>
        `;

        return;
    }


    container.innerHTML = "";


    products[category].forEach(
        function (product) {

            container.innerHTML +=
                createProductHTML(
                    product
                );

        }
    );

}


/* =========================================
   PRODUCT HTML
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
                    onclick="addToCart('${escapeJS(product.id)}')"
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

        const found =
            products[category].find(
                function (item) {

                    return item.id === id;

                }
            );


        if (found) {

            return found;

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


    saveJSON(
        "rustCart",
        cart
    );


    updateCart();


    showToast(
        "Товар добавлен в корзину"
    );

}


/* =========================================
   REMOVE CART
========================================= */

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
        function (item, index) {

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
   CHECKOUT FIELDS
========================================= */

function prepareCheckoutFields() {

    const contactField =
        document.getElementById(
            "checkoutPlayerId"
        );


    if (!contactField) {

        return;

    }


    /*
       Меняем старое поле
       "Игровой ID"
       на Почта / WeChat ID.
    */

    const fieldContainer =
        contactField.parentElement;


    if (fieldContainer) {

        const label =
            fieldContainer.querySelector(
                "label"
            );


        if (label) {

            label.textContent =
                "📧 Почта / WeChat ID";

        }

    }


    contactField.placeholder =
        "Введите почту или WeChat ID";


    contactField.autocomplete =
        "email";


    /*
       Добавляем комментарий,
       если его ещё нет.
    */

    if (
        document.getElementById(
            "checkoutComment"
        )
    ) {

        return;

    }


    const commentWrapper =
        document.createElement(
            "div"
        );


    commentWrapper.className =
        "checkout-field";


    commentWrapper.innerHTML = `

        <label>
            📝 Комментарий к заказу
        </label>

        <textarea
            id="checkoutComment"
            rows="3"
            maxlength="500"
            placeholder="Комментарий к заказу"
        ></textarea>

    `;


    const payment =
        document.getElementById(
            "paymentMethod"
        );


    if (payment) {

        const paymentContainer =
            payment.parentElement;


        if (
            paymentContainer &&
            paymentContainer.parentElement
        ) {

            paymentContainer
                .parentElement
                .insertBefore(
                    commentWrapper,
                    paymentContainer
                );

        }

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


    prepareCheckoutFields();


    const savedContact =
        localStorage.getItem(
            "rustContact"
        );


    const contactField =
        document.getElementById(
            "checkoutPlayerId"
        );


    if (
        contactField &&
        savedContact
    ) {

        contactField.value =
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
        function (item) {

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

    prepareCheckoutFields();


    const contactElement =
        document.getElementById(
            "checkoutPlayerId"
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


    const paymentValue =
        paymentElement
            ? paymentElement.value
            : "card";


    const agreement =
        agreementElement
            ? agreementElement.checked
            : false;


    const orderNumber =
        orderElement &&
        orderElement.textContent.trim()
            ? orderElement.textContent.trim()
            : generateOrderNumber();


    if (!contact) {

        showToast(
            "Введите Почту / WeChat ID"
        );


        if (contactElement) {

            contactElement.focus();

        }


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
        function (item) {

            total +=
                Number(item.price) || 0;

        }
    );


    localStorage.setItem(
        "rustContact",
        contact
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
        paymentNames[paymentValue] ||
        paymentValue;


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
                function (item) {

                    return (
                        item.name +
                        " — " +
                        formatPrice(
                            item.price
                        ) +
                        " ₽"
                    );

                }
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

        comment:
            comment,

        status:
            "Новый",

        date:
            now.toISOString()

    };


    let orders =
        loadJSON(
            "rustOrders",
            []
        );


    if (!Array.isArray(orders)) {

        orders = [];

    }


    orders.unshift(
        order
    );


    saveJSON(
        "rustOrders",
        orders
    );


    /*
       Данные для Telegram.
       Пароль аккаунта здесь НЕ собирается.
    */

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


    /*
       Очищаем корзину.
    */

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


    /*
       Открываем Telegram.
    */

    openTelegramSeller(
        message
    );


    /*
       Показываем успешный заказ.
    */

    setTimeout(
        function () {

            openModal(
                "successModal"
            );

        },
        600
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
        "https://t.me/" +
        TELEGRAM_SELLER +
        "?text=" +
        encoded;


    window.location.href =
        url;

}


/* =========================================
   OPEN LAST TELEGRAM
========================================= */

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
        loadJSON(
            "rustOrders",
            []
        );


    if (
        !Array.isArray(orders) ||
        !orders.length
    ) {

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
        function (order) {

            const date =
                new Date(
                    order.date
                ).toLocaleString(
                    "ru-RU"
                );


            container.innerHTML += `

                <div class="order-history-item">

                    <div class="order-history-top">

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
                                order.status ||
                                "Новый"
                            )}
                        </span>

                    </div>


                    <div class="order-history-info">

                        📧 Почта / WeChat ID:
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

        }
    );

}


/* =========================================
   PROFILE
========================================= */

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

        orders.forEach(
            function (order) {

                spent +=
                    Number(
                        order.total
                    ) || 0;

            }
        );

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
   ADMIN BUTTON
========================================= */

function openAdmin() {

    openAdminLogin();

}


/* =========================================
   MODALS
========================================= */

function openModal(id) {

    const modal =
        document.getElementById(
            id
        );


    if (!modal) {

        console.warn(
            "Модальное окно не найдено:",
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


/* =========================================
   CLICK OUTSIDE MODAL
========================================= */

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


/* =========================================
   ESC
========================================= */

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
            .forEach(
                function (modal) {

                    modal.classList.remove(
                        "open"
                    );

                }
            );


        document.body.style.overflow =
            "";

    }
);


/* =========================================
   COPY ORDER
========================================= */

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


/* =========================================
   COPY TEXT
========================================= */

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
                function () {

                    showToast(
                        "Скопировано"
                    );

                }
            )
            .catch(
                function () {

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
            "Скопировано"
        );

    } catch (error) {

        showToast(
            "Не удалось скопировать"
        );

    }


    textarea.remove();

}


/* =========================================
   SCROLL
========================================= */

function scrollToSection(id) {

    const element =
        document.getElementById(
            id
        );


    if (!element) {

        return;

    }


    element.scrollIntoView({

        behavior:
            "smooth"

    });

}


/* =========================================
   FORMAT PRICE
========================================= */

function formatPrice(price) {

    return Number(
        price || 0
    ).toLocaleString(
        "ru-RU"
    );

}


/* =========================================
   ESCAPE HTML
========================================= */

function escapeHTML(value) {

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
   ESCAPE JS
========================================= */

function escapeJS(value) {

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
            /\r/g,
            "\\r"
        )
        .replace(
            /\n/g,
            "\\n"
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


    setTimeout(
        function () {

            toast.classList.add(
                "show"
            );

        },
        10
    );


    setTimeout(
        function () {

            toast.classList.remove(
                "show"
            );


            setTimeout(
                function () {

                    if (toast) {

                        toast.remove();

                    }

                },
                250
            );

        },
        2200
    );

}


/* =========================================
   ADMIN LOGIN
========================================= */

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


    /*
       Если окна входа нет в HTML,
       открываем админку напрямую
       только для удобства тестирования.
    */

    if (
        document.getElementById(
            "adminLoginModal"
        )
    ) {

        openModal(
            "adminLoginModal"
        );

    } else {

        openAdminPanel();

    }

}


/* =========================================
   ADMIN LOGIN CHECK
========================================= */

function loginAdmin() {

    const loginElement =
        document.getElementById(
            "adminLogin"
        );


    const passwordElement =
        document.getElementById(
            "adminPassword"
        );


    const errorElement =
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

        if (errorElement) {

            errorElement.textContent =
                "Неверный логин или пароль";

        } else {

            showToast(
                "Неверный логин или пароль"
            );

        }


        return;

    }


    closeModal(
        "adminLoginModal"
    );


    openAdminPanel();

}


/* =========================================
   ADMIN PANEL
========================================= */

function openAdminPanel() {

    renderAdminOrders();

    openModal(
        "adminModal"
    );

}


/* =========================================
   ADMIN ORDERS
========================================= */

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


function refreshAdminOrders() {

    renderAdminOrders();


    showToast(
        "Заказы обновлены"
    );

}


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
        orders.filter(
            function (order) {

                return (
                    order.status ===
                    "Новый"
                );

            }
        ).length;


    const waitingCount =
        orders.filter(
            function (order) {

                return (
                    order.status ===
                    "Ожидает оплаты"
                );

            }
        ).length;


    const completedCount =
        orders.filter(
            function (order) {

                return (
                    order.status ===
                    "Выполнен"
                );

            }
        ).length;


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


    orders.forEach(
        function (order, index) {

            const date =
                order.date
                    ? new Date(
                        order.date
                    ).toLocaleString(
                        "ru-RU"
                    )
                    : "—";


            const items =
                Array.isArray(
                    order.items
                )
                    ? order.items
                        .map(
                            function (item) {

                                return escapeHTML(
                                    item.name
                                );

                            }
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
                                WeChat:
                            </strong>

                            ${escapeHTML(
                                order.contact ||
                                "Не указан"
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


                    <div
                        class="admin-order-actions"
                    >

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
                            onclick="
                                copyText(
                                    '${escapeJS(
                                        order.id ||
                                        ""
                                    )}'
                                )
                            "
                        >
                            📋 Номер
                        </button>


                        <button
                            type="button"
                            onclick="
                                deleteAdminOrder(
                                    ${index}
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


/* =========================================
   CHANGE ORDER STATUS
========================================= */

function changeOrderStatus(
    index,
    status
) {

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


    saveJSON(
        "rustOrders",
        orders
    );


    renderAdminOrders();

    renderOrders();

    updateProfile();


    showToast(
        "Статус заказа изменён"
    );

}


/* =========================================
   DELETE ADMIN ORDER
========================================= */

function deleteAdminOrder(
    index
) {

    const orders =
        getAdminOrders();


    if (
        index < 0 ||
        index >= orders.length
    ) {

        return;

    }


    const confirmed =
        confirm(
            "Удалить этот заказ?"
        );


    if (!confirmed) {

        return;

    }


    orders.splice(
        index,
        1
    );


    saveJSON(
        "rustOrders",
        orders
    );


    renderAdminOrders();

    renderOrders();

    updateProfile();


    showToast(
        "Заказ удалён"
    );

}


/* =========================================
   CLEAR ADMIN ORDERS
========================================= */

function clearAdminOrders() {

    const confirmed =
        confirm(
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


/* =========================================
   СЕКРЕТНЫЙ ВХОД
========================================= */

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