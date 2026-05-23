import { el, state, getBrands  } from "./core.js";
import { renderDanhSachSP } from "./product-flow.js";

export const renderUserBrandFilter = () => {
  const brands = getBrands();

  if (el.filterSP) {
    el.filterSP.innerHTML = `
      <option value="">Tất cả hãng</option>
    `;

    brands.forEach((brand) => {
      el.filterSP.innerHTML += `
        <option value="${brand}">
          ${brand}
        </option>
      `;
    });
  }

  if (el.quickBrandList) {
    el.quickBrandList.innerHTML = `
      <button
        data-brand=""
        class="cursor-pointer quick-brand active shrink-0 px-4 py-2 rounded-full bg-slate-900 text-white text-xs font-black"
      >
        Tất cả
      </button>
    `;

    brands.forEach((brand) => {
      el.quickBrandList.innerHTML += `
        <button
          data-brand="${brand}"
          class="cursor-pointer quick-brand shrink-0 px-4 py-2 rounded-full bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600 duration-200 text-xs font-black"
        >
          ${brand}
        </button>
      `;
    });
  }
};

export const filterSP = () => {
  const keyword = el.searchSP?.value.toLowerCase().trim() || "";
  const type = el.filterSP?.value.toLowerCase() || "";
  const sort = el.sortSP?.value || "";
  let result = [...state.danhSachSP];
  if (keyword) result = result.filter(p => (p.name || "").toLowerCase().includes(keyword) || (p.desc || "").toLowerCase().includes(keyword) || (p.type || "").toLowerCase().includes(keyword));
  if (type) result = result.filter(p => (p.type || "").toLowerCase() === type);
  if (sort === "asc") result.sort((a, b) => Number(a.price) - Number(b.price));
  if (sort === "desc") result.sort((a, b) => Number(b.price) - Number(a.price));
  state.currentPage = 1;
  renderDanhSachSP(result);
  updateQuickBrandActive();
};

const updateQuickBrandActive = () => {
  document.querySelectorAll(".quick-brand").forEach(btn => {
    const active = btn.dataset.brand === (el.filterSP?.value || "");
    btn.className = active ? "quick-brand cursor-pointer active shrink-0 px-4 py-2 rounded-full bg-slate-900 text-white text-xs font-black" : "quick-brand cursor-pointer shrink-0 px-4 py-2 rounded-full bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600 text-xs font-black";
  });
};

export const bindFilterEvent = () => {
  el.searchSP?.addEventListener("input", () => { clearTimeout(state.timerId); state.timerId = setTimeout(filterSP, 400); });
  el.filterSP?.addEventListener("change", filterSP);
  el.sortSP?.addEventListener("change", filterSP);
  el.btnClearFilters?.addEventListener("click", () => { el.searchSP.value = ""; el.filterSP.value = ""; el.sortSP.value = ""; state.currentPage = 1; renderDanhSachSP(state.danhSachSP); updateQuickBrandActive(); });
  el.quickBrandList?.addEventListener("click", e => { const btn = e.target.closest(".quick-brand"); if (!btn) return; el.filterSP.value = btn.dataset.brand; filterSP(); });
};
