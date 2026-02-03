import nx from '@nx/eslint-plugin';

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: ['**/dist', '**/out-tsc'],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$'],
          depConstraints: [
            {
              sourceTag: '*',
              onlyDependOnLibsWithTags: ['*'],
            },
          ],
        },
      ],
    },
  },
  {
    files: [
      '**/*.ts',
      '**/*.tsx',
      '**/*.cts',
      '**/*.mts',
      '**/*.js',
      '**/*.jsx',
      '**/*.cjs',
      '**/*.mjs',
    ],
    // Override or add rules here
    rules: {
      ['@angular-eslint/directive-selector']: [
        'error',
        {
          type: 'attribute',
          prefix: 'gmi',
          style: 'camelCase',
        },
      ],
      ['@angular-eslint/component-selector']: [
        'error',
        {
          type: ['attribute', 'element'],
          prefix: 'gmi',
          style: 'kebab-case',
        },
      ],
      // Angular best practices
      ['@angular-eslint/no-empty-lifecycle-method']: 'warn',
      ['@angular-eslint/prefer-on-push-component-change-detection']: 'off', // should be turned on!
      ['@angular-eslint/prefer-output-readonly']: 'warn',
      ['@angular-eslint/prefer-signals']: 'warn',
      ['@angular-eslint/prefer-standalone']: 'warn',
      // TypeScript best practices
      ['@typescript-eslint/array-type']: ['warn'],
      ['@typescript-eslint/consistent-indexed-object-style']: 'off',
      ['@typescript-eslint/consistent-type-assertions']: 'warn',
      ['@typescript-eslint/consistent-type-definitions']: ['warn', 'type'],
      ['@typescript-eslint/explicit-function-return-type']: 'error',
      ['@typescript-eslint/explicit-member-accessibility']: [
        'error',
        {
          accessibility: 'no-public',
        },
      ],
      ['@typescript-eslint/naming-convention']: [
        'warn',
        {
          selector: 'variable',
          format: ['camelCase', 'UPPER_CASE', 'snake_case'],
          leadingUnderscore: 'forbid',
          trailingUnderscore: 'forbid',
        },
        {
          selector: 'classMethod',
          format: ['camelCase'],
          leadingUnderscore: 'forbid',
        },
        {
          selector: 'classMethod',
          format: ['camelCase'],
          modifiers: ['private'],
          leadingUnderscore: 'require',
        },
        {
          selector: 'classMethod',
          format: ['camelCase'],
          modifiers: ['protected'],
          leadingUnderscore: 'require',
        },
        {
          selector: 'classProperty',
          format: ['camelCase', 'snake_case'],
          leadingUnderscore: 'forbid',
        },
        {
          selector: 'classProperty',
          format: ['camelCase', 'snake_case'],
          modifiers: ['private'],
          leadingUnderscore: 'require',
        },
        {
          selector: 'classProperty',
          format: ['camelCase', 'snake_case'],
          modifiers: ['protected'],
          leadingUnderscore: 'require',
        },
        {
          selector: 'function',
          format: ['camelCase', 'PascalCase'],
          leadingUnderscore: 'forbid',
          trailingUnderscore: 'forbid',
        },
        {
          selector: 'typeLike',
          format: ['PascalCase'],
        },
        {
          selector: 'typeParameter',
          format: ['PascalCase'],
          prefix: ['T', 'K'],
        },
        {
          selector: 'enumMember',
          format: ['PascalCase'],
        },
        {
          selector: 'objectLiteralProperty',
          format: ['camelCase', 'snake_case'],
        },
      ],
      ['import/no-unresolved']: 'off',
      ['import/named']: 'off',
      ['lines-between-class-members']: 'error',
      ['@typescript-eslint/no-empty-function']: 'warn',
      ['@typescript-eslint/no-empty-interface']: 'error',
      ['@typescript-eslint/no-explicit-any']: 'warn',
      ['@typescript-eslint/no-inferrable-types']: 'warn',
      ['@typescript-eslint/no-shadow']: 'warn',
      ['@typescript-eslint/no-unused-vars']: 'warn',
      // JavaScript best practices
      eqeqeq: 'error',
      complexity: ['error', 20],
      curly: 'error',
      ['guard-for-in']: 'error',
      ['max-classes-per-file']: ['error', 1],
      ['max-len']: [
        'warn',
        {
          code: 120,
          comments: 160,
        },
      ],
      ['max-lines']: ['error', 400],
      ['no-bitwise']: 'error',
      ['no-console']: 'off',
      ['no-new-wrappers']: 'error',
      ['no-useless-concat']: 'error',
      ['no-var']: 'error',
      ['no-restricted-syntax']: 'off',
      ['no-shadow']: 'error',
      ['one-var']: ['error', 'never'],
      ['prefer-arrow-callback']: 'error',
      ['prefer-const']: 'error',
      ['sort-imports']: [
        'error',
        {
          ignoreCase: true,
          ignoreDeclarationSort: true,
          allowSeparatedGroups: true,
        },
      ],
      // Security
      ['no-eval']: 'error',
      ['no-implied-eval']: 'error',
    },
  },
  {
    files: ['**/*.html'],
    rules: {
      // Angular template best practices
      ['@angular-eslint/template/attributes-order']: [
        'error',
        {
          alphabetical: true,
          order: [
            'STRUCTURAL_DIRECTIVE', // deprecated, use @if and @for instead
            'TEMPLATE_REFERENCE', // e.g. `<input #inputRef>`
            'ATTRIBUTE_BINDING', // e.g. `<input required>`, `id="3"`
            'INPUT_BINDING', // e.g. `[id]="3"`, `[attr.colspan]="colspan"`,
            'TWO_WAY_BINDING', // e.g. `[(id)]="id"`,
            'OUTPUT_BINDING', // e.g. `(idChange)="handleChange()"`,
          ],
        },
      ],
      ['@angular-eslint/template/button-has-type']: 'warn',
      ['@angular-eslint/template/cyclomatic-complexity']: [
        'warn',
        { maxComplexity: 10 },
      ],
      ['@angular-eslint/template/eqeqeq']: 'error',
      ['@angular-eslint/template/prefer-control-flow']: 'error',
      ['@angular-eslint/template/prefer-ngsrc']: 'warn',
      ['@angular-eslint/template/prefer-self-closing-tags']: 'warn',
      ['@angular-eslint/template/use-track-by-function']: 'warn',
    },
  },
];
