import { API, el, state, luuGioHang, capNhatSoLuongGioHang, productDetailUrl, isInPageUser } from "./core.js";
import { bindPopupEvents } from "./popup-flow.js";
import { renderGioHang } from "./cart-flow.js";
import { formatCurrency, getOldPrice, getDiscountPercent, getRating, renderStars, showToast, getImageUrl } from "./ui-flow.js";
import { initWishlistPopup } from "./wishlist-popup.js";

const getQuantity = (product) => {
  return Number(product.quantity ?? 10);
};

window.themVaoGioHang = (id) => {
  const sp = state.danhSachSP.find(p => p.id == id);
  if (!sp) return;

  const quantity = getQuantity(sp);

  if (quantity <= 0) {
    alert(`Sản phẩm ${sp.name} đã hết hàng!`);
    return;
  }

  const exist = state.gioHang.find(i => i.id == id);

  if (exist) {
    if (exist.soLuong + 1 > quantity) {
      alert(`Sản phẩm: ${sp.name} ko đủ số lượng!`);
      return;
    }

    exist.soLuong++;
  } else {
    state.gioHang.push({ ...sp, soLuong: 1 });
  }

  luuGioHang();
  capNhatSoLuongGioHang();
  showToast(`Đã thêm ${sp.name} vào giỏ hàng`);
};

const renderCard = (p) => {
  const rating = getRating(p.id), oldPrice = getOldPrice(p.price), discount = getDiscountPercent(p.price), isWish = state.wishlist.includes(String(p.id));
  const quantity = getQuantity(p);
  const isOutOfStock = quantity <= 0;

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

      <!-- Nút hành động -->
      ${
        isOutOfStock
          ? `
            <div class="mt-4 py-3 rounded-2xl bg-slate-200 text-slate-500 text-center text-xs font-black cursor-not-allowed">
              HẾT HÀNG
            </div>
          `
          : `
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
};
  

const loadDetail = async () => {
  bindPopupEvents();
  document.getElementById("btnGioHang")?.addEventListener("click", () => renderGioHang());
  capNhatSoLuongGioHang();
  const id = new URLSearchParams(location.search).get("id");
  const res = await axios.get(API);
  state.danhSachSP = Array.isArray(res.data) ? res.data : [];
  const sp = state.danhSachSP.find(p => p.id == id) || state.danhSachSP[0];
  if (!sp) return;
  const rating = getRating(sp.id), oldPrice = getOldPrice(sp.price), discount = getDiscountPercent(sp.price);
  const quantity = getQuantity(sp);
  const isOutOfStock = quantity <= 0;

  el.detailBox.innerHTML = `
    <section class="grid lg:grid-cols-2 gap-10 bg-white border border-slate-100 rounded-[2.5rem] p-6 md:p-10 shadow-sm">
      <!-- Phần hình ảnh -->
      <div class="relative flex items-center justify-center p-8 bg-slate-50 rounded-[2rem]">
        <span class="absolute top-5 left-5 bg-red-500 text-white text-xs font-black px-4 py-2 rounded-full">
          -${discount}%
        </span>
        <img src="${getImageUrl(sp.img)}" class="h-80 object-contain drop-shadow-2xl">
      </div>

      <!-- Phần thông tin sản phẩm -->
      <div>
        <span class="inline-flex px-4 py-2 rounded-full bg-blue-50 text-blue-600 font-black text-xs uppercase tracking-widest">
          ${sp.type}
        </span>
        <h1 class="mt-4 text-3xl font-black leading-tight md:text-5xl">
          ${sp.name}
        </h1>

        <!-- Rating & Stats -->
        <div class="flex items-center gap-2 my-4">
          <span class="text-amber-400 tracking-widest">
            ${renderStars(rating)}
          </span>
          <b class="text-sm text-slate-500">${rating}/5</b>
          <span class="text-slate-300">|</span>
          <b class="text-sm text-slate-500">Đã bán ${120 + Number(sp.id) * 7}</b>
        </div>

        <!-- Price Section -->
        <div class="p-5 mb-6 bg-slate-50 rounded-3xl">
          <p class="text-4xl font-black text-red-500">
            ${formatCurrency(sp.price)}
          </p>
          <div class="flex gap-3 mt-2">
            <span class="font-bold text-slate-400 line-through">
              ${formatCurrency(oldPrice)}
            </span>
            <span class="font-black text-emerald-600">
              Tiết kiệm ${formatCurrency(oldPrice - Number(sp.price))}
            </span>
          </div>
        </div>

        <!-- Specifications -->
        <div class="mb-8 space-y-4 text-slate-600">
          <p><b>Màn hình:</b> ${sp.screen || "Đang cập nhật"}</p>
          <p><b>Camera trước:</b> ${sp.frontCamera || "Đang cập nhật"}</p>
          <p><b>Camera sau:</b> ${sp.backCamera || "Đang cập nhật"}</p>
          <p><b>Số lượng còn lại:</b> ${quantity}</p>
          <p class="leading-relaxed">
            <b>Mô tả:</b> ${sp.desc || "Sản phẩm chính hãng, phù hợp học tập, làm việc và giải trí."}
          </p>
        </div>


        ${
          hasGift(sp)
            ? `
              <div class="flex items-center gap-4 mb-8 p-5 rounded-3xl bg-orange-50 border border-orange-100">
                <div class="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shrink-0">
                  <img src="${getImageUrl(sp.giftImg)}" class="w-12 h-12 object-contain" alt="${sp.giftName}">
                </div>

                <div>
                  <p class="text-xs font-black text-orange-500 uppercase tracking-widest">
                    Quà tặng ưu đãi
                  </p>
                  <h3 class="text-lg font-black text-slate-800 mt-1">
                    ${sp.giftName}
                  </h3>
                  <p class="text-sm text-slate-500 font-bold mt-1">
                    Quà tặng đi kèm khi mua sản phẩm này.
                  </p>
                </div>
              </div>
            `
            : ""
        }

        <!-- Actions -->
        ${
          isOutOfStock
            ? `
              <div class="py-4 rounded-2xl bg-slate-200 text-slate-500 text-center font-black cursor-not-allowed">
                HẾT HÀNG
              </div>
            `
            : `
              <div class="grid gap-3 sm:grid-cols-2">
                <button onclick="themVaoGioHang('${sp.id}')" class="py-4 font-black text-white bg-slate-900 rounded-2xl hover:bg-slate-800">
                  THÊM GIỎ HÀNG
                </button>
                <a href="./checkout.html?id=${sp.id}" class="flex items-center justify-center py-4 font-black text-white bg-blue-600 rounded-2xl hover:bg-blue-700">
                  THANH TOÁN
                </a>
              </div>
            `
        }
      </div>
    </section>
  `;
  const related = state.danhSachSP.filter(p => p.id != sp.id).sort(() => Math.random() - 0.5).slice(0, 8);
  el.relatedProducts.innerHTML = related.map(renderCard).join("");
};


const hasGift = (product) => {
  return (
    product.giftName &&
    product.giftImg &&
    product.giftName.trim().toLowerCase() !== "không" &&
    product.giftImg.trim().toLowerCase() !== "không"
  );
};
loadDetail();
initWishlistPopup();