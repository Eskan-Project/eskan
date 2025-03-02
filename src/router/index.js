import { createRouter, createWebHistory } from "vue-router";
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import AboutView from "@/views/AboutView.vue";
import ContactView from "@/views/ContactView.vue";
import HomeView from "@/views/HomeView.vue";
import PropertiesView from "@/views/PropertiesView.vue";
// import LoginView from "@/views/LoginView.vue";
// import AdminDashboardView from '@/views/AdminDashboardView.vue';
import PropertyItemView from "@/views/PropertyItemView.vue";
import UserProfileView from "@/views/UserProfileView.vue";

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
      { path: "userProfile", name: "userProfile", component: UserProfileView },
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
    path: "/admin",
    name: "admin",
    component: () => import("@/views/AdminDashboardView.vue"),
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
});

export default router;
