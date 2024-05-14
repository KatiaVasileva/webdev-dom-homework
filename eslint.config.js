import js from "@eslint/js";
import prettierPlugin from "eslint-config-prettier";
import globals from "globals";

export default [
    js.configs.recommended,

    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
    },
    {
        rules: {
            semi: ["warn", "always"],
           "no-unused-vars": "error",
            camelcase: "error",
            eqeqeq: ["error", "always"]
        },
        plugins: {
            prettier: prettierPlugin,
        },
    },
];