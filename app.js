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

        renderCart();
        updateSummary();
    });
});

emptyCartBtn.addEventListener("click", () => {
    cart =[];
   
});
