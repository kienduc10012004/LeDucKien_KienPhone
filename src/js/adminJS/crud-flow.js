import { API_URL, dom, state } from "./core.js";
import {
  renderDanhSachSP,
  resetForm,
  validateForm,
  getProductDataFromForm,
  addNewTypeOption,
  renderBrandSelect,
  deleteTypeOption
} from "./ui-flow.js";

export const getFilteredList = () => {
  const keyword = dom.inputKeyword.value.toLowerCase().trim();

  if (!keyword) {
    return state.danhSachSP;
  }

  return state.danhSachSP.filter((product) => {
    return product.name.toLowerCase().includes(keyword) ||
      product.desc.toLowerCase().includes(keyword) ||
      product.type.toLowerCase().includes(keyword);
  });
};

export const fetchDanhSachSP = async () => {
  try {
    const response = await axios.get(API_URL);
    state.danhSachSP = Array.isArray(response.data) ? response.data : [];
    renderDanhSachSP(getFilteredList());
  } catch (error) {
    console.error(error);
    alert("Không tải được danh sách sản phẩm");
  }
};

export const filterSP = () => {
  state.currentPage = 1;
  renderDanhSachSP(getFilteredList());
};

window.changePage = (page) => {
  state.currentPage = page;
  renderDanhSachSP(getFilteredList());
};

export const createProduct = async () => {
  if (!validateForm()) return;

  try {
    await axios.post(API_URL, getProductDataFromForm());
    alert("Thêm thành công!");
    resetForm();
    await fetchDanhSachSP();
  } catch (error) {
    alert("Lỗi khi thêm sản phẩm");
  }
};

export const updateProduct = async () => {
  if (!state.editingProduct) {
    alert("Vui lòng chọn sản phẩm cần cập nhật");
    return;
  }

  if (!validateForm()) return;

  try {
    await axios.put(`${API_URL}/${state.editingProduct.id}`, getProductDataFromForm());
    alert("Cập nhật thành công!");
    resetForm();
    await fetchDanhSachSP();
  } catch (error) {
    alert("Lỗi khi cập nhật sản phẩm");
  }
};

window.editProduct = (id) => {
  const product = state.danhSachSP.find((item) => item.id == id);

  if (!product) return;

  state.editingProduct = product;

  dom.giftName.value = product.giftName || "Không";
  dom.giftImg.value = product.giftImg || "Không";
  dom.name.value = product.name || "";
  dom.price.value = product.price || "";
  dom.quantity.value = product.quantity || 0;
  dom.img.value = product.img || "";
  dom.screen.value = product.screen || "";
  dom.backCamera.value = product.backCamera || "";
  dom.frontCamera.value = product.frontCamera || "";
  dom.desc.value = product.desc || "";
  dom.type.value = product.type || "";

  dom.btnSave.classList.add("hidden");
  dom.btnUpdate.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
};

window.deleteProduct = async (id) => {
  const isConfirm = confirm("Xóa sản phẩm này?");

  if (!isConfirm) return;

  try {
    await axios.delete(`${API_URL}/${id}`);
    await fetchDanhSachSP();
  } catch (error) {
    alert("Lỗi khi xóa sản phẩm");
  }
};

export const initManageProduct = () => {
  if (!dom.productForm) return;
  renderBrandSelect();

  dom.productForm.addEventListener("submit", (event) => {
    event.preventDefault();
    createProduct();
  });

  dom.btnUpdate.addEventListener("click", updateProduct);
  dom.btnReset.addEventListener("click", resetForm);
  dom.btnSearch.addEventListener("click", filterSP);
  dom.btnAddType.addEventListener("click", addNewTypeOption);
  dom.btnDeleteType?.addEventListener("click", deleteTypeOption);

  dom.inputKeyword.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      filterSP();
    }
  });

  fetchDanhSachSP();
};
