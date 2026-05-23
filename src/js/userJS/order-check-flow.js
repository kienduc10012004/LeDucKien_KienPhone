import { getOrders, saveOrders, formatCurrency } from "./order-core.js";

const orderTableBody = document.getElementById("orderTableBody");

const canCancelOrder = (status) => {
  return status === "Chờ xác nhận đặt hàng" || status === "Chuẩn bị hàng";
};

const renderOrderItems = (items) => {
  return items.map((item) => {
    return `
      <div class="flex items-center gap-3 mb-3">
        <img src="${item.img}" class="w-14 h-14 object-contain bg-slate-50 rounded-xl" />
        <div>
          <p class="font-black">${item.name}</p>
          <p class="text-sm text-slate-500">${formatCurrency(item.price)} x ${item.soLuong}</p>
        </div>
      </div>
    `;
  }).join("");
};

const renderOrders = () => {
  const orders = getOrders();

  if (!orderTableBody) return;

  if (orders.length === 0) {
    orderTableBody.innerHTML = `
      <tr>
        <td colspan="5" class="py-10 text-center text-slate-400 font-bold">
          Chưa có đơn hàng
        </td>
      </tr>
    `;
    return;
  }

  orderTableBody.innerHTML = orders.map((order) => {
    const allowCancel = canCancelOrder(order.status);

    return `
      <tr class="border-b align-top hover:bg-slate-50">
        <td class="p-4 font-black text-blue-600">${order.id}</td>
        <td class="p-4 min-w-72">${renderOrderItems(order.items)}</td>
        <td class="p-4 text-right font-black text-red-500">${formatCurrency(order.total)}</td>
        <td class="p-4 text-center">
          <button
            class="btnCancelOrder px-4 py-2 rounded-xl font-bold ${allowCancel ? "bg-red-500 cursor-pointer hover:bg-red-600 duration-100 text-white" : "bg-slate-200 text-slate-400 cursor-not-allowed"}"
            data-id="${order.id}"
            ${allowCancel ? "" : "disabled"}
          >
            Hủy đơn
          </button>
        </td>
        <td class="p-4 font-bold">${order.status}</td>
      </tr>
    `;
  }).join("");

  document.querySelectorAll(".btnCancelOrder").forEach((button) => {
    button.addEventListener("click", () => {
      const orderId = button.dataset.id;
      const orders = getOrders();
      const order = orders.find((item) => item.id === orderId);

      if (!order || !canCancelOrder(order.status)) return;

      const isConfirm = confirm("Bạn có chắc muốn hủy đơn hàng này?");
      if (!isConfirm) return;

      order.status = "Đã bị hủy";
      saveOrders(orders);
      renderOrders();
    });
  });
};

renderOrders();
