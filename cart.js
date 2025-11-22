// =====================================================
// CART STORAGE
// =====================================================
function getCart() {
  return JSON.parse(localStorage.getItem("cart") || "[]");
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function setCustomerEmail(email) {
  localStorage.setItem("customer_email", email);
}

function getCustomerEmail() {
  return localStorage.getItem("customer_email") || "";
}

// =====================================================
// ADD / REMOVE ITEMS
// =====================================================
const unavailableCodes = ["BEAR_EN", "BEAR_AF", "BUN_EN", "BUN_AF", "SQR_EN", "SQR_AF", "RNG_EN", "RNG_AF"];

function addToCart(name, price, image = "", code) {
  if (unavailableCodes.includes(code)) {
    alert(`${name} is not available yet and cannot be purchased.`);
    return;
  }

  const cart = getCart();
  cart.push({ name, price: Number(price), image, code });
  saveCart(cart);
  updateCartCount();
  alert(`${name} added to your cart!`);
}

function removeFromCart(index) {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  updateCartPage();
  updateCartCount();
}

// =====================================================
// CART COUNT
// =====================================================
function updateCartCount() {
  const cart = getCart();
  const el = document.getElementById("cart-count");
  if (el) el.textContent = cart.length;
}

// =====================================================
// CART PAGE RENDERING
// =====================================================
function updateCartPage() {
  const container = document.getElementById("cart-items");
  const totalEl = document.getElementById("cart-total");
  if (!container) return;

  const cart = getCart();
  container.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price;

    container.innerHTML += `
      <div class="cart-item">
        <img src="${item.image}" class="cart-thumb">
        <div class="cart-info">
          <h4>${item.name}</h4>
          <p>R${item.price}</p>
        </div>
        <button class="remove-btn" onclick="removeFromCart(${index})">Remove</button>
      </div>
    `;
  });

  if (totalEl) totalEl.textContent = "R" + total;
}

// =====================================================
// BLOCK CHECKOUT FOR UNAVAILABLE THEMES
// =====================================================
function cartContainsUnavailable() {
  const cart = getCart();
  return cart.some(item => unavailableCodes.includes(item.code));
}

// =====================================================
// PAYFAST PREPARATION
// =====================================================
function prepareCheckout() {
  const email = document.getElementById("customerEmail").value;

  if (!email) {
    alert("Please enter your email address.");
    return false;
  }

  // block unavailable themes
  if (cartContainsUnavailable()) {
    alert("Your cart contains themes that are not yet available. Please remove them to continue.");
    return false;
  }

  setCustomerEmail(email);

  const cart = getCart();
  const total = cart.reduce((sum, i) => sum + i.price, 0);

  document.getElementById("pf-amount").value = total.toFixed(2);

  let names = cart.map(i => i.name).join(", ");
  if (names.length > 100) names = names.substring(0, 97) + "...";
  document.getElementById("pf-item-name").value = names;

  return true;
}

// =====================================================
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  updateCartPage();
});
