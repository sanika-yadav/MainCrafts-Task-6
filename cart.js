import { getCart, saveCart, updateCartCount, money, escapeHTML, placeholderImage } from "./common.js";
const root = document.querySelector("#cart-content");
function render() {
  const cart = getCart();
  updateCartCount();
  if (!cart.length) {
    root.innerHTML = `<div class="empty-state"><div>♡</div><h2>Your cart is waiting</h2><p>Looks like you haven't added anything yet.</p><a class="primary-btn inline-btn" href="index.html">Explore products</a></div>`;
    return;
  }
  const total = cart.reduce((sum, p) => sum + p.price*p.quantity, 0);
  root.innerHTML = `<div class="cart-layout"><section class="cart-items">${cart.map(p => `<article class="cart-item"><img src="${escapeHTML(p.image || "")}" alt="${escapeHTML(p.title)}" onerror="this.src='${placeholderImage()}'"><div class="cart-item-info"><h3>${escapeHTML(p.title)}</h3><p>${money(p.price)}</p><div class="quantity"><button data-qty="-1" data-id="${escapeHTML(p.id)}" aria-label="Decrease quantity">−</button><span>${p.quantity}</span><button data-qty="1" data-id="${escapeHTML(p.id)}" aria-label="Increase quantity">＋</button></div></div><button class="remove-btn" data-remove="${escapeHTML(p.id)}">Remove</button></article>`).join("")}</section><aside class="summary"><h2>Order summary</h2><div><span>Items (${cart.reduce((n,p)=>n+p.quantity,0)})</span><strong>${money(total)}</strong></div><div><span>Delivery</span><strong>Free</strong></div><hr><div class="summary-total"><span>Total</span><strong>${money(total)}</strong></div><button id="checkout" class="primary-btn full-width">Continue to checkout</button><p class="form-status" id="checkout-status"></p></aside></div>`;
}
root.addEventListener("click", e => {
  const qty = e.target.closest("[data-qty]");
  const remove = e.target.closest("[data-remove]");
  if (qty) {
    const cart = getCart(); const item = cart.find(p => String(p.id) === qty.dataset.id);
    if (item) { item.quantity += Number(qty.dataset.qty); saveCart(cart.filter(p => p.quantity > 0)); render(); }
  } else if (remove) { saveCart(getCart().filter(p => String(p.id) !== remove.dataset.remove)); render(); }
  else if (e.target.closest("#checkout")) document.querySelector("#checkout-status").textContent = "Demo checkout only — no payment has been processed.";
});
render();
