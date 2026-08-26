/* =========================================
   RUST MOBILE SHOP
   script.js
========================================= */


/* =========================================
   TELEGRAM ПРОДАВЦА
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

let cart = JSON.parse(
    localStorage.getItem("rustCart") || "[]"
);


/* =========================================
   START
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const firstCategory =
        document.querySelector(".category");

    showCategory("coins", firstCategory);

    updateCart();
    renderOrders();
    updateProfile();

    prepareCheckoutFields();

});


/* =========================================
   CATEGORY
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

    if (!container || !products[category]) {
        return;
    }

    container.innerHTML = "";

    products[category].forEach(product => {
        container.innerHTML += createProductHTML(product);
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

        const product = products[category].find(
            item => item.id === id
        );

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

    const product = findProduct(id);

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

    showToast("Товар добавлен в корзину");
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
        count.textContent = cart.length;
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

        totalElement.textContent = "0 ₽";

        return;
    }

    container.innerHTML = "";

    let total = 0;

    cart.forEach((item, index) => {

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

    totalElement.textContent =
        formatPrice(total) + " ₽";
}


/* =========================================
   PREPARE CHECKOUT FIELDS
========================================= */

function prepareCheckoutFields() {

    const playerField =
        document.getElementById("checkoutPlayerId");

    if (!playerField) {
        return;
    }

    /*
       Старое поле "Игровой ID" превращаем
       в "Почта / WeChat ID".
    */

    const wrapper =
        playerField.closest(".form-group") ||
        playerField.parentElement;

    if (wrapper) {

        const label =
            wrapper.querySelector("label");

        if (label) {
            label.textContent =
                "📧 Почта / WeChat ID";
        }
    }

    playerField.placeholder =
        "Введите почту или WeChat ID";

    playerField.autocomplete =
        "email";

    playerField.removeAttribute("name");


    /*
       Добавляем безопасное второе поле:
       комментарий к заказу.
    */

    if (
        document.getElementById(
            "checkoutComment"
        )
    ) {
        return;
    }

    const commentWrapper =
        document.createElement("div");

    commentWrapper.className =
        "form-group checkout-extra-field";

    commentWrapper.innerHTML = `
        <label
            for="checkoutComment"
            style="
                display:block;
                margin-bottom:8px;
                font-weight:600;
            "
        >
            📝 Комментарий к заказу
        </label>

        <textarea
            id="checkoutComment"
            placeholder="Например: нужен донат на этот аккаунт"
            rows="3"
            maxlength="500"
            style="
                width:100%;
                box-sizing:border-box;
                resize:vertical;
            "
        ></textarea>
    `;

    /*
       Ставим поле перед способом оплаты.
    */

    const payment =
        document.getElementById(
            "paymentMethod"
        );

    if (payment) {

        const paymentWrapper =
            payment.closest(".form-group") ||
            payment.parentElement;

        if (paymentWrapper) {

            paymentWrapper.parentNode.insertBefore(
                commentWrapper,
                paymentWrapper
            );

        }

    } else {

        playerField.parentNode.appendChild(
            commentWrapper
        );

    }

}


/* =========================================
   CHECKOUT
========================================= */

function checkout() {

    if (!cart.length) {

        showToast("Корзина пустая");

        return;
    }

    prepareCheckoutFields();

    const savedEmail =
        localStorage.getItem(
            "rustContact"
        );

    const contact =
        document.getElementById(
            "checkoutPlayerId"
        );

    if (contact && savedEmail) {
        contact.value = savedEmail;
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
        String(now.getMonth() + 1)
            .padStart(2, "0");

    const day =
        String(now.getDate())
            .padStart(2, "0");

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

    if (!container || !totalElement) {
        return;
    }

    container.innerHTML = "";

    let total = 0;

    cart.forEach(item => {

        total += Number(item.price) || 0;

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

    const paymentMethod =
        paymentElement
            ? paymentElement.value
            : "Не указан";

    const agreement =
        agreementElement
            ? agreementElement.checked
            : true;

    const orderNumber =
        orderElement
            ? orderElement.textContent.trim()
            : generateOrderNumber();


    /* Проверяем контакт */

    if (!contact) {

        showToast(
            "Введите Почту / WeChat ID"
        );

        if (contactElement) {
            contactElement.focus();
        }

        return;
    }


    /* Проверяем согласие */

    if (!agreement) {

        showToast(
            "Подтвердите правильность данных"
        );

        return;
    }


    /* Считаем сумму */

    let total = 0;

    cart.forEach(item => {
        total += Number(item.price) || 0;
    });


    /* Сохраняем контакт */

    localStorage.setItem(
        "rustContact",
        contact
    );


    /* Названия способов оплаты */

    const paymentNames = {

        card: "Банковская карта",

        sbp: "СБП",

        crypto: "Криптовалюта"

    };


    const paymentName =
        paymentNames[paymentMethod] ||
        paymentMethod ||
        "Не указан";


    /* Время */

    const now = new Date();

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


    /* Товары */

    const itemsText =
        cart
            .map(item =>
                `${item.name} — ${formatPrice(item.price)} ₽`
            )
            .join("\n");


    /* Заказ */

    const order = {

        id: orderNumber,

        contact: contact,

        items: [...cart],

        total: total,

        paymentMethod: paymentName,

        comment: comment,

        status: "Новый",

        date: now.toISOString()

    };


    /* Сохраняем историю */

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
       Готовый текст для продавца.
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
Ожидает оплаты`;


    /*
       Показываем номер заказа
    */

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

    saveCart();
    updateCart();

    renderOrders();
    updateProfile();


    /*
       Закрываем оформление.
    */

    closeModal("checkoutModal");


    /*
       Сохраняем текст, чтобы можно было
       открыть Telegram ещё раз.
    */

    sessionStorage.setItem(
        "lastTelegramMessage",
        message
    );


    /*
       Открываем Telegram продавца
       с предварительно заполненным текстом.
    */

    openTelegramSeller(message);


    /*
       Показываем страницу успешного заказа.
    */

    setTimeout(() => {

        openModal("successModal");

    }, 500);

}


/* =========================================
   TELEGRAM SELLER
========================================= */

function openTelegramSeller(message) {

    const encoded =
        encodeURIComponent(message);

    const url =
        `https://t.me/${TELEGRAM_SELLER}?text=${encoded}`;


    /*
       На телефоне Telegram откроется
       через обычную ссылку.
    */

    window.location.href = url;
}


/* =========================================
   OPEN TELEGRAM AGAIN
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

    openTelegramSeller(message);
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
                        ${escapeHTML(order.id)}
                    </span>

                    <span class="order-history-status">
                        ${escapeHTML(order.status)}
                    </span>

                </div>

                <div class="order-history-info">

                    📧 Контакт:
                    ${escapeHTML(order.contact)}

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
   PROFILE
========================================= */

function updateProfile() {

    const contact =
        localStorage.getItem(
            "rustContact"
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
   PROFILE
========================================= */

function openProfile() {

    updateProfile();

    openModal("profileModal");
}


/* =========================================
   ORDERS
========================================= */

function openOrders() {

    renderOrders();

    closeModal("profileModal");

    openModal("ordersModal");
}


/* =========================================
   SUPPORT
========================================= */

function openSupport() {

    openModal("supportModal");
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
            .forEach(modal => {

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
   COPY
========================================= */

function copyText(text) {

    if (
        navigator.clipboard &&
        navigator.clipboard.writeText
    ) {

        navigator.clipboard
            .writeText(text)
            .then(() => {

                showToast(
                    "Скопировано"
                );

            })
            .catch(() => {

                showToast(
                    "Не удалось скопировать"
                );

            });

        return;
    }


    const textarea =
        document.createElement(
            "textarea"
        );

    textarea.value = text;

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

    return String(value ?? "")
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
    /* =========================================
   ADMIN LOGIN
========================================= */

function openAdminLogin() {

    closeModal("profileModal");

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

    openModal("adminLoginModal");
}


function loginAdmin() {

    const login =
        document
            .getElementById("adminLogin")
            .value
            .trim();

    const password =
        document
            .getElementById("adminPassword")
            .value;

    const error =
        document.getElementById(
            "adminLoginError"
        );


    /*
       ВРЕМЕННЫЕ ДАННЫЕ ДЛЯ ТЕСТА
    */

    const correctLogin =
        "AkashiSK8";

    const correctPassword =
        "CHANGE_ME";


    if (
        login !== correctLogin ||
        password !== correctPassword
    ) {

        if (error) {

            error.textContent =
                "Неверный логин или пароль";

        }

        return;
    }


    closeModal(
        "adminLoginModal"
    );


    openAdminPanel();
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
/* =========================================
   AKASHISK8 ADMIN
========================================= */

function openAdminPanel() {

    renderAdminOrders();

    openModal("adminModal");

}


function refreshAdminOrders() {

    renderAdminOrders();

    showToast(
        "Заказы обновлены"
    );

}


function getAdminOrders() {

    const orders =
        JSON.parse(
            localStorage.getItem(
                "rustOrders"
            ) || "[]"
        );

    return Array.isArray(orders)
        ? orders
        : [];

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
        orders.filter(order =>
            order.status === "Новый"
        ).length;


    const waitingCount =
        orders.filter(order =>
            order.status === "Ожидает оплаты"
        ).length;


    const completedCount =
        orders.filter(order =>
            order.status === "Выполнен"
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
        (order, index) => {

            const date =
                new Date(order.date)
                    .toLocaleString(
                        "ru-RU"
                    );


            const items =
                Array.isArray(order.items)
                    ? order.items
                        .map(item =>
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
                                order.orderNumber ||
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
                                        order.orderNumber ||
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
   CHANGE STATUS
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


/* =========================================
   DELETE ORDER
========================================= */

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


/* =========================================
   CLEAR ORDERS
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
   СЕКРЕТНЫЙ ВХОД В АДМИНКУ
========================================= */

let adminKeys = "";


document.addEventListener(
    "keydown",
    function(event) {

        /*
           Набери на клавиатуре:

           AKASHISK8
        */

        if (
            event.key &&
            event.key.length === 1
        ) {

            adminKeys +=
                event.key.toUpperCase();

        }


        if (
            adminKeys.length > 20
        ) {

            adminKeys =
                adminKeys.slice(-20);

        }


        if (
            adminKeys.includes(
                "AKASHISK8"
            )
        ) {

            adminKeys = "";

            openAdminPanel();

        }

    }
);