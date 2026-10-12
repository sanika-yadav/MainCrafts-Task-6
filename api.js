// All HTTP requests are kept in this service layer.
const BASE_URL = "https://fakestoreapi.com";

async function request(url, options = {}) {
  let response;
  try {
    response = await fetch(url, options);
  } catch (error) {
    throw new Error("Network error. Check your internet connection and try again.");
  }
  if (!response.ok) throw new Error(`The server returned HTTP ${response.status}. Please try again.`);
  return response.json();
}

export async function fetchProducts() {
  return request(`${BASE_URL}/products`);
}
export async function fetchProduct(id) {
  return request(`${BASE_URL}/products/${encodeURIComponent(id)}`);
}
export async function addProduct(product) {
  return request(`${BASE_URL}/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product)
  });
}
export async function deleteProduct(id) {
  return request(`${BASE_URL}/products/${encodeURIComponent(id)}`, { method: "DELETE" });
}
