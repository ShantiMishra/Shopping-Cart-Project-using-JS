const addButtons = document.querySelectorAll(".add-to-cart");
const cartList = document.getElementById("cart-list");
const cartEmpty = document.getElementById("cart-empty");

const itemsCount = document.getElementById("items-count");
const subtotalText = document.getElementById("subtotal");
const discountText = document.getElementById("discount");
const finalTotalText = document.getElementById("final-total");
const discountTierText = document.getElementById("discount-tier");

const emptyCartBtn = document.getElementById("empty-cart");

let cart =[];


function getPrice(text) {  // String form mee jo prize hai unko number mee convert karega aur, replace $ ko replace karega ""with empty string.
    return parseFloat(text.replace("$", ""));
}


addButtons.forEach(button => {
    button.addEventListener("click", () => {

        const card = button.parentElement;
        const name = card.querySelector(".product-name").textContent;
        const priceText = card.querySelector(".product-price").textContent;
        const price = getPrice(priceText);

         let found = false;

        cart.forEach(item => {
            if (item.name === name) {
                item.qty++;
                found = true;
            }
        });

        if (!found) {
            cart.push({
                name: name,
                price: price,
                qty: 1
            });
        }

        updateSummary();
        renderCart();
    });
});


function renderCart() {
    cartList.innerHTML = "";

    if (cart.length === 0) {
        cartEmpty.style.display = "block";
    } else {
        cartEmpty.style.display = "none";
    }

    cart.forEach(item => {
        const li = document.createElement("li");
        li.textContent = `${item.name} — $${item.price}  (Qty: ${item.qty})`;
        cartList.appendChild(li);
    });

      updateSummary();
}



 function updateSummary() {

    let subtotal = 0;
    let itemTotal = 0;

    cart.forEach(item => {
        subtotal += item.price * item.qty;
        itemTotal += item.qty;
    });

    itemsCount.textContent = "Items in cart: " + itemTotal;
    subtotalText.textContent = "Subtotal: $" + subtotal.toFixed(2);

    discountText.textContent = "Discount: $0.00";
    finalTotalText.innerHTML = "<strong>Final Total: $" + subtotal.toFixed(2) + "</strong>";
    discountTierText.textContent = "No discount applied";
}

emptyCartBtn.addEventListener("click", () => {
    cart =[];
   
    updateSummary();
    renderCart();
});

renderCart();
updateSummary();
