"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router = express.Router();
/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});
exports.default = router;
//# sourceMappingURL=users.js.map