import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'
import tseslint from 'typescript-eslint'

export default [
  { ignores: ['dist', 'node_modules', 'coverage', '*.config.ts', '*.config.js'] },
  js.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  ...tseslint.configs.recommended,
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      'vue/multi-word-component-names': 'off',
    },
  },
  {
    files: ['server/**/*.js', 'database/**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        process: 'readonly',
        require: 'readonly',
        module: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    files: ['**/*.{ts,vue}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
]
