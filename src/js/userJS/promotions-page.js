import { API, el, state, capNhatSoLuongGioHang, productDetailUrl, isInPageUser } from "./core.js";
import { bindPopupEvents } from "./popup-flow.js";
import { renderGioHang } from "./cart-flow.js";
import { formatCurrency, initCarousel, getImageUrl, getRating, getOldPrice, getDiscountPercent, renderStars } from "./ui-flow.js";
import { initWishlistPopup } from "./wishlist-popup.js";

const hasGift = (product) => {
  return (
    product.giftName &&
    product.giftImg &&
    String(product.giftName).trim().toLowerCase() !== "không" &&
    String(product.giftImg).trim().toLowerCase() !== "không"
  );
};

const renderPromo = (list) => {
  if (!el.promoProducts) return;

  const total = Math.ceil(list.length / state.itemsPerPage);
  const start = (state.currentPage - 1) * state.itemsPerPage;
  const current = list.slice(start, start + state.itemsPerPage);

  if (current.length === 0) {
    el.promoProducts.innerHTML = `
      <div class="col-span-full py-20 text-center bg-white rounded-[2rem] border border-slate-200">
        <h3 class="text-xl font-black text-slate-800">
          Chưa có sản phẩm ưu đãi
        </h3>
        <p class="text-slate-400 font-bold mt-2">
          Hãy thêm quà tặng ưu đãi cho sản phẩm trong trang quản trị.
        </p>
      </div>
    `;

    const box = document.getElementById("pagination");

    if (box) {
      box.innerHTML = "";
    }

    return;
  }

  el.promoProducts.innerHTML = current.map((p) => {
    const rating = getRating(p.id);
    const oldPrice = getOldPrice(p.price);
    const discount = getDiscountPercent(p.price);
    const isWish = state.wishlist.includes(String(p.id));
    const isOutOfStock = Number(p.quantity || 0) <= 0;

    return `
      <div class="group bg-white rounded-[2rem] p-5 border border-slate-200 border-slate-100 hover:-translate-y-2 hover:shadow-2xl hover:shadow-slate-200 transition-all duration-300 relative overflow-hidden">
        <!-- Link bọc toàn bộ thẻ -->
        <a href="${productDetailUrl(p.id)}" class="block">
          
          <!-- Badge giảm giá -->
          <div class="absolute top-4 left-4 z-10 bg-red-500 text-white text-[11px] font-black px-3 py-1.5 rounded-full">
            -${discount}%
          </div>

          <!-- Hình ảnh sản phẩm -->
          <div class="bg-slate-50 rounded-[1.5rem] p-6 mb-5 flex justify-center overflow-hidden h-56">
            <img src="${getImageUrl(p.img)}" class="h-44 object-contain group-hover:scale-110 transition-all duration-500 drop-shadow-xl" alt="${p.name}">
          </div>

          <!-- Thông tin sản phẩm -->
          <span class="text-[11px] font-black text-blue-600 uppercase tracking-widest">${p.type}</span>
          <h3 class="font-black text-slate-800 mt-1 line-clamp-2 min-h-12 group-hover:text-blue-600 transition-colors">
            ${p.name}
          </h3>

          <!-- Đánh giá -->
          <div class="flex items-center gap-2 my-3">
            <span class="text-amber-400 text-xs tracking-wider">${renderStars(rating)}</span>
            <span class="text-xs text-slate-400 font-bold">${rating}</span>
          </div>

          <!-- Giá tiền -->
          <p class="text-red-500 font-black text-xl">${formatCurrency(p.price)}</p>
          <div class="flex items-center gap-2 mt-1">
            <p class="text-slate-400 line-through text-sm font-bold">${formatCurrency(oldPrice)}</p>
            <p class="text-emerald-600 text-xs font-black">Trả góp 0%</p>
          </div>
        </a>

        <!-- Nút Wishlist -->
        <button 
          onclick="event.stopPropagation(); toggleWishlist('${p.id}')" 
          class="cursor-pointer absolute top-4 right-4 z-10 w-10 h-10 rounded-full ${isWish ? "bg-rose-500 text-white" : "bg-white text-slate-400"} hover:bg-rose-500 hover:text-white shadow-md font-black transition"
        >
          <i class="fa-solid fa-heart text-sm"></i>
        </button>

        <!-- Gift Section -->
        <div class="flex items-center gap-3 p-3 mt-4 bg-orange-50 border border-orange-100 rounded-2xl">
          <img src="${getImageUrl(p.giftImg)}" class="w-12 h-12 object-contain">
          <div>
            <p class="text-[11px] font-black text-orange-500 uppercase">
              Quà tặng
            </p>
            <p class="text-sm font-black">
              ${p.giftName}
            </p>
          </div>
        </div>

        ${
          isOutOfStock
            ? `
              <div class="mt-4 text-center bg-slate-200 text-slate-500 font-black py-3 rounded-2xl text-xs">
                HẾT HÀNG
              </div>
            `
            : `
              <!-- Nút hành động -->
              <div class="grid grid-cols-2 gap-2 mt-4">
                <a href="${isInPageUser() ? `./checkout.html?id=${p.id}` : `./page-user/checkout.html?id=${p.id}`}" class="text-center bg-slate-100 cursor-pointer text-slate-700 font-black py-3 rounded-2xl text-xs hover:bg-slate-200">
                  Mua
                </a>
                <button onclick="themVaoGioHang('${p.id}')" class="bg-blue-600 text-white cursor-pointer font-black py-3 rounded-2xl text-xs hover:bg-blue-700 shadow-lg shadow-blue-100">
                  Thêm giỏ
                </button>
              </div>
            `
        }
      </div>
    `;
  }).join("");

  const box = document.getElementById("pagination");

  if (!box) return;

  if (total <= 1) {
    box.innerHTML = "";
    return;
  }

  box.innerHTML = Array.from({ length: total }, (_, i) => `
    <button onclick="changePromoPage(${i + 1})" class="w-11 h-11 rounded-2xl font-black ${i + 1 === state.currentPage ? "bg-blue-600 text-white" : "bg-white border text-slate-400"}">${i + 1}</button>
  `).join("");
};

window.changePromoPage = (p) => {
  state.currentPage = p;
  renderPromo(state.activeList);
  document.getElementById("uu-dai")?.scrollIntoView({ behavior: "smooth" });
};

const load = async () => {
  bindPopupEvents();
  initCarousel();
  capNhatSoLuongGioHang();

  document.getElementById("btnGioHang")?.addEventListener("click", () => {
    renderGioHang();
  });

  const res = await axios.get(API);

  state.danhSachSP = Array.isArray(res.data)
    ? res.data
    : [];

  state.activeList = state.danhSachSP.filter((product) => {
    return hasGift(product);
  });

  state.currentPage = 1;

  renderPromo(state.activeList);
};

load();
initWishlistPopup();