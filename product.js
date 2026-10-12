import { fetchProduct } from "./api.js";
import { addToCart, updateCartCount, money, escapeHTML, placeholderImage } from "./common.js";
const root = document.querySelector("#product-detail");
const loading = document.querySelector("#detail-loading");
async function init() {
  const id = new URLSearchParams(location.search).get("id");
  if (!id) { loading.classList.add("hidden"); root.innerHTML = '<div class="error-box">No product selected. <a href="index.html">Browse products</a></div>'; return; }
  try {
    const p = await fetchProduct(id);
    root.innerHTML = `<div class="detail-layout"><div class="detail-image"><img src="${escapeHTML(p.image || "")}" alt="${escapeHTML(p.title)}" onerror="this.src='${placeholderImage()}'"></div><div class="detail-copy"><p class="product-category">${escapeHTML(p.category || "General")}</p><h1>${escapeHTML(p.title)}</h1><div class="rating">★ ${p.rating?.rate ?? 0} <span>(${p.rating?.count ?? 0} reviews)</span></div><p class="detail-description">${escapeHTML(p.description || "No description available.")}</p><div class="detail-price">${money(p.price)}</div><button id="detail-add" class="primary-btn">Add to cart</button><p id="detail-status" class="form-status" role="status"></p></div></div>`;
    document.querySelector("#detail-add").addEventListener("click", () => { addToCart(p); document.querySelector("#detail-status").textContent = "Added to your cart."; });
  } catch (error) { root.innerHTML = `<div class="error-box"><strong>Unable to load this product.</strong><p>${escapeHTML(error.message)}</p><a href="index.html">Back to products</a></div>`; }
  finally { loading.classList.add("hidden"); }
}
updateCartCount(); init();
