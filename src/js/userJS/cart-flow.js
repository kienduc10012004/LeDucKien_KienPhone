import { API, el, state, luuGioHang, capNhatSoLuongGioHang, checkoutUrl } from "./core.js";
import { formatCurrency, showToast, getImageUrl } from "./ui-flow.js";

const openCart = () => { if (el.popupGioHang) { el.popupGioHang.classList.remove("hidden"); document.body.classList.add("overflow-hidden"); } };

const getQuantity = (product) => {
  return Number(product.quantity ?? 10);
};

const getCheckoutCartUrl = () => {
  const url = checkoutUrl();

  if (url.includes("?")) {
    return `${url}&from=cart`;
  }

  return `${url}?from=cart`;
};

window.tangSoLuong = async (id) => {
  const item = state.gioHang.find(p => p.id == id);
  if (!item) return;

  try {
    const response = await fetch(`${API}/${id}`);
    const product = await response.json();
    const quantity = getQuantity(product);

    if (item.soLuong + 1 > quantity) {
      alert(`Sản phẩm: ${item.name} ko đủ số lượng!`);
      return;
    }

    item.soLuong++;
    luuGioHang(); capNhatSoLuongGioHang(); renderGioHang(false);
  } catch (error) {
    alert("Không thể kiểm tra số lượng sản phẩm!");
  }
};

window.giamSoLuong = (id) => {
  const item = state.gioHang.find(p => p.id == id);
  if (!item || item.soLuong <= 1) return;
  item.soLuong--;
  luuGioHang(); capNhatSoLuongGioHang(); renderGioHang(false);
};

window.xoaSanPham = (id) => {
  const item = state.gioHang.find(p => p.id == id);
  state.gioHang = state.gioHang.filter(p => p.id != id);
  luuGioHang(); capNhatSoLuongGioHang(); renderGioHang(false);
  showToast(`Đã xóa ${item?.name || "sản phẩm"} khỏi giỏ hàng`, "warning");
};

window.kiemTraTonKhoVaThanhToan = async () => {
  if (!state.gioHang.length) {
    showToast("Giỏ hàng đang trống", "warning");
    return;
  }

  try {
    const response = await fetch(API);
    const products = await response.json();

    for (let item of state.gioHang) {
      const product = products.find((p) => p.id == item.id);

      if (!product) {
        alert(`Không tìm thấy sản phẩm ${item.name}!`);
        return;
      }

      const quantity = getQuantity(product);

      if (item.soLuong > quantity) {
        alert(`Sản phẩm: ${item.name} ko đủ số lượng!`);
        return;
      }
    }

    window.location.href = getCheckoutCartUrl();
  } catch (error) {
    alert("Không thể kiểm tra số lượng sản phẩm!");
  }
};

window.thanhToanDemo = () => {
  if (!state.gioHang.length) return showToast("Giỏ hàng đang trống", "warning");
  state.gioHang = [];
  luuGioHang(); 
  capNhatSoLuongGioHang();
  renderGioHang(false);
  showToast("Đặt hàng demo thành công!");
};

window.thanhToanDemoDetail = () => {
  showToast("Đặt hàng demo thành công!");
}

export const renderGioHang = (shouldOpen = true) => {
  if (!el.noiDungGioHang) return;
  if (!state.gioHang.length) {
    el.noiDungGioHang.innerHTML = `
      <div class="h-full flex flex-col items-center justify-center text-center px-6">
        <div class="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center text-4xl mb-5">
          <i class="fa-solid fa-cart-arrow-down"></i>
        </div>
        <h3 class="text-xl font-black text-slate-800">Giỏ hàng trống</h3>
        <p class="text-sm text-slate-400 mt-2 max-w-xs">Hãy thêm sản phẩm yêu thích vào giỏ hàng.</p>
      </div>
    `;
    if (shouldOpen) openCart();
    return;
  }
  const tamTinh = state.gioHang.reduce((s, i) => s + Number(i.price) * i.soLuong, 0);
  const giam = Math.round(tamTinh * 0.05);
  const ship = tamTinh >= 5000000 ? 0 : 30000;
  const tong = tamTinh - giam + ship;
  el.noiDungGioHang.innerHTML = state.gioHang.map(item => `
    <div class="flex gap-4 p-5 border-b border-slate-100">
      <div class="w-20 h-20 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0">
        <img src="${getImageUrl(item.img)}" class="w-16 h-16 object-contain">
      </div>
      <div class="flex-1">
        <h4 class="font-black text-sm line-clamp-2">${item.name}</h4>
        <p class="text-blue-600 font-black text-sm mt-1">${formatCurrency(item.price)}</p>
        <div class="flex items-center justify-between mt-3">
          <div class="flex items-center bg-slate-100 rounded-xl p-1">
            <button onclick="giamSoLuong('${item.id}')" class="w-8 h-8 bg-white rounded-lg font-black cursor-pointer hover:bg-black hover:text-white duration-100">-</button>
            <span class="w-9 text-center text-xs font-black">${item.soLuong}</span>
            <button onclick="tangSoLuong('${item.id}')" class="w-8 h-8 bg-blue-600 text-white rounded-lg font-black cursor-pointer hover:opacity-80 duration-100">+</button>
          </div>
          <button onclick="xoaSanPham('${item.id}')" class="w-8 h-8 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white font-bold cursor-pointer duration-100"> X </button>
        </div>
      </div>
    </div>
  `).join("") + `
    <div class="sticky bottom-0 bg-white border-t p-6 shadow-[0_-20px_40px_rgba(15,23,42,0.06)]">
      <div class="space-y-3 text-sm mb-5">
        <div class="flex justify-between text-slate-500 font-bold">
          <span>Tạm tính</span>
          <span>${formatCurrency(tamTinh)}</span>
        </div>
        <div class="flex justify-between text-emerald-600 font-bold">
          <span>Giảm Flash Sale 5%</span>
          <span>-${formatCurrency(giam)}</span>
        </div>
        <div class="flex justify-between text-slate-500 font-bold">
          <span>Phí vận chuyển</span>
          <span>${ship ? formatCurrency(ship) : "Miễn phí"}</span>
        </div>
        <div class="h-px bg-slate-100"></div>
        <div class="flex justify-between items-center">
          <span class="font-black">Tổng thanh toán</span>
          <span class="text-2xl font-black text-blue-600">${formatCurrency(tong)}</span>
        </div>
      </div>
      <button onclick="kiemTraTonKhoVaThanhToan()" class="w-full cursor-pointer duration-100 bg-blue-600 text-white font-black py-4 px-4 rounded-2xl hover:bg-blue-700">
        THANH TOÁN NGAY
      </button>
    </div>
  `;

  if (shouldOpen) openCart();
};