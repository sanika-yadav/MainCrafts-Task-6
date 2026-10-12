import { fetchProducts, addProduct, deleteProduct } from "./api.js";
import { addToCart, updateCartCount, money, escapeHTML, placeholderImage } from "./common.js";

const grid = document.querySelector("#product-grid");
const spinner = document.querySelector("#spinner");
const errorBox = document.querySelector("#error-msg");
const errorDetail = document.querySelector("#error-detail");
const emptyState = document.querySelector("#empty-state");
const resultCount = document.querySelector("#result-count");
const pagination = document.querySelector("#pagination");
const search = document.querySelector("#search");
const category = document.querySelector("#category");
const sort = document.querySelector("#sort");
const PAGE_SIZE = 8;
let products = [];
let currentPage = 1;

async function loadProducts() {
  spinner.classList.remove("hidden");
  errorBox.classList.add("hidden");
  grid.innerHTML = "";
  pagination.innerHTML = "";
  resultCount.textContent = "Loading products…";
  try {
    products = await fetchProducts();
    populateCategories();
    renderProducts();
  } catch (error) {
    errorDetail.textContent = error.message || "Please check your connection and try again.";
    errorBox.classList.remove("hidden");
    resultCount.textContent = "Products unavailable";
    console.error(error);
  } finally {
    spinner.classList.add("hidden");
  }
}
function populateCategories() {
  const previous = category.value || "all";
  const values = [...new Set(products.map(p => p.category).filter(Boolean))].sort();
  category.innerHTML = '<option value="all">All categories</option>' + values.map(c => `<option value="${escapeHTML(c)}">${escapeHTML(c.charAt(0).toUpperCase() + c.slice(1))}</option>`).join("");
  if (values.includes(previous)) category.value = previous;
}
function filteredProducts() {
  let list = products.filter(p => {
    const term = search.value.trim().toLowerCase();
    return (!term || `${p.title} ${p.description || ""} ${p.category || ""}`.toLowerCase().includes(term))
      && (category.value === "all" || p.category === category.value);
  });
  switch (sort.value) {
    case "name-asc": list.sort((a,b) => a.title.localeCompare(b.title)); break;
    case "price-asc": list.sort((a,b) => a.price-b.price); break;
    case "price-desc": list.sort((a,b) => b.price-a.price); break;
    case "rating-desc": list.sort((a,b) => (b.rating?.rate || 0)-(a.rating?.rate || 0)); break;
  }
  return list;
}
function renderProducts() {
  const list = filteredProducts();
  const pages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  currentPage = Math.min(currentPage, pages);
  const shown = list.slice((currentPage-1)*PAGE_SIZE, currentPage*PAGE_SIZE);
  resultCount.textContent = `${list.length} product${list.length === 1 ? "" : "s"} found`;
  emptyState.classList.toggle("hidden", list.length !== 0);
  grid.innerHTML = shown.map(p => `
    <article class="product-card">
      <a class="product-image" href="product.html?id=${encodeURIComponent(p.id)}"><img src="${escapeHTML(p.image || "")}" alt="${escapeHTML(p.title)}" loading="lazy" onerror="this.src='${placeholderImage()}'"></a>
      <div class="product-info"><p class="product-category">${escapeHTML(p.category || "General")}</p>
        <a class="product-title" href="product.html?id=${encodeURIComponent(p.id)}">${escapeHTML(p.title)}</a>
        <div class="rating">★ ${(p.rating?.rate ?? 0)} <span>(${p.rating?.count ?? 0} reviews)</span></div>
        <div class="card-bottom"><strong>${money(p.price)}</strong><button class="icon-btn add-cart" data-id="${escapeHTML(p.id)}" aria-label="Add ${escapeHTML(p.title)} to cart">＋</button></div>
        <button class="delete-btn" data-delete="${escapeHTML(p.id)}">Delete product</button>
      </div>
    </article>`).join("");
  pagination.innerHTML = pages > 1 ? `<button data-page="${currentPage-1}" ${currentPage===1?"disabled":""}>← Previous</button><span>Page ${currentPage} of ${pages}</span><button data-page="${currentPage+1}" ${currentPage===pages?"disabled":""}>Next →</button>` : "";
}
[search, category, sort].forEach(el => el.addEventListener(el === search ? "input" : "change", () => { currentPage = 1; renderProducts(); }));
pagination.addEventListener("click", e => {
  const button = e.target.closest("[data-page]");
  if (!button || button.disabled) return;
  currentPage = Number(button.dataset.page); renderProducts(); window.scrollTo({ top: 0, behavior: "smooth" });
});
grid.addEventListener("click", async e => {
  const addButton = e.target.closest("[data-id]");
  if (addButton) {
    const p = products.find(item => String(item.id) === addButton.dataset.id);
    if (p) { addToCart(p); addButton.textContent = "✓"; setTimeout(() => addButton.textContent = "＋", 900); }
  }
  const deleteButton = e.target.closest("[data-delete]");
  if (deleteButton) {
    const id = deleteButton.dataset.delete;
    if (!confirm("Delete this product?")) return;
    deleteButton.disabled = true;
    try {
      await deleteProduct(id);
      products = products.filter(p => String(p.id) !== String(id));
      renderProducts();
    } catch (error) {
      alert(`Delete failed: ${error.message}`);
      deleteButton.disabled = false;
    }
  }
});
document.querySelector("#retry").addEventListener("click", loadProducts);
document.querySelector("#toggle-form").addEventListener("click", () => document.querySelector("#add-form").classList.toggle("hidden"));
document.querySelector("#add-form").addEventListener("submit", async e => {
  e.preventDefault();
  const status = document.querySelector("#form-status");
  const submit = e.target.querySelector('button[type="submit"]');
  const product = {
    title: document.querySelector("#title").value.trim(),
    price: Number(document.querySelector("#price").value),
    category: document.querySelector("#new-category").value,
    image: document.querySelector("#image").value.trim() || placeholderImage(),
    description: "Added from the ShopEase product admin form."
  };
  if (!product.title || !Number.isFinite(product.price) || product.price <= 0 || !product.category) {
    status.textContent = "Please enter a name, a valid price, and a category."; return;
  }
  submit.disabled = true; submit.textContent = "Saving…"; status.textContent = "";
  try {
    const created = await addProduct(product);
    // FakeStoreAPI simulates POST; use a client-side ID so the new card is usable in this session.
    products.unshift({ ...product, ...created, id: `local-${Date.now()}` });
    populateCategories(); category.value = "all"; search.value = ""; sort.value = "default"; currentPage = 1;
    renderProducts(); e.target.reset();
    status.textContent = "Product added to this session.";
  } catch (error) { status.textContent = `Could not add product: ${error.message}`; }
  finally { submit.disabled = false; submit.textContent = "Save product"; }
});
updateCartCount();
loadProducts();
