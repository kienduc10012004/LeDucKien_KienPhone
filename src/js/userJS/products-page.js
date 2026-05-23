import { el, capNhatSoLuongGioHang } from "./core.js";
import { bindFilterEvent } from "./filter-flow.js";
import { bindPopupEvents } from "./popup-flow.js";
import { layDanhSachSP } from "./product-flow.js";
import { renderGioHang } from "./cart-flow.js";
import { capNhatWishlist } from "./ui-flow.js";
import { initWishlistPopup } from "./wishlist-popup.js";

bindFilterEvent();
bindPopupEvents();
el.btnGioHang?.addEventListener("click", () => renderGioHang());
capNhatSoLuongGioHang();
capNhatWishlist();
layDanhSachSP();
initWishlistPopup();