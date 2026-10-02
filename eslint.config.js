import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  { ignores: ['dist', 'cms/dist', 'cms/build', 'cms/.strapi', 'cms/types', 'cms/src/admin/*.example.js'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      // Sin el plugin de React, el uso en JSX no cuenta: los nombres con mayúscula son componentes.
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]', argsIgnorePattern: '^[A-Z_]' }],
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
  // Código que corre en Node, no en el navegador: Strapi (CommonJS) y la configuración de Vite.
  {
    files: ['cms/**/*.js', 'vite.config.js'],
    ignores: ['cms/src/admin/**'],
    languageOptions: {
      globals: { ...globals.node, strapi: 'readonly' },
    },
  },
  {
    files: ['cms/**/*.js'],
    ignores: ['cms/src/admin/**'],
    languageOptions: { sourceType: 'commonjs' },
  },
]
