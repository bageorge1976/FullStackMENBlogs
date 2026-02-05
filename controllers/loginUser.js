const bcrypt = require("bcrypt");
const User = require("../models/User");

module.exports = async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1) Find the user (Promise-based)
    const user = await User.findOne({ username });

    // 2) Reject if not found
    if (!user) {
      return res.redirect("/auth/login");
    }

    // 3) Compare password
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.redirect("/auth/login");
    }
    console.log("User id:", user._id);
    req.session.userId = user._id; // <-- set session userId
    console.log("User logged in successfully:", username);

    // TODO: set session/cookie/JWT here (otherwise "logged in" won't persist)
    return res.redirect("/");
  } catch (err) {
    console.error("loginUser error:", err);
    return res.status(500).send("Server error");
  }
};
