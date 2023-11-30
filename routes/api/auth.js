const express = require("express");

const authenticate = require("../../middlewars/authenticate");
const {
  register,
  login,
  current,
  logout,
  updateUserSubscription,
  updateAvatar,
} = require("../../controllers/auth");
const { validateBody } = require("../../middlewars/validateBody");
const upload = require("../../middlewars/upload");
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

router.patch("/avatars", authenticate, upload.single("avatar"), updateAvatar);

module.exports = router;
