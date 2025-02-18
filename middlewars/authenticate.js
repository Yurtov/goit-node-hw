const jwt = require("jsonwebtoken");

const { User } = require("../models/user");
const { SECRET_KEY } = process.env;

const authenticate = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    next(res.status(401).json({ message: "Not authorized" }));
  }

  try {
    const { id } = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(id);
    if (!user || !user.token || user.token !== token) {
      next(res.status(401).json({ message: "Not authorized" }));
    }
    if (user.verify === false) {
      next(
        res.status(401).json({ message: "Your email address is not validate" })
      );
    }
    req.user = user;
    next();
  } catch (error) {
    next(res.status(401).json({ message: "Not authorized" }));
  }
};

module.exports = authenticate;
