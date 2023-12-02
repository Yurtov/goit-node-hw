const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");
const Jimp = require("jimp");
const { v4: uuidv4 } = require("uuid");

const { User } = require("../models/user");
const ctrlWrapper = require("../helpers/ctrlWrapper");
const sendMail = require("../helpers/sendMail");

const { SECRET_KEY, BASE_URL } = process.env;
const avatarDir = path.join(__dirname, "../", "public", "avatars");

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    return res.status(409).json({ message: "Email in use" });
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);

  const verificationToken = uuidv4();

  await sendMail({
    to: email,
    subject: "Welcome, to the Phonebook",
    html: `<div><p>Thanks for register to the Phonebook. Before we can continue, we need to validate your email address.</p></br><p>To validate your email, clik here <a href="http://localhost:3000/api/users/verify/${verificationToken}">validate</a></p></div>`,
    test: `Thanks for register to The Phonebook. Before we can continue, we need to validate your email address. To validate your email, open the link ${BASE_URL}/api/users/verify/${verificationToken}`,
  });

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({ message: "Email or password is wrong" });
  }

  const passwordCompare = await bcrypt.compare(password, user.password);

  if (!passwordCompare) {
    return res.status(401).json({ message: "Email or password is wrong" });
  }

  if (user.verify === false) {
    return res
      .status(401)
      .json({ message: "Your email address is not validate" });
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "2h" });

  await User.findByIdAndUpdate(user._id, { token });

  res.json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

const current = async (req, res, next) => {
  const { email, subscription } = req.user;

  res.json({
    email,
    subscription,
  });
};

const logout = async (req, res, next) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });
  res.json({ message: "logout success" });
};

const updateUserSubscription = async (req, res, next) => {
  const { _id } = req.user;
  console.log(_id);
  const result = await User.findByIdAndUpdate(_id, req.body, {
    new: true,
  });
  if (!result) {
    return next();
  }
  res.json({ massage: "subscription successfully changed" });
};

const updateAvatar = async (req, res, next) => {
  if (!req.file) {
    res.status(400).json({ message: "the file is not attached" });
  }
  const { _id } = req.user;
  const { path: tempUpload, originalname } = req.file;
  await Jimp.read(tempUpload)
    .then((avatar) => {
      return avatar.resize(250, 250).write(tempUpload);
    })
    .catch((error) => {
      throw error;
    });

  const fileName = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarDir, fileName);

  await fs.rename(tempUpload, resultUpload);
  const avatarURL = path.join("avatars", fileName);
  await User.findByIdAndUpdate(_id, { avatarURL });

  res.json({ avatarURL });
};

const verify = async (req, res, next) => {
  const { verificationToken } = req.params;

  const user = await User.findOne({
    verificationToken: verificationToken,
  }).exec();

  if (user === null) {
    next();
  }

  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: null,
  });

  res.status(200).json({
    message: "Verification successful",
  });
};

const verifyByMail = async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email }).exec();

  if (user === null) {
    next();
  }

  if (user.verify === true) {
    next(
      res.status(400).json({ message: "Verification has already been passed" })
    );
  }

  await sendMail({
    to: email,
    subject: "Welcome, to the Phonebook",
    html: `<div><p>Thanks for register to the Phonebook. Before we can continue, we need to validate your email address.</p></br><p>To validate your email, clik here <a href="http://localhost:3000/api/users/verify/${user.verificationToken}">validate</a></p></div>`,
    test: `Thanks for register to The Phonebook. Before we can continue, we need to validate your email address. To validate your email, open the link ${BASE_URL}/api/users/verify/${user.verificationToken}`,
  });

  res.status(200).json({
    message: "Verification email sent",
  });
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  current: ctrlWrapper(current),
  logout: ctrlWrapper(logout),
  updateUserSubscription: ctrlWrapper(updateUserSubscription),
  updateAvatar: ctrlWrapper(updateAvatar),
  verify: ctrlWrapper(verify),
  verifyByMail: ctrlWrapper(verifyByMail),
};
