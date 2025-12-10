// ----------------- Product data (4 products) -----------------
const products = [
  { id: 1, name: "Notebook", price: 12.99 },
  { id: 2, name: "Water Bottle", price: 9.5 },
  { id: 3, name: "Headphones", price: 39.99 },
  { id: 4, name: "Backpack", price: 49.0 }
];

// ----------------- DOM refs -----------------
const productsEl = document.getElementById('products');
const cartListEl = document.getElementById('cart-list');
const cartEmptyEl = document.getElementById('cart-empty');

const itemsCountEl = document.getElementById('items-count');
const subtotalEl = document.getElementById('subtotal');
const discountEl = document.getElementById('discount');
const finalTotalEl = document.getElementById('final-total');
const discountTierEl = document.getElementById('discount-tier');

const emptyCartBtn = document.getElementById('empty-cart');

// ----------------- Cart state -----------------
// cart will map productId -> { product, qty }
const cart = {};

// ----------------- Helpers -----------------
function formatPrice(n) {
  return '$' + n.toFixed(2);
}

// compute subtotal etc
function computeSummary() {
  let subtotal = 0;
  let totalItems = 0;
  Object.values(cart).forEach(entry => {
    subtotal += entry.product.price * entry.qty;
    totalItems += entry.qty;
  });

  // discount rules
  let discount = 0;
  let tierText = "No discount applied";
  if (subtotal >= 100) {
    discount = subtotal * 0.15;
    tierText = "15% discount active!";
  } else if (subtotal >= 50) {
    discount = subtotal * 0.10;
    tierText = "10% discount active!";
  }

  const finalTotal = subtotal - discount;
  return {
    subtotal,
    discount,
    finalTotal,
    totalItems,
    tierText
  };
}

// ----------------- Rendering -----------------

// Products rendering (cards)
function renderProducts() {
  productsEl.innerHTML = '';
  products.forEach(p => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <h3>${p.name}</h3>
      <div class="price">${formatPrice(p.price)}</div>
      <button data-id="${p.id}">Add to Cart</button>
    `;
    const btn = card.querySelector('button');
    // disable if already in cart
    if (cart[p.id]) {
      btn.textContent = 'Already Added';
      btn.disabled = true;
    }
    btn.addEventListener('click', () => addToCart(p.id));
    productsEl.appendChild(card);
  });
}

// Cart rendering
function renderCart() {
  cartListEl.innerHTML = '';

  const entries = Object.values(cart);
  if (entries.length === 0) {
    cartEmptyEl.style.display = 'block';
  } else {
    cartEmptyEl.style.display = 'none';
  }

  entries.forEach(entry => {
    const { product, qty } = entry;
    const li = document.createElement('li');
    li.className = 'cart-item';
    li.dataset.id = product.id;

    // create inner HTML with placeholders
    li.innerHTML = `
      <div class="name">${product.name} <span class="badge-wrapper"></span></div>
      <div class="price">${formatPrice(product.price)}</div>

      <div class="qty-controls">
        <button class="btn-decrease">-</button>
        <div class="qty">${qty}</div>
        <button class="btn-increase">+</button>
      </div>

      <div class="line-total">${formatPrice(product.price * qty)}</div>

      <button class="btn-remove" title="Remove">×</button>
    `;

    // get references inside this li
    const decBtn = li.querySelector('.btn-decrease');
    const incBtn = li.querySelector('.btn-increase');
    const qtyEl = li.querySelector('.qty');
    const lineTotalEl = li.querySelector('.line-total');
    const badgeWrapper = li.querySelector('.badge-wrapper');
    const removeBtn = li.querySelector('.btn-remove');

    // disable decrease when qty is 1
    decBtn.disabled = qty <= 1;

    // show bulk badge if qty >= 5
    badgeWrapper.innerHTML = '';
    if (qty >= 5) {
      const b = document.createElement('span');
      b.className = 'badge';
      b.textContent = 'Bulk!';
      badgeWrapper.appendChild(b);
    }

    // attach handlers
    incBtn.addEventListener('click', () => {
      cart[product.id].qty++;
      qtyEl.textContent = cart[product.id].qty;
      decBtn.disabled = cart[product.id].qty <= 1;
      lineTotalEl.textContent = formatPrice(cart[product.id].product.price * cart[product.id].qty);
      // re-render products and summary (badge maybe)
      renderProducts();
      updateSummaryDisplay();
      // update this item badge too (quick re-render entire cart safe)
      renderCart();
    });

    decBtn.addEventListener('click', () => {
      if (cart[product.id].qty > 1) {
        cart[product.id].qty--;
        qtyEl.textContent = cart[product.id].qty;
        decBtn.disabled = cart[product.id].qty <= 1;
        lineTotalEl.textContent = formatPrice(cart[product.id].product.price * cart[product.id].qty);
        renderProducts();
        updateSummaryDisplay();
        renderCart();
      }
    });

    removeBtn.addEventListener('click', () => {
      delete cart[product.id];
      renderProducts();
      renderCart();
      updateSummaryDisplay();
    });

    cartListEl.appendChild(li);
  });
}

// Update summary DOM
function updateSummaryDisplay() {
  const s = computeSummary();
  itemsCountEl.textContent = `Items in cart: ${s.totalItems}`;
  subtotalEl.textContent = `Subtotal: ${formatPrice(s.subtotal)}`;
  discountEl.textContent = `Discount: -${formatPrice(s.discount)}`;
  finalTotalEl.innerHTML = `<strong>Final Total: ${formatPrice(s.finalTotal)}</strong>`;
  discountTierEl.textContent = s.tierText;
}

// ----------------- Actions -----------------

function addToCart(productId) {
  const p = products.find(x => x.id === productId);
  if (!p) return;
  if (cart[productId]) {
    // already in cart: do nothing (button is disabled from renderProducts anyway)
    return;
  }
  cart[productId] = { product: p, qty: 1 };
  renderProducts();
  renderCart();
  updateSummaryDisplay();
}

// Empty cart
emptyCartBtn.addEventListener('click', () => {
  for (const id in cart) delete cart[id];
  renderProducts();
  renderCart();
  updateSummaryDisplay();
});

// ----------------- initial render -----------------
renderProducts();
renderCart();
updateSummaryDisplay();
