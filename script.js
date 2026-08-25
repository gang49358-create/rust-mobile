let cart = [];


// ======================================
// КАТЕГОРИИ
// ======================================

function showCategory(category, button) {

    document
        .querySelectorAll(".products-section")
        .forEach(section => {
            section.classList.add("hidden");
        });

    document
        .getElementById(category)
        .classList.remove("hidden");

    document
        .querySelectorAll(".category")
        .forEach(btn => {
            btn.classList.remove("active");
        });

    button.classList.add("active");

}


// ======================================
// ПРОКРУТКА К МАГАЗИНУ
// ======================================

function scrollToShop() {

    document
        .getElementById("shop")
        .scrollIntoView({
            behavior: "smooth"
        });

}


// ======================================
// КОРЗИНА
// ======================================

function addToCart(name, price) {

    cart.push({
        name,
        price
    });

    updateCart();
renderOrders();

    openCart();

}


function removeFromCart(index) {

    cart.splice(index, 1);

    updateCart();

}


function updateCart() {

    const items =
        document.getElementById("cartItems");

    const count =
        document.getElementById("cartCount");

    const totalElement =
        document.getElementById("cartTotal");


    count.textContent = cart.length;


    if (cart.length === 0) {

        items.innerHTML = `
            <div class="empty-orders">
                Корзина пока пустая
            </div>
        `;

        totalElement.textContent = "0 ₽";

        return;
    }


    let total = 0;

    items.innerHTML = "";


    cart.forEach((item, index) => {

        total += item.price;

        items.innerHTML += `

            <div class="cart-item">

                <div>

                    <div class="cart-item-name">
                        ${item.name}
                    </div>

                    <div class="cart-item-price">
                        ${formatPrice(item.price)} ₽
                    </div>

                </div>

                <button
                    class="remove-item"
                    onclick="removeFromCart(${index})"
                >
                    ✕
                </button>

            </div>

        `;

    });


    totalElement.textContent =
        formatPrice(total) + " ₽";

}


function formatPrice(price) {

    return price.toLocaleString("ru-RU");

}


// ======================================
// МОДАЛКИ
// ======================================

function openModal(id) {

    document
        .getElementById(id)
        .classList.add("show");

}


function closeModal(id) {

    document
        .getElementById(id)
        .classList.remove("show");

}


function openCart() {

    openModal("cartModal");

}


function openProfile() {

    const savedId =
        localStorage.getItem("rustPlayerId");

    if (savedId) {

        document
            .getElementById("playerId")
            .value = savedId;

    }

    openModal("profileModal");

}


function openSupport() {

    openModal("supportModal");

}


function openOrders() {

    openModal("ordersModal");

}


// ======================================
// ПРОФИЛЬ
// ======================================

function saveProfile() {

    const input =
        document.getElementById("playerId");

    const playerId =
        input.value.trim();


    if (!playerId) {

        alert("Введите игровой ID.");

        return;
    }


    localStorage.setItem(
        "rustPlayerId",
        playerId
    );


    alert("Профиль сохранён!");

}


// ======================================
// ОФОРМЛЕНИЕ
// ======================================

function checkout() {

    if (cart.length === 0) {

        alert("Корзина пустая.");

        return;
    }


    const savedId =
        localStorage.getItem("rustPlayerId");


    if (savedId) {

        document
            .getElementById("checkoutPlayerId")
            .value = savedId;

    }
// ======================================
// ГЕНЕРАЦИЯ НОМЕРА ЗАКАЗА
// ======================================

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


// ======================================
// ТОВАРЫ В ОФОРМЛЕНИИ
// ======================================

function renderCheckoutItems() {

    const container =
        document.getElementById("checkoutItems");


    const totalElement =
        document.getElementById("checkoutTotal");


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


// ======================================
// СОЗДАНИЕ ЗАКАЗА
// ======================================

function createOrder() {

    const playerId =
        document
            .getElementById("checkoutPlayerId")
            .value
            .trim();


    const paymentMethod =
        document
            .getElementById("paymentMethod")
            .value;


    const agreement =
        document
            .getElementById("agreement")
            .checked;


    const orderNumber =
        document
            .getElementById("orderNumber")
            .textContent;


    if (!playerId) {

        alert(
            "Введите игровой ID."
        );

        return;
    }


    if (!agreement) {

        alert(
            "Подтвердите правильность игрового ID."
        );

        return;
    }


    let total = 0;


    cart.forEach(item => {
        total += item.price;
    });


    // Сохраняем ID игрока

    localStorage.setItem(
        "rustPlayerId",
        playerId
    );


    // Создаём объект заказа

    const order = {

        id: orderNumber,

        playerId: playerId,

        items: [...cart],

        total: total,

        paymentMethod: paymentMethod,

        status: "Создан",

        date: new Date().toISOString()

    };


    // Получаем старые заказы

    let orders =
        JSON.parse(
            localStorage.getItem("rustOrders") || "[]"
        );


    // Добавляем новый заказ

    orders.unshift(order);


    // Сохраняем

    localStorage.setItem(
        "rustOrders",
        JSON.stringify(orders)
    );


    // Показываем результат

    document
        .getElementById("successOrderNumber")
        .textContent = orderNumber;


    document
        .getElementById("successPlayerId")
        .textContent = playerId;


    document
        .getElementById("successTotal")
        .textContent =
            formatPrice(total) + " ₽";


    // Обновляем список заказов

    renderOrders();


    // Очищаем корзину

    cart = [];

    updateCart();


    closeModal("checkoutModal");

    openModal("successModal");

}


// ======================================
// КОПИРОВАНИЕ НОМЕРА
// ======================================

function copyOrderNumber() {

    const number =
        document
            .getElementById("orderNumber")
            .textContent;


    navigator.clipboard
        .writeText(number);


    alert(
        "Номер заказа скопирован."
    );

}


function copySuccessOrder() {

    const number =
        document
            .getElementById("successOrderNumber")
            .textContent;


    navigator.clipboard
        .writeText(number);


    alert(
        "Номер заказа скопирован."
    );

}


// ======================================
// МОИ ЗАКАЗЫ
// ======================================

function renderOrders() {

    const container =
        document.getElementById("ordersList");


    const orders =
        JSON.parse(
            localStorage.getItem("rustOrders") || "[]"
        );


    if (orders.length === 0) {

        container.innerHTML = `
            Заказов пока нет
        `;

        return;
    }


    container.innerHTML = "";


    orders.forEach(order => {

        const date =
            new Date(order.date);


        const dateText =
            date.toLocaleString("ru-RU");


        container.innerHTML += `

            <div class="checkout-item">

                <div>

                    <div class="checkout-item-name">
                        ${order.id}
                    </div>

                    <div
                        style="
                            color:#777;
                            font-size:12px;
                            margin-top:5px;
                        "
                    >
                        ID: ${order.playerId}
                        <br>
                        ${dateText}
                    </div>

                </div>

                <div>

                    <div class="checkout-item-price">
                        ${formatPrice(order.total)} ₽
                    </div>

                    <div
                        style="
                            color:#69b56f;
                            font-size:12px;
                            text-align:right;
                            margin-top:5px;
                        "
                    >
                        ${order.status}
                    </div>

                </div>

            </div>

        `;

    });

}

    const orderNumber =
        generateOrderNumber();


    document
        .getElementById("orderNumber")
        .textContent = orderNumber;


    renderCheckoutItems();


    closeModal("cartModal");

    openModal("checkoutModal");

}


    const playerId =
        localStorage.getItem("rustPlayerId");


    if (!playerId) {

        closeModal("cartModal");

        openProfile();

        alert(
            "Сначала укажите игровой ID."
        );

        return;
    }


    /*
        На следующем этапе сюда подключим:

        1. страницу оформления;
        2. проверку игрового ID;
        3. выбор способа оплаты;
        4. создание номера заказа;
        5. отправку заказа в Telegram;
        6. реальную оплату.
    */

    alert(
        "Оформление заказа будет подключено следующим этапом."
    );

}


// ======================================
// ЗАКРЫТИЕ МОДАЛОК ПО ФОНУ
// ======================================

document
    .querySelectorAll(".modal")
    .forEach(modal => {

        modal.addEventListener(
            "click",
            function(event) {

                if (event.target === modal) {

                    modal.classList.remove("show");

                }

            }
        );

    });


// ======================================
// ESC
// ======================================

document.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Escape") {

            document
                .querySelectorAll(".modal")
                .forEach(modal => {

                    modal.classList.remove("show");

                });

        }

    }
);


// ======================================
// СТАРТ
// ======================================

updateCart();