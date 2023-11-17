const express = require("express");

const { register, login } = require("../../controllers/auth");
const { validateBody } = require("../../middlewars/validateBody");
const { registerSchema, loginSchema } = require("../../models/user");

const router = express.Router();

router.post("/register", validateBody(registerSchema), register);

router.post("/login", validateBody(loginSchema), login)

module.exports = router;
