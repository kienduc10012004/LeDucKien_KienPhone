  const USER_STORAGE_KEY = "KIENPHONE_USERS";
  const ADMIN_STORAGE_KEY = "KIENPHONE_ADMIN";

  const userTableBody = document.getElementById("userTableBody");
  const userKeyword = document.getElementById("userKeyword");

  const adminPasswordPopup = document.getElementById("adminPasswordPopup");
  const adminPasswordOverlay = document.getElementById("adminPasswordOverlay");
  const popupAdminUsername = document.getElementById("popupAdminUsername");
  const popupAdminPassword = document.getElementById("popupAdminPassword");
  const btnConfirmShowPassword = document.getElementById("btnConfirmShowPassword");
  const btnClosePasswordPopup = document.getElementById("btnClosePasswordPopup");

  let users = [];
  let selectedUserId = null;
  let visiblePasswordIds = [];

  const getUsers = () => {
    return JSON.parse(localStorage.getItem(USER_STORAGE_KEY)) || [];
  };

  const saveUsers = (users) => {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(users));
  };

  const getAdminAccount = () => {
    const admin = JSON.parse(localStorage.getItem(ADMIN_STORAGE_KEY));

    if (admin) {
      return admin;
    }

    return {
      username: "admin",
      password: "Admin123@",
    };
  };

  const openPasswordPopup = (userId) => {
    selectedUserId = userId;

    popupAdminUsername.value = "";
    popupAdminPassword.value = "";

    adminPasswordPopup.classList.remove("hidden");
  };

  const closePasswordPopup = () => {
    selectedUserId = null;
    adminPasswordPopup.classList.add("hidden");
  };

  const isPasswordVisible = (userId) => {
    return visiblePasswordIds.includes(String(userId));
  };

  const showPassword = (userId) => {
    if (!visiblePasswordIds.includes(String(userId))) {
      visiblePasswordIds.push(String(userId));
    }

    renderUsers(users);
  };

  const hidePassword = (userId) => {
    visiblePasswordIds = visiblePasswordIds.filter((id) => {
      return id !== String(userId);
    });

    renderUsers(users);
  };

  const renderUsers = (list) => {
    if (!userTableBody) return;

    if (list.length === 0) {
      userTableBody.innerHTML = `
        <tr>
          <td colspan="8" class="py-8 text-center text-slate-400 font-bold">
            Không tìm thấy người dùng
          </td>
        </tr>
      `;
      return;
    }

    userTableBody.innerHTML = list.map((user) => {
      const statusText =
        user.status === "locked"
          ? "Đã khóa"
          : "Hoạt động";

      const statusButtonText =
        user.status === "locked"
          ? "Mở"
          : "Khóa";

      const statusButtonClass =
        user.status === "locked"
          ? "bg-emerald-500 hover:bg-emerald-600"
          : "bg-amber-500 hover:bg-amber-600";

      const statusButtonPadding =
        statusButtonText === "Khóa"
          ? "px-4"
          : "px-6";
      const passwordIsVisible = isPasswordVisible(user.id);

      return `
        <tr class="border-b hover:bg-slate-50">
          <td class="py-4 px-4">
            <div class="relative group inline-block">
              <span class="font-bold">
                ${truncateText(user.username, 10)}
              </span>

              ${
                user.username.length > 10
                  ? `
                    <div class="pointer-events-none invisible opacity-0 group-hover:visible group-hover:opacity-100 absolute bottom-full left-0 mt-2 z-50 bg-slate-900 text-white text-xs px-3 py-2 rounded-xl shadow-xl whitespace-nowrap transition-opacity duration-150">
                      ${user.username}
                    </div>
                  `
                  : ""
              }
            </div>
          </td>
          <td class="py-4 px-4">${user.email || "Chưa có"}</td>
          <td class="py-4 px-4">${user.phone || "Chưa có"}</td>
          <td class="py-4 px-4">${user.createdAt || "Chưa có"}</td>
          <td class="py-4 px-4">${user.role || "user"}</td>

          <td class="py-4 px-4">
            <div class="relative group inline-block">
              <span>
                ${
                  passwordIsVisible
                    ? truncateText(user.password, 10)
                    : "*********"
                }
              </span>

              ${
                passwordIsVisible &&
                user.password.length > 10
                  ? `
                    <div class="pointer-events-none invisible opacity-0 group-hover:visible group-hover:opacity-100 absolute bottom-full left-0 mt-2 z-50 bg-slate-900 text-white text-xs px-3 py-2 rounded-xl shadow-xl whitespace-nowrap transition-opacity duration-150">
                      ${user.password}
                    </div>
                  `
                  : ""
              }
            </div>

            <button
              onclick="toggleShowUserPassword('${user.id}')"
              class="ml-2 text-blue-600 hover:text-blue-800 cursor-pointer"
            >
              <i class="${passwordIsVisible ? "fa-regular fa-eye-slash" : "fa-regular fa-eye"}"></i>
            </button>
          </td>

          <td class="py-4 flex justify-center cursor-pointer duration-100 px-4">${statusText}</td>

          <td class="py-4 px-4">
            <div class="flex gap-2">
              <button
                onclick="toggleUserStatus('${user.id}')"
                class="${statusButtonClass} text-white ${statusButtonPadding} cursor-pointer duration-100 py-2 rounded-xl font-bold"
              >
                ${statusButtonText}
              </button>

              <button
                onclick="deleteUser('${user.id}')"
                class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-bold"
              >
                Xóa
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join("");
  };

  window.toggleShowUserPassword = (userId) => {
    if (isPasswordVisible(userId)) {
      hidePassword(userId);
      return;
    }

    openPasswordPopup(userId);
  };

  window.toggleUserStatus = (id) => {
    users = users.map((user) => {
      if (String(user.id) === String(id)) {
        return {
          ...user,
          status:
            user.status === "locked"
              ? "active"
              : "locked",
        };
      }

      return user;
    });

    saveUsers(users);
    renderUsers(users);
  };

  window.deleteUser = (id) => {
    const user = users.find((item) => {
      return String(item.id) === String(id);
    });

    if (!user) return;

    const confirmDelete = confirm(
      `Bạn có chắc muốn xóa tài khoản "${user.username}" không?`
    );

    if (!confirmDelete) return;

    users = users.filter((item) => {
      return String(item.id) !== String(id);
    });

    visiblePasswordIds = visiblePasswordIds.filter((item) => {
      return item !== String(id);
    });

    saveUsers(users);
    renderUsers(users);
  };

  export const initManageUser = () => {
    users = getUsers();
    renderUsers(users);

    if (userKeyword) {
      userKeyword.addEventListener("input", () => {
        const keyword = userKeyword.value.toLowerCase().trim();

        const filteredUsers = users.filter((user) => {
          return (
            String(user.username || "").toLowerCase().includes(keyword) ||
            String(user.email || "").toLowerCase().includes(keyword) ||
            String(user.phone || "").includes(keyword)
          );
        });

        renderUsers(filteredUsers);
      });
    }

    const handleConfirmShowPassword = () => {
      const adminAccount = getAdminAccount();

      const usernameValue =
        popupAdminUsername.value.trim();

      const passwordValue =
        popupAdminPassword.value.trim();

      if (
        usernameValue !== adminAccount.username ||
        passwordValue !== adminAccount.password
      ) {
        alert("Tài khoảng không đúng!");
        return;
      }

      showPassword(selectedUserId);
      closePasswordPopup();
    };

    btnConfirmShowPassword?.addEventListener(
      "click",
      handleConfirmShowPassword
  );

  [popupAdminUsername, popupAdminPassword]
    .forEach((input) => {
      input?.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          event.preventDefault();

          handleConfirmShowPassword();
        }
      });
    });

    btnClosePasswordPopup?.addEventListener("click", closePasswordPopup);
    adminPasswordOverlay?.addEventListener("click", closePasswordPopup);
  };

  

  const truncateText = (text, maxLength = 10) => {
    if (!text) return "";

    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };