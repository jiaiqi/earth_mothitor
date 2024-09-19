module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: '@babel/eslint-parser',
    requireConfigFile: false
  },
  rules: {
     // 关闭驼峰命名法
     'vue/multi-word-component-names': 0,
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'space-before-function-paren': 0, // 不检查括号与方法名之间的空格
    'vue/multi-word-component-names': [
      'error',
      {
        ignores: ['index'], // 需要忽略的组件名
      },
    ],
    semi: 0, // 不检查末尾分号
    quotes: 'off', // 不检查双引号
    'comma-dangle': 'off', // 不检查逗号
    'prefer-const': 0,
    indent: ['off', 2],
    camelcase: [0, { properties: 'always' }],
  }
}
