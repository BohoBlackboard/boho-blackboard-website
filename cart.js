// Load cart from localStorage or create an empty one
function getCart() {
  return JSON.parse(localStorage.getItem("cart") || "[]");
}

// Save cart
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Add item
function addToCart(name, price, image = "") {
  const cart = getCart();
  cart.push({ name, price, image });
  saveCart(cart);
  updateCartCount();
  alert(`${name} added to cart!`);
}

// Remove item
function removeFromCart(index) {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  updateCartPage();
  updateCartCount();
}

// Update counter bubble
function updateCartCount() {
  const cart = getCart();
  const countElement = document.getElementById("cart-count");
  if (countElement) countElement.textContent = cart.length;
}

// Build the cart page
function updateCartPage() {
  const container = document.getElementById("cart-items");
  const totalEl = document.getElementById("cart-total");

  if (!container) return;

  const cart = getCart();
  container.innerHTML = "";

  let total = 0;

  cart.forEach((item, index) => {
    total += item.price;

    const card = document.createElement("div");
    card.classList.add("cart-item");

    card.innerHTML = `
      <img src="${item.image}" class="cart-thumb">
      <div class="cart-info">
        <h4>${item.name}</h4>
        <p>R${item.price}</p>
      </div>
      <button class="remove-btn" onclick="removeFromCart(${index})">Remove</button>
    `;
    container.appendChild(card);
  });

  totalEl.textContent = "R" + total;
}

// Run counter updater on load
document.addEventListener("DOMContentLoaded", updateCartCount);
