export const ORDER_COUNTER_KEY = "KP_ORDER_COUNTER";

const getCurrentUsername = () => {
  return localStorage.getItem("username") || "guest";
};

const getOrderKey = () => {
  return `KP_ORDERS_${getCurrentUsername()}`;
};

export const getOrders = () => {
  return JSON.parse(localStorage.getItem(getOrderKey())) || [];
};

export const saveOrders = (orders) => {
  localStorage.setItem(getOrderKey(), JSON.stringify(orders));
};

export const createOrderId = () => {
  const currentNumber = Number(localStorage.getItem(ORDER_COUNTER_KEY)) || 0;
  const nextNumber = currentNumber + 1;
  localStorage.setItem(ORDER_COUNTER_KEY, String(nextNumber));
  return "KPA" + String(nextNumber).padStart(5, "0");
};

export const formatCurrency = (value) => {
  return Number(value || 0).toLocaleString("vi-VN") + " đ";
};

export const getImageUrl = (img) => {
  if (!img) return "";

  const value = String(img).trim();

  if (value.startsWith("http://") || value.startsWith("https://") || value.startsWith("data:")) {
    return value;
  }

  const fileName = value.split("/").pop();
  return `../images/${fileName}`;
};
