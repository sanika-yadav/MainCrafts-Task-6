export const CART_KEY = "shopease-cart";
export const money = value => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(Number(value) || 0);
export function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch { return []; }
}
export function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
}
export function updateCartCount() {
  const count = getCart().reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll("#cart-count").forEach(el => el.textContent = count);
}
export function addToCart(product) {
  const cart = getCart();
  const found = cart.find(item => String(item.id) === String(product.id));
  if (found) found.quantity += 1;
  else cart.push({ id: product.id, title: product.title, price: Number(product.price), image: product.image, quantity: 1 });
  saveCart(cart);
}
export function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
export function placeholderImage() {
  return "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect width="100%" height="100%" fill="#f0f2f5"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#8992a3" font-family="Arial" font-size="18">No image available</text></svg>');
}
