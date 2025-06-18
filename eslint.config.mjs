// eslint.config.js
import { fileURLToPath } from "url";
import path from "path";
import { FlatCompat } from "@eslint/eslintrc";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

// Set up compatibility layer for using v8 configs in ESLint v9
const compat = new FlatCompat({
  baseDirectory: dirname,
  recommendedConfig: {
    extends: ["eslint:recommended"],
  },
  allConfig: {
    extends: ["eslint:all"],
  },
});

// Combine configs using the compatibility layer
const eslintConfig = [
  ...compat.extends(
    "next/core-web-vitals",
    "next/typescript",
    "airbnb", // Keep Airbnb base rules
    "airbnb/hooks", // Keep Airbnb React Hooks rules
    "prettier", // Add Prettier for formatting
  ),
  {
    // Override rules as needed
    rules: {
      // Fix the React 17+ JSX transform issues
      "react/react-in-jsx-scope": "off",
      "react/jsx-props-no-spreading": "off",

      // Allow JSX in .tsx files (for TypeScript)
      "react/jsx-filename-extension": [
        "error",
        { extensions: [".jsx", ".tsx"] },
      ],

      // Fix 'React' not defined error
      "no-undef": "off",

      // Additional rules you might want to customize
      "no-console": "warn", // Warning for console statements
      "import/extensions": [
        // Handle TypeScript imports
        "error",
        "ignorePackages",
        {
          js: "never",
          jsx: "never",
          ts: "never",
          tsx: "never",
        },
      ],
    },
  },
];

export default eslintConfig;
