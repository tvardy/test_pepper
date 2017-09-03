module.exports = {
  "root": true,
  "extends": "standard",
  "plugins": [
    "standard",
    "promise"
  ],
  "parserOptions": {
    "ecmaVersion": 6,
    "ecmaFeatures": {
      "experimentalObjectRestSpread": true,
      "jsx": false
    }
  },
  "rules": {
    "no-console": ["warn"],
    "no-debugger": ["error"],
    "no-extra-semi": 2,
    "semi-spacing": [2, { "before": false, "after": true }]
  },
  "env": {
    "browser": false,
    "es6": true,
    "node": true
  }
};
