module.exports = {
  "root": true,
  "extends": "standard",
  "plugins": [
    "standard",
    "promise"
  ],
  "env": {
    "es6": true,
    "node": false,
    "browser": true
  },
  "parserOptions": {
    "ecmaVersion": 6,
    "ecmaFeatures": {
      "experimentalObjectRestSpread": true,
      "jsx": false
    }
  },
  "rules": {
    "no-console": ["error"],
    "no-debugger": ["error"],
    "semi": [2, "always"],
    "no-extra-semi": 2,
    "semi-spacing": [2, { "before": false, "after": true }]
  }
};
