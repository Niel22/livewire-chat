import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import loginEN from "./locales/en/login.json";
import loginPT from "./locales/pt/login.json";

import registerEN from "./locales/en/register.json";
import registerPT from "./locales/pt/register.json";

import forgot_passwordEN from "./locales/en/forgot-password.json";
import forgot_passwordPT from "./locales/pt/forgot-password.json";

import confirm_passwordEN from "./locales/en/confirm-password.json";
import confirm_passwordPT from "./locales/pt/confirm-password.json";

import reset_passwordEN from "./locales/en/reset-password.json";
import reset_passwordPT from "./locales/pt/reset-password.json";

import verify_emailEN from "./locales/en/verify-email.json";
import verify_emailPT from "./locales/pt/verify-email.json";

import sidebarEN from "./locales/en/sidebar.json";
import sidebarPT from "./locales/pt/sidebar.json";

import convoEN from "./locales/en/convo.json";
import convoPT from "./locales/pt/convo.json";

import profileEN from "./locales/en/profile.json";
import profilePT from "./locales/pt/profile.json";


i18n.use(initReactI18next).init({
  resources: {
    EN: {
      login: loginEN,
      register: registerEN,
      forgot_password: forgot_passwordEN,
      confirm_password: confirm_passwordEN,
      reset_password: reset_passwordEN,
      verify_email: verify_emailEN,
      sidebar: sidebarEN,
      convo: convoEN,
      profile: profileEN,
    },  
    PT: {
      login: loginPT,
      register: registerPT,
      forgot_password: forgot_passwordPT,
      confirm_password: confirm_passwordPT,
      reset_password: reset_passwordPT,
      verify_email: verify_emailPT,
      sidebar: sidebarPT,
      convo: convoPT,
      profile: profilePT,
    },
  },
  lng: "PT",
  fallbackLng: "PT",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
