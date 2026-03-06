/* =========================
   CART SETUP
========================= */

const userEmail = localStorage.getItem("userEmail") || "guest";
const CART_KEY = `cart_${userEmail}`;

let cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];

/* توحيد شكل العناصر + ضمان id */
cart = cart.map(item => ({
  id: item.id || item.name,   // fallback للقديم
  name: item.name,
  price: Number(item.price),
  image: item.image,
  qty: Number(item.qty) || 1
}));

saveCart();

/* =========================
   HELPERS
========================= */

function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function getTotalQty() {
  return cart.reduce((sum, item) => sum + item.qty, 0);
}

function getTotalPrice() {
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}
function goToCheckout() {
  window.location.href = "checkout.html";
}

/* =========================
   CART COUNT (HEADER)
========================= */

const cartCountEls = document.querySelectorAll("#cart-count");

function updateCartCount() {
  const totalQty = getTotalQty();
  cartCountEls.forEach(el => el && (el.textContent = totalQty));
}

updateCartCount();

/* =========================
   ADD TO CART
========================= */

window.addToCart = function (id, name, price, image) {
  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      id,
      name,
      price: Number(price),
      image,
      qty: 1
    });
  }

  saveCart();
  updateCartCount();
  alert("The Product has been added to the cart🛒");
};

/* ربط الأزرار */
document.querySelectorAll(".product-card").forEach(card => {
  const btn = card.querySelector(".add-btn");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const id = card.dataset.id;
    const name = card.querySelector("h3")?.textContent.trim() || "";
    const price = Number(
      card.querySelector(".price")?.textContent.replace("$", "")
    ) || 0;
    const image = card.querySelector("img")?.src || "";

    addToCart(id, name, price, image);
  });
});

/* =========================
   CART PAGE
========================= */

const cartItemsEl = document.getElementById("cart-items");
const totalItemsEl = document.getElementById("total-items");
const totalPriceEl = document.getElementById("total-price");
const clearCartBtn = document.getElementById("clear-cart");

function renderCart() {
  if (!cartItemsEl) return;

  cartItemsEl.innerHTML = "";

  cart.forEach((item, index) => {
    cartItemsEl.innerHTML += `
      <div class="cart-item">
        <img src="${item.image}">
        <div class="cart-info">
          <h3>${item.name}</h3>
          <p>$${item.price}</p>

          <div class="qty">
            <button onclick="changeQty(${index}, -1)">−</button>
            <span>${item.qty}</span>
            <button onclick="changeQty(${index}, 1)">+</button>
          </div>
        </div>

        <button class="remove-btn" onclick="removeItem(${index})">×</button>
      </div>
    `;
  });

  totalItemsEl && (totalItemsEl.textContent = getTotalQty());
  totalPriceEl && (totalPriceEl.textContent = `$${getTotalPrice()}`);
}

window.changeQty = function (index, amount) {
  cart[index].qty += amount;

  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }

  saveCart();
  updateCartCount();
  renderCart();
};

window.removeItem = function (index) {
  cart.splice(index, 1);
  saveCart();
  updateCartCount();
  renderCart();
};

clearCartBtn?.addEventListener("click", () => {
  cart = [];
  saveCart();
  updateCartCount();
  renderCart();
});

/* أول رسم */
renderCart();
const slides = document.querySelectorAll(".promo-slide");
const dots = document.querySelectorAll(".dot");
const nextBtn = document.querySelector(".next");
const prevBtn = document.querySelector(".prev");

if (slides.length > 0) {

  let index = 0;

  function showSlide(i) {
    slides.forEach(slide => slide.classList.remove("active"));
    dots.forEach(dot => dot.classList.remove("active"));

    slides[i].classList.add("active");
    if (dots[i]) dots[i].classList.add("active");
  }

  if (nextBtn) {
    nextBtn.onclick = () => {
      index = (index + 1) % slides.length;
      showSlide(index);
    };
  }

  if (prevBtn) {
    prevBtn.onclick = () => {
      index = (index - 1 + slides.length) % slides.length;
      showSlide(index);
    };
  }

  dots.forEach((dot, i) => {
    dot.onclick = () => {
      index = i;
      showSlide(index);
    };
  });

  setInterval(() => {
    index = (index + 1) % slides.length;
    showSlide(index);
  }, 4000);
}
