const express = require("express");

const authenticate = require("../../middlewars/authenticate");

const {
  register,
  login,
  current,
  logout,
  updateUserSubscription,
} = require("../../controllers/auth");
const { validateBody } = require("../../middlewars/validateBody");
const {
  registerSchema,
  loginSchema,
  updateSubscriptionSchema,
} = require("../../models/user");

const router = express.Router();

router.post("/register", validateBody(registerSchema), register);

router.post("/login", validateBody(loginSchema), login);

router.get("/current", authenticate, current);

router.post("/logout", authenticate, logout);

router.patch(
  "/subscription",
  authenticate,
  validateBody(updateSubscriptionSchema),
  updateUserSubscription
);

module.exports = router;
