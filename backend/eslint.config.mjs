// eslint.config.mjs
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';

export default tseslint.config(
  {
    ignores: ['dist', 'node_modules'],
  },

  // Regras recomendadas, mas sem travar decorators
  eslint.configs.recommended,

  // NÃO use recommendedTypeChecked para NestJS (quebra decorators)
  // ...tseslint.configs.recommendedTypeChecked, ❌ REMOVER

  // Apenas o TS rules básico (não quebra)
  ...tseslint.configs.recommended,

  eslintPluginPrettierRecommended,

  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
      parserOptions: {
        project: true,
      },
    },

    rules: {
      // Desligar regras que explodem decorators
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',

      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],

      'prettier/prettier': ['error', { endOfLine: 'auto' }],
    },
  }
);

