# ShopEase — Full Stack Web Development Internship Task 6

A responsive product catalog that consumes FakeStoreAPI with `fetch()` and `async/await`, using a dedicated API service layer.

## Features
- Live product loading with spinner, friendly error state, and Retry button
- Search by title, description, or category
- Category filter and sorting by name, price, or rating
- Pagination (8 products per page)
- Product detail page
- Add product form using POST
- Delete button on each product using DELETE
- Cart quantity controls and LocalStorage persistence
- Responsive layout for desktop, tablet, and mobile
- All HTTP calls are centralized in `api.js`

## Run locally
Because this project uses JavaScript ES modules, open it through a local web server rather than `file://`.

### Option 1: VS Code Live Server
1. Extract the ZIP.
2. Open the `ShopEase_Task6` folder in VS Code.
3. Install the **Live Server** extension if needed.
4. Right-click `index.html` and choose **Open with Live Server**.

### Option 2: Python
From the project folder run:
```bash
python -m http.server 5500
```
Then visit `http://localhost:5500`.

## API behavior note
The project uses `https://fakestoreapi.com/products`. FakeStoreAPI is a demo API: POST and DELETE requests return simulated responses and are **not persisted as a real database change**. Added products are shown in the current browser session, and a page refresh reloads the API's original catalog. For persistent CRUD, switch `BASE_URL` in `api.js` to a JSON Server or your own backend.

## Files
- `index.html` — catalog, filters, loading/error states, add form
- `product.html` / `product.js` — product details
- `cart.html` / `cart.js` — cart interface and LocalStorage cart persistence
- `api.js` — GET, POST, DELETE requests and response/error handling
- `common.js` — shared cart, currency, and safe HTML utilities
- `script.js` — catalog UI logic
- `style.css` — responsive styling

## Task 6 checklist
- [x] Products loaded from live API
- [x] Loading spinner
- [x] User-friendly error handling and retry
- [x] POST request for adding product
- [x] DELETE request per product
- [x] Dedicated `api.js` service layer
- [x] Async/await and try/catch
- [x] Search, category filter, sorting, pagination
- [x] Cart persists using LocalStorage
