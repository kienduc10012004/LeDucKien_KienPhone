import { el } from "./core.js";

export const bindPopupEvents = () => {
  const closeCart = () => { el.popupGioHang?.classList.add("hidden"); document.body.classList.remove("overflow-hidden"); };
  el.overlayGioHang?.addEventListener("click", closeCart);
  el.btnCloseGioHang?.addEventListener("click", closeCart);
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeCart(); });
};
