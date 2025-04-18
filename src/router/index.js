import { createRouter, createWebHistory } from "vue-router";
import store from "@/store";
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import AboutView from "@/views/AboutView.vue";
import ContactView from "@/views/ContactView.vue";
import HomeView from "@/views/HomeView.vue";
import PropertiesView from "@/views/PropertiesView.vue";
import AdminDashboardView from "@/views/AdminDashboardView.vue";
import PropertyItemView from "@/views/PropertyItemView.vue";
import UserProfileView from "@/views/UserProfileView.vue";
import CreatePropertyView from "@/views/CreatePropertyView.vue";
import PropertyDetails from "@/components/createProperty/PropertyDetails.vue";
import PropertyPreview from "@/components/createProperty/PropertyPreview.vue";
import PropertyContact from "@/components/createProperty/PropertyContact.vue";
import Completed from "@/components/createProperty/Completed.vue";
import ForgetPasswordView from "@/views/ForgetPasswordView.vue";
import ResetPasswordView from "@/views/ResetPasswordView.vue";
import SelectRole from "@/components/SelectRole.vue";
import AdminPropertiesList from "@/components/adminDash/AdminPropertiesListView.vue";
import AdminProfile from "@/components/adminDash/AdminProfileView.vue";
import adminPropertyDetails from "@/components/adminDash/adminPropertyDetailsView.vue";
import AdminAddProperty from "@/components/adminDash/AdminAddPropertyView.vue";
import AdminEditPropertyDetails from "@/components/adminDash/AdminEditPropertyDetails.vue";
import AdminUserListView from "@/components/adminDash/AdminUserListView.vue";
import AdminEditUser from "@/components/adminDash/AdminEditUser.vue";
import AdminAddUser from "@/components/adminDash/AdminAddUser.vue";
import AdminOwnerList from "@/components/adminDash/AdminOwnerList.vue";
import AdminEditOwner from "@/components/adminDash/AdminEditOwner.vue";
import AdminAddOwner from "@/components/adminDash/AdminAddOwner.vue";
import AdminAddAdmin from "@/components/adminDash/AdminAddAdmin.vue";
import AdminRequestList from "@/components/adminDash/AdminRequestList.vue";
import AdminRequestDetails from "@/components/adminDash/AdminRequestDetails.vue";
import Payment from "@/components/Payment.vue";
import FaqView from "@/views/FaqView.vue";
import TurnstileVerificationView from "@/views/TurnstileVerificationView.vue";
import Overview from "@/components/adminDash/dashboard/Overview.vue";

const routes = [
  {
    path: "/verification",
    name: "verification",
    component: TurnstileVerificationView,
    meta: { exemptFromVerification: true },
  },
  {
    path: "/",
    component: DefaultLayout,
    children: [
      { path: "", name: "Home", component: HomeView },
      { path: "about", name: "About", component: AboutView },
      { path: "faq", name: "Faq", component: FaqView },
      { path: "properties", name: "Properties", component: PropertiesView },
      { path: "contact", name: "Contact", component: ContactView },
      { path: "propertyItem", name: "item", component: PropertyItemView },
      { path: "property/:title", component: PropertyItemView, props: true },
      { path: "payment", name: "payment", component: Payment },
      {
        path: "userProfile",
        name: "userProfile",
        component: UserProfileView,
        meta: { requiresAuth: true },
      },
      {
        path: "createProperty",
        name: "createProperty",
        component: CreatePropertyView,
        meta: { requiresOwner: true },
        children: [
          {
            path: "",
            redirect: { name: "propertyDetails" },
          },
          {
            path: "propertyDetails",
            name: "propertyDetails",
            component: PropertyDetails,
            props: true,
          },
          {
            path: "propertyPreview",
            name: "propertyPreview",
            component: PropertyPreview,
            props: true,
          },
          {
            path: "propertyContact",
            name: "propertyContact",
            component: PropertyContact,
            props: true,
          },
          {
            path: "completed",
            name: "completed",
            component: Completed,
          },
        ],
      },
    ],
  },
  // Lazily load views when they are needed
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/LoginView.vue"),
    meta: { authRestricted: true },
  },
  {
    path: "/register",
    name: "register",
    component: () => import("@/views/RegisterView.vue"),
    meta: { authRestricted: true },
  },
  {
    path: "/register-user",
    name: "registerUser",
    component: () => import("@/views/RegisterUserView.vue"),
    meta: { authRestricted: true },
  },
  {
    path: "/register-owner",
    name: "registerOwner",
    component: () => import("@/views/RegisterOwnerView.vue"),
    meta: { authRestricted: true },
  },
  {
    path: "/forget-password",
    name: "forgetPassword",
    component: ForgetPasswordView,
    meta: { authRestricted: true },
  },
  {
    path: "/reset-password",
    name: "resetPassword",
    component: ResetPasswordView,
    meta: { authRestricted: true },
  },
  {
    path: "/select-role",
    name: "SelectRole",
    component: SelectRole,
    meta: { authRestricted: true },
  },
  {
    path: "/admin",
    component: AdminDashboardView,
    meta: { requiresAdmin: true },
    children: [
      {
        path: "",
        redirect: { name: "adminProfile" },
      },
      { path: "profile", name: "adminProfile", component: AdminProfile },
      {
        path: "add-property",
        name: "addProperty",
        component: AdminAddProperty,
      },
      {
        path: "properties",
        name: "adminProperties",
        component: AdminPropertiesList,
      },
      {
        path: "properties/:title",
        name: "adminPropertyDetails",
        component: adminPropertyDetails,
      },
      {
        path: "properties/edit/:title",
        name: "adminEditPropertyDetails",
        component: AdminEditPropertyDetails,
      },
      {
        path: "users",
        name: "userList",
        component: AdminUserListView,
      },
      {
        path: "users/edit/:id",
        name: "editUser",
        component: AdminEditUser,
      },
      {
        path: "users/add-user",
        name: "addUser",
        component: AdminAddUser,
      },
      {
        path: "owners",
        name: "ownersList",
        component: AdminOwnerList,
      },
      {
        path: "owners/edit/:id",
        name: "editOwner",
        component: AdminEditOwner,
      },
      {
        path: "owners/add-owner",
        name: "addOwner",
        component: AdminAddOwner,
      },
      {
        path: "add-admin",
        name: "addAdmin",
        component: AdminAddAdmin,
      },
      {
        path: "requests",
        name: "propertyRequests",
        component: AdminRequestList,
      },
      {
        path: "overview",
        name: "dashboardOverview",
        component: Overview,
      },
      {
        path: "requests/:id",
        name: "requestDetails",
        component: AdminRequestDetails,
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("@/views/NotFoundView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 };
  },
});

const isVerificationExpired = () => {
  const verifiedAt = sessionStorage.getItem("verifiedAt");
  if (!verifiedAt) return true;
  const expirationTime = 24 * 60 * 60 * 1000; // 24 hours
  return Date.now() - parseInt(verifiedAt) > expirationTime;
};

// Combined navigation guard
router.beforeEach(async (to, from, next) => {
  if (to.path !== "/properties" && to.path !== "/property/:title") {
    store.dispatch("startLoading");
  }

  // Check if user is verified and verification hasn't expired
  const isVerified =
    !isVerificationExpired() && sessionStorage.getItem("turnstileVerified");

  // If verified, proceed directly
  if (isVerified) {
    await handleAuthAndRole(to, next);
    return;
  }

  // If not verified and not already on verification page, redirect
  if (!isVerified && to.path !== "/verification") {
    sessionStorage.setItem("turnstileRedirectPath", to.fullPath);
    next({ name: "verification" });
    return;
  }

  // If on verification page, just proceed (no auth check needed)
  next();
});

// Handle authentication and role-based access
async function handleAuthAndRole(to, next) {
  if (!store.state.auth.user) {
    await store.dispatch("auth/checkAuth");
  }

  const isAuth = store.getters["auth/isAuth"];
  const role = store.getters["auth/getRole"];

  // Prevent logged-in users from accessing auth-related routes
  if (isAuth && to.meta.authRestricted) {
    if (role === "admin") {
      next({ name: "adminProfile" });
    } else {
      next({ name: "Home" });
    }
    store.dispatch("stopLoading");
    return;
  }

  // Existing auth and role checks
  if (to.meta.requiresAuth && !isAuth) {
    next({ name: "login" });
  } else if (to.meta.requiresAdmin && role !== "admin") {
    next({ name: "NotFound" });
  } else if (to.meta.requiresOwner && role !== "owner") {
    next({ name: "NotFound" });
  } else if (isAuth && role === "admin" && to.path === "/") {
    next({ name: "adminProfile" });
    store.dispatch("stopLoading");
  } else {
    next();
  }
}

router.afterEach(() => {
  store.dispatch("stopLoading");
});

export default router;
