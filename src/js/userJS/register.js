import {
  el,
  state,
  luuUsers,
} from "./core.js";

const phoneRegex = /^[0-9]{10}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/;

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

const kiemTraTrungUsername = (usernameValue) => {
  return state.users.some((user) => {
    return user.username.toLowerCase() === usernameValue.toLowerCase();
  });
};

const kiemTraTrungEmail = (emailValue) => {
  return state.users.some((user) => {
    return user.email.toLowerCase() === emailValue.toLowerCase();
  });
};

const taoUserMoi = (phoneValue, emailValue, usernameValue, passwordValue) => {
  return {
    id: Date.now(),
    username: usernameValue,
    password: passwordValue,
    phone: phoneValue,
    email: emailValue,
    role: "user",
    status: "active",
    createdAt: new Date().toLocaleString("vi-VN"),
  };
};

if (el.registerForm) {
  el.registerForm.addEventListener("submit", (event) => {
    event.preventDefault();

    let isValid = true;

    const phoneValue = el.registerPhone.value.trim();
    const emailValue = el.registerEmail.value.trim();
    const usernameValue = el.registerUsername.value.trim();
    const passwordValue = el.registerPassword.value.trim();

    if (phoneValue === "") {
      showError(
        el.registerPhone,
        el.registerPhoneError,
        "Không được để trống!"
      );

      isValid = false;
    } else if (!phoneRegex.test(phoneValue)) {
      showError(
        el.registerPhone,
        el.registerPhoneError,
        "Số điện thoại ko đúng định dạng!"
      );

      isValid = false;
    } else {
      showSuccess(el.registerPhone, el.registerPhoneError);
    }

    if (emailValue === "") {
      showError(
        el.registerEmail,
        el.registerEmailError,
        "Không được để trống!"
      );

      isValid = false;
    } else if (!emailRegex.test(emailValue)) {
      showError(
        el.registerEmail,
        el.registerEmailError,
        "email sai định dạng!"
      );

      isValid = false;
    } else {
      showSuccess(el.registerEmail, el.registerEmailError);
    }

    if (usernameValue === "") {
      showError(
        el.registerUsername,
        el.registerUsernameError,
        "Không được để trống!"
      );

      isValid = false;
    } else {
      showSuccess(el.registerUsername, el.registerUsernameError);
    }

    if (passwordValue === "") {
      showError(
        el.registerPassword,
        el.registerPasswordError,
        "Không được để trống!"
      );

      isValid = false;
    } else if (!passwordRegex.test(passwordValue)) {
      showError(
        el.registerPassword,
        el.registerPasswordError,
        "Mật khẩu yếu!"
      );

      isValid = false;
    } else {
      showSuccess(el.registerPassword, el.registerPasswordError);
    }

    if (!isValid) {
      return;
    }

    if (kiemTraTrungUsername(usernameValue)) {
      showError(
        el.registerUsername,
        el.registerUsernameError,
        "Tên đăng nhập đã tồn tại!"
      );

      return;
    }

    if (kiemTraTrungEmail(emailValue)) {
      showError(
        el.registerEmail,
        el.registerEmailError,
        "Email đã tồn tại!"
      );

      return;
    }

    const newUser = taoUserMoi(
      phoneValue,
      emailValue,
      usernameValue,
      passwordValue
    );

    state.users.push(newUser);

    luuUsers();

    alert("Đăng kí tài khoảng thành công!");

    window.location.href = "./login.html";
  });
}