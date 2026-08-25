let cart = [];


// ==============================
// КАТЕГОРИИ
// ==============================

function showCategory(category, button) {

    document.querySelectorAll(".products-section")
        .forEach(section => {
            section.classList.add("hidden");
        });

    document.getElementById(category)
        .classList.remove("hidden");


    document.querySelectorAll(".category")
        .forEach(btn => {
            btn.classList.remove("active");
        });

    button.classList.add("active");

}


// ==============================
// КОРЗИНА
// ==============================

function addToCart(name, price) {

    cart.push({
        name: name,
        price: price
    });

    updateCart();

    openCart();
}


function removeFromCart(index) {

    cart.splice(index, 1);

    updateCart();
}


function updateCart() {

    const cartItems =
        document.getElementById("cartItems");

    const cartCount =
        document.getElementById("cartCount");

    const cartTotal =
        document.getElementById("cartTotal");


    cartCount.innerText = cart.length;


    if (cart.length === 0) {

        cartItems.innerHTML = `
            <p style="
                color:#777;
                text-align:center;
                padding:30px 0;
            ">
                Корзина пустая
            </p>
        `;

        cartTotal.innerText = "0 ₽";

        return;
    }


    let total = 0;


    cartItems.innerHTML = "";


    cart.forEach((item, index) => {

        total += item.price;


        cartItems.innerHTML += `

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


    cartTotal.innerText =
        formatPrice(total) + " ₽";
}


// ==============================
// ФОРМАТ ЦЕНЫ
// ==============================

function formatPrice(price) {

    return price.toLocaleString("ru-RU");

}


// ==============================
// ОТКРЫТЬ КОРЗИНУ
// ==============================

function openCart() {

    document
        .getElementById("cartModal")
        .classList.add("show");

}


// ==============================
// ЗАКРЫТЬ КОРЗИНУ
// ==============================

function closeCart() {

    document
        .getElementById("cartModal")
        .classList.remove("show");

}


// ==============================
// ОФОРМЛЕНИЕ
// ==============================

function checkout() {

    if (cart.length === 0) {

        alert("Корзина пустая!");

        return;
    }


    alert(
        "Здесь подключим оформление заказа и оплату."
    );

}


// ==============================
// ЗАКРЫТИЕ ПО КЛИКУ ВНЕ ОКНА
// ==============================

document
    .getElementById("cartModal")
    .addEventListener("click", function(event) {

        if (event.target === this) {
            closeCart();
        }

    });


// ==============================
// НАЧАЛЬНАЯ ИНИЦИАЛИЗАЦИЯ
// ==============================

updateCart();