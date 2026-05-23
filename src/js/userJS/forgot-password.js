const USER_STORAGE_KEY = "KIENPHONE_USERS";

const forgotForm = document.getElementById("forgotForm");

const forgotUsername = document.getElementById("forgotUsername");
const forgotPhone = document.getElementById("forgotPhone");
const forgotNewPassword = document.getElementById("forgotNewPassword");
const forgotConfirmPassword = document.getElementById("forgotConfirmPassword");

const forgotUsernameError = document.getElementById("forgotUsernameError");
const forgotPhoneError = document.getElementById("forgotPhoneError");
const forgotNewPasswordError = document.getElementById("forgotNewPasswordError");
const forgotConfirmPasswordError = document.getElementById("forgotConfirmPasswordError");

const phoneRegex = /^[0-9]{10}$/;

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/;

const getUsers = () => {
  return JSON.parse(localStorage.getItem(USER_STORAGE_KEY)) || [];
};

const saveUsers = (users) => {
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(users));
};

const showError = (input, errorElement, message) => {
  input.classList.remove("border-green-500");
  input.classList.add("border-red-500");

  errorElement.textContent = message;
  errorElement.classList.remove("hidden");
};

const showSuccess = (input, errorElement) => {
  input.classList.remove("border-red-500");
  input.classList.add("border-green-500");

  errorElement.textContent = "";
  errorElement.classList.add("hidden");
};

if (forgotForm) {
  forgotForm.addEventListener("submit", (event) => {
    event.preventDefault();

    let isValid = true;

    const usernameValue = forgotUsername.value.trim();
    const phoneValue = forgotPhone.value.trim();
    const newPasswordValue = forgotNewPassword.value.trim();
    const confirmPasswordValue = forgotConfirmPassword.value.trim();

    if (usernameValue === "") {
      showError(
        forgotUsername,
        forgotUsernameError,
        "Không được để trống!"
      );

      isValid = false;
    } else {
      showSuccess(forgotUsername, forgotUsernameError);
    }

    if (phoneValue === "") {
      showError(
        forgotPhone,
        forgotPhoneError,
        "Không được để trống!"
      );

      isValid = false;
    } else if (!phoneRegex.test(phoneValue)) {
      showError(
        forgotPhone,
        forgotPhoneError,
        "Số điện thoại ko đúng định dạng!"
      );

      isValid = false;
    } else {
      showSuccess(forgotPhone, forgotPhoneError);
    }

    if (newPasswordValue === "") {
      showError(
        forgotNewPassword,
        forgotNewPasswordError,
        "Không được để trống!"
      );

      isValid = false;
    } else if (!passwordRegex.test(newPasswordValue)) {
      showError(
        forgotNewPassword,
        forgotNewPasswordError,
        "Mật khẩu yếu!"
      );

      isValid = false;
    } else {
      showSuccess(forgotNewPassword, forgotNewPasswordError);
    }

    if (confirmPasswordValue === "") {
      showError(
        forgotConfirmPassword,
        forgotConfirmPasswordError,
        "Không được để trống!"
      );

      isValid = false;
    } else if (confirmPasswordValue !== newPasswordValue) {
      showError(
        forgotConfirmPassword,
        forgotConfirmPasswordError,
        "Mật khẩu xác nhận không khớp!"
      );

      isValid = false;
    } else {
      showSuccess(forgotConfirmPassword, forgotConfirmPasswordError);
    }

    if (!isValid) {
      return;
    }

    const users = getUsers();

    const userByUsername = users.find((user) => {
      return user.username === usernameValue;
    });

    const userByPassword = users.find((user) => {
      return user.password === newPasswordValue;
    });

    if (userByUsername && !userByPassword) {
      userByUsername.password = newPasswordValue;
      userByUsername.phone = phoneValue;

      saveUsers(users);

      alert("Đã cập nhật lại mật khẩu cho tài khoản!");
      window.location.href = "./login.html";
      return;
    }

    if (!userByUsername && userByPassword) {
      userByPassword.username = usernameValue;
      userByPassword.phone = phoneValue;

      saveUsers(users);

      alert("Đã cập nhật lại tên đăng nhập cho tài khoản!");
      window.location.href = "./login.html";
      return;
    }

    if (userByUsername && userByPassword) {
      alert("Tài khoản đã tồn tại, thông tin được giữ nguyên!");
      window.location.href = "./login.html";
      return;
    }

    const newUser = {
      id: Date.now(),
      username: usernameValue,
      password: newPasswordValue,
      phone: phoneValue,
      email: "",
      role: "user",
      status: "active",
      createdAt: new Date().toLocaleString("vi-VN"),
    };

    users.push(newUser);
    saveUsers(users);

    alert("Đã tạo tài khoản mới thành công!");
    window.location.href = "./login.html";
  });
}