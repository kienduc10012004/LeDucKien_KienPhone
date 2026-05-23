import { API_URL, dom, state, formatCurrency, getBrands } from "./core.js";

const groupProductsByBrand = (products) => {
  const result = {};
  const brands = getBrands();

  brands.forEach((brand) => {
    result[brand] = {
      count: 0,
      totalPrice: 0
    };
  });

  products.forEach((product) => {
    const brand = product.type || "Khác";

    if (!result[brand]) {
      result[brand] = {
        count: 0,
        totalPrice: 0
      };
    }

    result[brand].count++;
    result[brand].totalPrice += Number(product.price || 0);
  });

  return result;
};
const renderSimpleBar = (container, labels, values, suffix = "") => {
  if (!container) return;

  const maxValue = Math.max(...values, 1);

  container.innerHTML = labels.map((label, index) => {
    const percent = Math.round((values[index] / maxValue) * 100);

    return `
      <div class="mb-4">
        <div class="flex justify-between text-sm font-bold mb-1">
          <span>${label}</span>
          <span>${values[index].toLocaleString("vi-VN")}${suffix}</span>
        </div>
        <div class="h-3 bg-slate-100 rounded-full overflow-hidden">
          <div class="h-full bg-indigo-600 rounded-full" style="width:${percent}%"></div>
        </div>
      </div>
    `;
  }).join("");
};

export const initDashboard = async () => {
  if (!dom.totalProducts) return;

  try {
    const response = await axios.get(API_URL);
    state.danhSachSP = Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    alert("Không tải được dữ liệu dashboard");
    state.danhSachSP = [];
  }

  const products = state.danhSachSP;
  const brandStats = groupProductsByBrand(products);
  const brands = Object.keys(brandStats);

  const highest = [...products].sort((a, b) => Number(b.price) - Number(a.price))[0];
  const lowest = [...products].sort((a, b) => Number(a.price) - Number(b.price))[0];
  const newest = products[products.length - 1];

  dom.totalProducts.textContent = products.length;
  dom.totalBrands.textContent = brands.length;
  dom.highestProduct.textContent = highest ? `${highest.name} - ${formatCurrency(highest.price)}` : "Chưa có";
  dom.lowestProduct.textContent = lowest ? `${lowest.name} - ${formatCurrency(lowest.price)}` : "Chưa có";
  dom.newestProduct.textContent = newest ? newest.name : "Chưa có";

  dom.brandStatsTable.innerHTML = brands.map((brand) => {
    const count = brandStats[brand].count;
    const avgPrice = count === 0
      ? 0
      : brandStats[brand].totalPrice / count;

    return `
      <tr class="border-b hover:bg-slate-50">
        <td class="p-4 font-bold">${brand}</td>
        <td class="p-4 text-center">${count}</td>
        <td class="p-4 text-right text-emerald-600 font-bold">${formatCurrency(avgPrice)}</td>
      </tr>
    `;
  }).join("");

  renderSimpleBar(
    dom.chartByBrand,
    brands,
    brands.map((brand) => brandStats[brand].count),
    " sản phẩm"
  );

  renderSimpleBar(
    dom.chartAvgPrice,
    brands,
    brands.map((brand) => Math.round(brandStats[brand].totalPrice / brandStats[brand].count)),
    " đ"
  );
};
