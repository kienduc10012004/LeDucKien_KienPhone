import { dom, state, saveOrders, formatCurrency } from "./core.js";

const getAllOrdersForAdmin = () => {
  let allOrders = [];

  for (
    let index = 0;
    index < localStorage.length;
    index++
  ) {
    const key = localStorage.key(index);

    if (key?.startsWith("KP_ORDERS_")) {
      const orders =
        JSON.parse(localStorage.getItem(key)) || [];

      allOrders.push(...orders);
    }
  }

  return allOrders;
};


const getStatusClass = (status) => {
  if (status === "Đã bị hủy") return "bg-red-100 text-red-600";
  if (status === "Đang giao hàng") return "bg-blue-100 text-blue-600";
  if (status === "Đã giao hàng") return "bg-emerald-100 text-emerald-600";
  return "bg-amber-100 text-amber-600";
};

const getFilteredOrders = () => {
  const keyword = dom.orderKeyword?.value.toLowerCase().trim() || "";

  if (!keyword) {
    return state.orders;
  }

  return state.orders.filter((order) => {
    return order.id.toLowerCase().includes(keyword) ||
      order.customer.fullName.toLowerCase().includes(keyword) ||
      order.customer.phone.includes(keyword);
  });
};

const renderOrderProducts = (items) => {
  return items.map((item) => {
    return `
      <div class="flex items-center gap-3 mb-3">
        <img src="${item.img}" class="w-12 h-12 object-contain bg-slate-50 rounded-lg" />
        <div>
          <p class="font-bold text-sm">${item.name}</p>
          <p class="text-xs text-slate-500">${formatCurrency(item.price)} x ${item.soLuong || 1}</p>
        </div>
      </div>
    `;
  }).join("");
};

export const renderOrders = () => {
  if (!dom.orderTableBody) return;

  const orders = getFilteredOrders();

  if (orders.length === 0) {
    dom.orderTableBody.innerHTML = `
      <tr>
        <td colspan="8" class="text-center py-10 text-slate-400 font-bold">
          Chưa có đơn hàng
        </td>
      </tr>
    `;
    return;
  }

  dom.orderTableBody.innerHTML = orders.map((order) => {
    const disabledStatus = order.status === "Đã bị hủy" ? "disabled" : "";
    const disabledDelete = order.status === "Đã bị hủy" ? "" : "disabled";
    const deleteClass = order.status === "Đã bị hủy"
      ? "bg-red-500 hover:bg-red-600 text-white cursor-pointer"
      : "bg-slate-200 text-slate-400 cursor-not-allowed";

    return `
      <tr class="border-b align-top hover:bg-slate-50">
        <td class="p-4 font-black text-indigo-600">${order.id}</td>
        <td class="p-4">${order.customer.fullName}</td>
        <td class="p-4">${order.customer.phone}</td>
        <td class="p-4 min-w-64">${renderOrderProducts(order.items)}</td>
        <td class="p-4 text-right font-black text-emerald-600">${formatCurrency(order.total)}</td>
        <td class="p-4">
          <select class="orderStatusSelect border rounded-xl px-3 py-2 text-sm" data-id="${order.id}" ${disabledStatus}>
            <option ${order.status === "Chờ xác nhận đặt hàng" ? "selected" : ""}>Chờ xác nhận đặt hàng</option>
            <option ${order.status === "Chuẩn bị hàng" ? "selected" : ""}>Chuẩn bị hàng</option>
            <option ${order.status === "Đang giao hàng" ? "selected" : ""}>Đang giao hàng</option>
            <option ${order.status === "Đã giao hàng" ? "selected" : ""}>Đã giao hàng</option>
            <option ${order.status === "Đã bị hủy" ? "selected" : ""}>Đã bị hủy</option>
          </select>
        </td>
        <td class="p-4">
          <span class="px-3 py-1 rounded-full text-xs font-black ${getStatusClass(order.status)}">
            ${order.status}
          </span>
          <p class="text-xs text-slate-400 mt-2">${order.createdAt}</p>
        </td>
        <td class="p-4 text-center">
          <button class="btnDeleteOrder px-3 py-2 rounded-xl text-sm font-bold ${deleteClass}" data-id="${order.id}" ${disabledDelete}>
            Xóa
          </button>
        </td>
      </tr>
    `;
  }).join("");

  document.querySelectorAll(".orderStatusSelect").forEach((select) => {
    select.addEventListener("change", () => {
      const orderId = select.dataset.id;
      const order = state.orders.find((item) => item.id === orderId);

      if (!order || order.status === "Đã bị hủy") return;

      order.status = select.value;
      saveOrders();
      renderOrders();
    });
  });

  document.querySelectorAll(".btnDeleteOrder").forEach((button) => {
    button.addEventListener("click", () => {
      const orderId = button.dataset.id;
      const order = state.orders.find((item) => item.id === orderId);

      if (!order || order.status !== "Đã bị hủy") {
        alert("Admin chỉ được xóa đơn hàng đã bị hủy");
        return;
      }

      const isConfirm = confirm("Xóa đơn hàng này?");
      if (!isConfirm) return;

      state.orders = state.orders.filter((item) => item.id !== orderId);
      saveOrders();
      renderOrders();
    });
  });
};

export const initManageOrder = () => {
  if (!dom.orderTableBody) return;

  state.orders = getAllOrdersForAdmin();

  renderOrders();

  dom.btnSearchOrder?.addEventListener(
    "click",
    renderOrders
  );

  dom.orderKeyword?.addEventListener(
    "input",
    renderOrders
  );
};