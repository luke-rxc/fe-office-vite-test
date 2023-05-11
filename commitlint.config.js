module.exports = {
  extends: [
    '@commitlint/config-conventional'
  ],
  rules: {
    'body-leading-blank': [1, 'always'],
    'references-empty': [2, 'never'],
    'scope-case': [2, 'always', 'lower-case'],
    'scope-empty': [1, 'never'],
    'scope-enum': [2, 'always', []],
    'subject-case': [2, 'never'],
    'subject-empty': [2, 'never'],
    'subject-trailing-references': [2, 'always'],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'type-enum': [
      2,
      'always',
      [
        'chore',
        'ci',
        'docs',
        'feat',
        'fix',
        'perf',
        'refactor',
        'revert',
        'style',
        'test'
      ]
    ]
  },
  plugins: [
    'commitlint-plugin-subject-references'
  ]
}
