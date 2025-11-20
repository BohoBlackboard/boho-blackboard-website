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
  cart.push({ name, price: Number(price), image });
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
    total += Number(item.price);

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

// Listen for Add-to-Cart button clicks
document.addEventListener("click", function (event) {
  if (event.target.classList.contains("add-to-cart")) {
    event.preventDefault();

    const name = event.target.dataset.product;
    const price = event.target.dataset.price;
    const image = event.target.dataset.image || ""; // optional

    addToCart(name, price, image);
  }
});

// Run counter updater on load
document.addEventListener("DOMContentLoaded", updateCartCount);
// ---------- PAYFAST INTEGRATION ----------
function updatePayFastFields() {
  const cart = getCart();

  // Build product list (PayFast only accepts 100 chars)
  let itemNames = cart.map(item => item.name).join(", ");
  if (itemNames.length > 100) {
    itemNames = itemNames.substring(0, 97) + "...";
  }

  // Calculate total
  const total = cart.reduce((sum, item) => sum + Number(item.price), 0);

  // Assign values to hidden PayFast fields
  const amountField = document.getElementById("pf-amount");
  const itemField = document.getElementById("pf-item-name");

  if (amountField) amountField.value = total.toFixed(2);
  if (itemField) itemField.value = itemNames;
}

// Re-run PayFast field sync when cart updates
document.addEventListener("DOMContentLoaded", () => {
  updateCartPage();
  updateCartCount();
  updatePayFastFields();
});

