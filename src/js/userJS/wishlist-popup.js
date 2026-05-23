// import { API, state, luuWishlist, el } from "./core.js";
import { API, state, luuWishlist, el, getUserWishlistKey } from "./core.js";
import { getImageUrl, formatCurrency, capNhatWishlist } from "./ui-flow.js";

export const initWishlistPopup = () => {

  if (!el.popupWishlist || !el.overlayWishlist || !el.btnCloseWishlist || !el.btnWishlist ||!el.wishlistContent) {
    return;
  }

  const layDanhSachSanPhamNeuCan = async () => {
    if (state.danhSachSP.length > 0) {
      return;
    }
    try {
      const res = await axios.get(API);
      state.danhSachSP = Array.isArray(res.data) ? res.data : [];
    } catch (error) {
      state.danhSachSP = [];
    }
  };

  const renderWishlist = async () => {
    await layDanhSachSanPhamNeuCan();
    // const wishlistIds = JSON.parse(localStorage.getItem("WISHLIST_USER")) || [];
    const wishlistIds = JSON.parse(localStorage.getItem(getUserWishlistKey())) || [];
    state.wishlist = wishlistIds;
    capNhatWishlist();
    if (wishlistIds.length === 0) {
      el.wishlistContent.innerHTML = `
        <div class="text-center py-12">
          <div class="w-20 h-20 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-3xl mb-4"> <i class="fa-solid fa-heart"></i> </div>
          <h3 class="text-xl font-black text-slate-800">
            Chưa có sản phẩm yêu thích
          </h3>
          <p class="text-sm text-slate-400 mt-2">
            Hãy bấm nút trái tim trên sản phẩm để thêm vào danh sách yêu thích.
          </p>
        </div>
      `;
      return;
    }
    
    const products = wishlistIds.map((id) => {
        return state.danhSachSP.find((product) => product.id == id);
      }).filter(Boolean);

    if (products.length === 0) {
      el.wishlistContent.innerHTML = `
        <p class="text-center text-slate-400 font-bold py-10">
          Không tìm thấy sản phẩm yêu thích trong dữ liệu hiện tại.
        </p>
      `;
      return;
    }

    el.wishlistContent.innerHTML = products.map((product) => {
      return `
        <div class="flex items-center gap-4 border border-slate-100 rounded-2xl p-4">
          <div class="w-20 h-20 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0">
            <img src="${getImageUrl(product.img)}" class="w-16 h-16 object-contain" alt="${product.name}"/>
          </div>

          <div class="flex-1">
            <h3 class="font-black text-slate-900 line-clamp-2">
              ${product.name}
            </h3>
            <p class="text-blue-600 font-black mt-1">
              ${formatCurrency(product.price)}
            </p>
          </div>

          <button class="btnRemoveWishlist px-4 py-2 rounded-xl bg-red-500 cursor-pointer duration-100 hover:bg-red-600 text-white font-bold" data-id="${product.id}">
            Xóa
          </button>
        </div>
      `;
    }).join("");

    const removeButtons = el.wishlistContent.querySelectorAll(".btnRemoveWishlist");

    removeButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const productId = button.dataset.id;
        state.wishlist = state.wishlist.filter((id) => {
          return id != productId;
        });

        luuWishlist();
        capNhatWishlist();
        renderWishlist();
      });
    });
  };

  el.btnWishlist.forEach((btn) => {
    btn.addEventListener("click", () => {
      el.popupWishlist.classList.remove("hidden");
      renderWishlist();
    })
  })

  // el.btnWishlist.addEventListener("click", () => {
  //   popupWishlist.classList.remove("hidden");
  //   renderWishlist();
  // });

  overlayWishlist.addEventListener("click", () => {
    popupWishlist.classList.add("hidden");
  });

  btnCloseWishlist.addEventListener("click", () => {
    popupWishlist.classList.add("hidden");
  });
};