module.exports = {
  root: true,
  env: {
    node: true
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
    'vue/multi-word-component-names': 0,
    'comma-dangle': 'off', // 不检查逗号
    'prefer-const': 0,
    'no-tabs': 'off', // 空格
    semi: 0, // 不检查末尾分号
    quotes: 'off', // 不检查双引号
    camelcase: [0, { properties: 'always' }],
    indent: 'off',
    'no-useless-escape': 0 // 禁止不必要的转义字符
  }
}
