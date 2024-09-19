module.exports = {
  root: true,
  env: {
    node: false
  },
  extends: ['plugin:vue/essential'],
  parserOptions: {
    parser: '@babel/eslint-parser',
    requireConfigFile: false
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'space-before-function-paren': 0, // 不检查括号与方法名之间的空格
    semi: 0, // 不检查末尾分号
    quotes: 'off', // 不检查双引号
    'comma-dangle': 'off', // 不检查逗号
    camelcase: [0, { properties: 'always' }],
    'prefer-const': 0
  }
}
