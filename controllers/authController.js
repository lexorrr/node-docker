const User = require("../models/userModel");

const bcrypt = require("bcryptjs");

exports.signup = async (req, res, next) => {
  const { username, password } = req.body;
  
  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await User.create({ username, password: hashedPassword });

    req.session.user = newUser;
    res.status(201).json({
      status: "success",
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide username and password!",
      });
    }

    const user = await User.findOne({ username});
    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "user not found",
      });
    }

    const correct = await bcrypt.compare(password, user.password);

    if (!correct) {
      return res.status(400).json({
        status: "fail",
        message: "Incorrect username or password",
      });
    }

    req.session.user = user;
    return res.status(200).json({
      status: "success",
    });
    
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
}
