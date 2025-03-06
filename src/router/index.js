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
import AdminPropertiesList from "@/views/AdminPropertiesList.vue";

import Payment from "@/components/Payment.vue";

const routes = [
  {
    path: "/",
    component: DefaultLayout,
    children: [
      { path: "", name: "Home", component: HomeView },
      { path: "about", name: "About", component: AboutView },
      { path: "properties", name: "Properties", component: PropertiesView },
      { path: "contact", name: "Contact", component: ContactView },
      { path: "propertyItem", name: "item", component: PropertyItemView },
      { path: "property/:id", component: PropertyItemView, props: true },
      { path: "payment", name: "payment", component: Payment },
      {
        path: "admin/properties",
        name: "prop",
        component: AdminPropertiesList,
      },
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
  // lazily load views when they are needed
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/LoginView.vue"),
  },
  {
    path: "/register",
    name: "register",
    component: () => import("@/views/RegisterView.vue"),
  },
  {
    path: "/register-user",
    name: "registerUser",
    component: () => import("@/views/RegisterUserView.vue"),
  },
  {
    path: "/register-owner",
    name: "registerOwner",
    component: () => import("@/views/RegisterOwnerView.vue"),
  },
  {
    path: "/forget-password",
    name: "forgetPassword",
    component: ForgetPasswordView,
  },
  {
    path: "/reset-password",
    name: "resetPassword",
    component: ResetPasswordView,
  },
  {
    path: "/select-role",
    name: "SelectRole",
    component: SelectRole,
  },

  {
    path: "/admin",
    name: "admin",
    component: AdminDashboardView,
    children: [
      {
        path: "/properties",
        name: "prop",
        component: AdminPropertiesList,
      },
    ],
    meta: { requiresAdmin: true },
  },
  /**
   ********************************************************************************************
   ********************************************************************************************
   ******                         Always leave this as last one                          ******
   ********************************************************************************************
   ********************************************************************************************
   */
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

router.beforeEach(async (to, from, next) => {
  await store.dispatch("auth/checkAuth");
  const isAuth = store.getters["auth/isAuth"];
  const role = store.getters["auth/getRole"];

  if (!store.state.auth.user) {
    await store.dispatch("auth/checkAuth");
  }

  if (to.meta.requiresAuth && !isAuth) {
    return next({ name: "login" });
  }

  if (role === "admin") {
    return next();
  }

  if (to.meta.requiresAdmin && role !== "admin") {
    return next({ name: "NotFound" });
  }

  if (to.meta.requiresOwner && role !== "owner") {
    return next({ name: "NotFound" });
  }

  next();
});

export default router;
