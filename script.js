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