import { dom, logOutAdmin } from "./core.js";

const ADMIN_STORAGE_KEY = "KIENPHONE_ADMIN";

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/;

const getAdminAccount = () => {
  const admin = JSON.parse(localStorage.getItem(ADMIN_STORAGE_KEY));

  if (admin) {
    return admin;
  }

  const defaultAdmin = {
    username: "admin",
    password: "Admin123@",
  };

  localStorage.setItem(
    ADMIN_STORAGE_KEY,
    JSON.stringify(defaultAdmin)
  );

  return defaultAdmin;
};

export const initAdminProfile = () => {
  if (!dom.adminProfileForm) return;

  dom.adminProfileForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const oldPassword = dom.oldPassword.value.trim();
    const newPassword = dom.newPassword.value.trim();
    const confirmPassword = dom.confirmPassword.value.trim();

    const adminAccount = getAdminAccount();

    // Kiểm tra rỗng
    if (!oldPassword || !newPassword || !confirmPassword) {
      alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    // Kiểm tra mật khẩu cũ
    if (oldPassword !== adminAccount.password) {
      alert("Mật khẩu cũ không đúng");
      return;
    }

    // Kiểm tra định dạng mật khẩu mới
    if (!passwordRegex.test(newPassword)) {
      alert(
        "Mật khẩu mới phải có tối thiểu 6 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt"
      );
      return;
    }

    // Không cho trùng mật khẩu cũ
    if (newPassword === oldPassword) {
      alert("Mật khẩu mới không được trùng mật khẩu cũ");
      return;
    }

    // Kiểm tra xác nhận mật khẩu
    if (newPassword !== confirmPassword) {
      alert("Mật khẩu xác nhận không khớp");
      return;
    }

    // Lưu mật khẩu mới
    const updatedAdmin = {
      ...adminAccount,
      password: newPassword,
    };

    localStorage.setItem(
      ADMIN_STORAGE_KEY,
      JSON.stringify(updatedAdmin)
    );

    alert("Đổi mật khẩu thành công");

    dom.adminProfileForm.reset();
  });

  document
    .getElementById("btnProfileLogout")
    ?.addEventListener("click", logOutAdmin);
};