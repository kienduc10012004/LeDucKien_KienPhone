import { initAdminCommon, initAdminMobileMenu } from "./adminJS/ui-flow.js";
import { initManageProduct } from "./adminJS/crud-flow.js";
import { initDashboard } from "./adminJS/dashboard-flow.js";
import { initManageOrder } from "./adminJS/order-flow.js";
import { initManageUser } from "./adminJS/user-flow.js";
import { initAdminProfile } from "./adminJS/profile-flow.js";

initAdminCommon();
initDashboard();
initManageProduct();
initManageOrder();
initManageUser();
initAdminProfile();
initAdminCommon();
initAdminMobileMenu();