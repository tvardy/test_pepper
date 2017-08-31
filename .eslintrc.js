module.exports = {
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
    "semi": [2, "always"],
    "no-extra-semi": 2,
    "semi-spacing": [2, { "before": false, "after": true }]
  },
  "env": {
    "node": false
  }
};
