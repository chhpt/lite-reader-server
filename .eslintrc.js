// http://eslint.org/docs/user-guide/configuring
module.exports = {
  root: true,
  extends: 'airbnb-base',
  rules: {
    'comma-dangle': ['error', 'never'],
    'global-require': 'off',
    'consistent-return': 'off',
    'no-console': 'off',
    'no-shadow': 'off',
    'no-param-reassign': 'off',
    'no-plusplus': 'off',
    'no-useless-escape': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  }
};
