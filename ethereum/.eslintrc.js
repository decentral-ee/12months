module.exports = {
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 2017,
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true
        }
    },
    "globals": {
        "before": true,
        "after": true,
        "beforeEach": true,
        "afterEach": true,
        "contract": true,
        "it": true,
        "assert": true,
        "web3": true,
        "artifacts": true,
    },
    "env": {
        "es6": true,
        "node": true
    },
    "rules": {
        "indent": [
            "error",
            2
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "double"
        ],
        "semi": [
            "error",
            "always"
        ],
        "no-console": "off"
    }
};
