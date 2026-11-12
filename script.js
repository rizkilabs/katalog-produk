const products = [
  {
    id: 1,
    name: "Laptop Asus Vivobook",
    category: "Elektronik",
    price: 7500000,
  },
  {
    id: 2,
    name: "Smartphone Samsung A15",
    category: "Elektronik",
    price: 3200000,
  },
  { id: 3, name: "Headphone Bluetooth", category: "Elektronik", price: 450000 },
  { id: 4, name: "Kaos Polos Hitam", category: "Fashion", price: 75000 },
  { id: 5, name: "Kemeja Flanel", category: "Fashion", price: 180000 },
  { id: 6, name: "Sepatu Sneakers", category: "Fashion", price: 350000 },
  { id: 7, name: "Jaket Hoodie", category: "Fashion", price: 220000 },
  { id: 8, name: "Blender Philips", category: "Rumah", price: 650000 },
  { id: 9, name: "Rice Cooker Miyako", category: "Rumah", price: 400000 },
  { id: 10, name: "Lampu Meja LED", category: "Rumah", price: 120000 },
  { id: 11, name: "Buku Belajar JavaScript", category: "Buku", price: 95000 },
  { id: 12, name: "Buku Desain Web", category: "Buku", price: 110000 },
  { id: 13, name: "Novel Fiksi Populer", category: "Buku", price: 85000 },
  { id: 14, name: "Mouse Wireless", category: "Elektronik", price: 150000 },
  {
    id: 15,
    name: "Keyboard Mechanical",
    category: "Elektronik",
    price: 600000,
  },
  { id: 16, name: "Tas Ransel", category: "Fashion", price: 275000 },
];

const productListEl = document.getElementById("product-list");

function formatRupiah(angka) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(angka);
}

function renderProducts(list) {
  productListEl.innerHTML = "";

  if (list.length === 0) {
    productListEl.innerHTML = "<p>Produk tidak ditemukan.</p>";
    return;
  }

  list.forEach((product) => {
    const card = document.createElement("article");
    card.className = "product-card";
    card.innerHTML = `
      <span class="product-category">${product.category}</span>
      <h3 class="product-name">${product.name}</h3>
      <p class="product-price">${formatRupiah(product.price)}</p>
    `;
    productListEl.appendChild(card);
  });
}

const searchInput = document.getElementById("search-input");
const categoryFilter = document.getElementById("category-filter");
const sortPrice = document.getElementById("sort-price");
const paginationEl = document.getElementById("pagination");
const resultInfoEl = document.getElementById("result-info");
const ITEMS_PER_PAGE = 6;

// State: menyimpan kondisi pencarian/filter saat ini
const state = {
  search: "",
  category: "all",
  sort: "default",
  page: 1,
};

// Isi opsi kategori otomatis dari data produk
function populateCategories() {
  const categories = [...new Set(products.map((p) => p.category))];

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

function renderPagination(totalPages) {
  paginationEl.innerHTML = "";

  // Kalau cuma 1 halaman, pagination nggak perlu ditampilkan
  if (totalPages <= 1) return;

  // Tombol Sebelumnya
  const prevBtn = document.createElement("button");
  prevBtn.textContent = "« Sebelumnya";
  prevBtn.disabled = state.page === 1;
  prevBtn.addEventListener("click", () => goToPage(state.page - 1));
  paginationEl.appendChild(prevBtn);

  // Tombol nomor halaman
  for (let i = 1; i <= totalPages; i++) {
    const pageBtn = document.createElement("button");
    pageBtn.textContent = i;
    if (i === state.page) pageBtn.classList.add("active");
    pageBtn.addEventListener("click", () => goToPage(i));
    paginationEl.appendChild(pageBtn);
  }

  // Tombol Berikutnya
  const nextBtn = document.createElement("button");
  nextBtn.textContent = "Berikutnya »";
  nextBtn.disabled = state.page === totalPages;
  nextBtn.addEventListener("click", () => goToPage(state.page + 1));
  paginationEl.appendChild(nextBtn);
}

function goToPage(page) {
  state.page = page;
  applyFilters();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function applyFilters() {
  let result = [...products];

  // Search berdasarkan nama produk (tidak case-sensitive)
  const keyword = state.search.trim().toLowerCase();
  if (keyword) {
    result = result.filter((product) =>
      product.name.toLowerCase().includes(keyword),
    );
  }

  // Filter berdasarkan kategori
  if (state.category !== "all") {
    result = result.filter((product) => product.category === state.category);
  }

  // Sorting berdasarkan harga
  if (state.sort === "asc") {
    result.sort((a, b) => a.price - b.price);
  } else if (state.sort === "desc") {
    result.sort((a, b) => b.price - a.price);
  }

  // Pagination
  const totalPages = Math.max(1, Math.ceil(result.length / ITEMS_PER_PAGE));
  if (state.page > totalPages) state.page = totalPages;

  const start = (state.page - 1) * ITEMS_PER_PAGE;
  const paginated = result.slice(start, start + ITEMS_PER_PAGE);

  resultInfoEl.textContent = `Menampilkan ${paginated.length} dari ${result.length} produk`;

  renderProducts(paginated);
  renderPagination(totalPages);
}

searchInput.addEventListener("input", (e) => {
  state.search = e.target.value;
  state.page = 1;
  applyFilters();
});

categoryFilter.addEventListener("change", (e) => {
  state.category = e.target.value;
  state.page = 1;
  applyFilters();
});

sortPrice.addEventListener("change", (e) => {
  state.sort = e.target.value;
  state.page = 1;
  applyFilters();
});

const resetBtn = document.getElementById("reset-btn");

resetBtn.addEventListener("click", () => {
  state.search = "";
  state.category = "all";
  state.sort = "default";
  state.page = 1;

  searchInput.value = "";
  categoryFilter.value = "all";
  sortPrice.value = "default";

  applyFilters();
});

// Jalankan saat halaman dibuka
populateCategories();
applyFilters();
