import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Menu } from "@headlessui/react";
import { langStore } from "@/store/langStore";

const TranslationWidget = () => {
  const { lang, setLang } = langStore();
  const { i18n } = useTranslation();

  const handleSelect = (code) => {
    setLang(code);
    i18n.changeLanguage(code);
  };

  useEffect(() => {
    if (!lang) {
      // const browserLang = navigator.language.startsWith("pt") ? "pt" : "pt";
      setLang("pt");
      i18n.changeLanguage("pt");
    } else {
      i18n.changeLanguage(lang);
    }
  }, [i18n, lang, setLang]);

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="uppercase text-xs bg-transparent font-bold md:text-sm py-2 px-3 rounded-xl border border-gray-300 dark:border-gray-600 dark:text-gray-200">
        {lang}
      </Menu.Button>

      <Menu.Items className="absolute right-0 mt-2 w-28 md:w-38 bg-white border p-1 border-gray-200 rounded-lg shadow-md z-10
                              dark:bg-gray-800 dark:border-gray-700">
        <Menu.Item>
          {({ active }) => (
            <button
              onClick={() => handleSelect("en")}
              className={`block w-full rounded text-left px-3 py-2 text-xs md:text-sm ${
                active
                  ? "bg-gray-100 dark:bg-gray-700"
                  : "text-gray-700 dark:text-gray-200"
              }`}
            >
              English
            </button>
          )}
        </Menu.Item>
        <Menu.Item>
          {({ active }) => (
            <button
              onClick={() => handleSelect("pt")}
              className={`block w-full rounded text-left px-3 py-2 text-xs md:text-sm ${
                active
                  ? "bg-gray-100 dark:bg-gray-700"
                  : "text-gray-700 dark:text-gray-200"
              }`}
            >
              Português (BR)
            </button>
          )}
        </Menu.Item>
      </Menu.Items>
    </Menu>
  );
};

export default TranslationWidget;
