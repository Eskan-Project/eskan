import { createRouter, createWebHistory } from "vue-router";
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import AboutView from "@/views/AboutView.vue";
import ContactView from "@/views/ContactView.vue";
import HomeView from "@/views/HomeView.vue";
import PropertiesView from "@/views/PropertiesView.vue";
// import LoginView from "@/views/LoginView.vue";
import AdminDashboardView from "@/views/AdminDashboardView.vue";
import PropertyItemView from "@/views/PropertyItemView.vue";
import UserProfileView from "@/views/UserProfileView.vue";
import CreatePropertyView from "@/views/CreatePropertyView.vue";
import PropertyDetails from "@/components/createProperty/PropertyDetails.vue";
import PropertyPreview from "@/components/createProperty/PropertyPreview.vue";
import PropertyContact from "@/components/createProperty/PropertyContact.vue";
import Completed from "@/components/createProperty/Completed.vue";

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
      {
        path: "createProperty",
        name: "createProperty",
        component: CreatePropertyView,
        children: [
          {
            path: "",
            redirect: "propertyDetails",
          },
          {
            path: "propertyDetails",
            name: "propertyDetails",
            component: PropertyDetails,
          },
          {
            path: "propertyPreview",
            name: "propertyPreview",
            component: PropertyPreview,
          },
          {
            path: "propertyContact",
            name: "propertyContact",
            component: PropertyContact,
          },
          {
            path: "completed",
            name: "completed",
            component: Completed,
          },
        ],
      },
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
