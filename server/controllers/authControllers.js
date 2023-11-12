const jwt = require('jsonwebtoken');
const asyncHandler = require('../middlewares/asyncHandler');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const Entity = require('../models/entity');

const {
  validateLoginData,
  validateSignupData
} = require('../utils/validators');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  })
};

const createUser = asyncHandler(async (req, res, next) => {
  const social_login = req.query.typel;
  let userData = req.body;

  const { email, password, phone, firstName, lastName, group, role } = userData;
  const { errors, valid } = validateSignupData(req.body);

  // Validate required fields
  if (!valid) {
    return res.status(400).json({
      m: "Required Fields",
      c: 400,
      d: errors,
    });
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  let newObj = {
    email: String(email).toLowerCase(),
    password: hashedPassword,
    firstName: String(firstName),
    lastName: String(lastName),
    phone,
    role: group === 'unleaded' ? 'super' : role
  }

  // Creation of user
  const newUser = await User.create(newObj).catch((err) => {
    console.log(err);
  });

  if (newUser) {
    res.status(201).json({
      ...newUser._doc,
      token: generateToken(newUser._id),
    });
  } else {
    res.status(400).send("Invalid user data");
  }
});

const createSocialsUser = asyncHandler(async (req, res, next) => {
  const { email, password, phone, firstName, lastName, group, role } = req.body;
  const { errors, valid } = validateSignupData(req.body);

  // Validate required fields
  if (!valid) {
    return res.status(400).json({
      m: "Required Fields",
      c: 400,
      d: errors,
    });
  }

  let user = await User.findOne({ email });
  console.log(user);
  if (!user) {
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let newObj = {
      email: String(email).toLowerCase(),
      password: hashedPassword,
      firstName: String(firstName),
      lastName: String(lastName),
      phone,
      role: group === 'unleaded' ? 'super' : role
    }

    // Creation of user
    const newUser = await User.create(newObj).catch((err) => {
      console.log(err);
    });

    if (newUser) {
      res.status(201).json({
        ...newUser._doc,
        token: generateToken(newUser._id),
      });
    } else {
      res.status(400).send("Invalid user data");
    }
  } else {
    if (user.isSuspended) {
      return res.status(400).send({
        status: 400,
        message: "Your account has been Suspended!",
        username: String(user.email).toUpperCase(),
      });
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      return res.status(400).send({ status: 400, message: "Invalid Credentials" });
    }

    const token = generateToken(user._id);
    res.status(200).send({ ...user._doc, token, isOtpVerified: true });
  }
});

const signin = asyncHandler(async (req, res, next) => {
  const { errors, valid } = validateLoginData(req.body);
  try {
    if (!valid) {
      return res.status(400).json({
        message: "Invalid Data",
        c: 400,
        d: errors,
      });
    }

    let email = req.body.email;

    let user = await User.findOne({ email });
    console.log(user);
    if (!user) {
      return res.status(400).send({ status: 400, message: "Invalid Credentials" });
    }

    if (user.isSuspended) {
      return res.status(400).send({
        status: 400,
        message: "Your account has been Suspended!",
        username: String(user.email).toUpperCase(),
      });
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      return res.status(400).send({ status: 400, message: "Invalid Credentials" });
    }

    const token = generateToken(user._id);
    res.status(200).send({ ...user._doc, token, isOtpVerified: true });
  } catch (err) {
    return res.status(400).json({
      message: "Invalid Data",
      c: 400,
      d: { message: "Invalid Credentials" },
    });
  }
});

const getUserData = asyncHandler(async (req, res, next) => {
  let user = req.user;
  console.log(user)
  try {
    if (!user) {
      return res.status(400).send({ status: 400, message: "Invalid Credentials" });
    }

    if (user.isSuspended) {
      return res.status(400).send({
        status: 400,
        message: "Your account has been Suspended!",
        username: String(user.email).toUpperCase(),
      });
    }

    res.status(200).send({ ...user._doc });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      message: "Invalid Data",
      c: 400,
      d: { message: "Invalid Credentials" },
    });
  }
});

const generateOtp = asyncHandler(async (req, res, next) => {
  let otp = Math.floor(100000 + Math.random() * 900000);
  try {
    res.status(200).send({ otp });
  } catch (err) {
    return res.status(400).json({
      message: "Invalid Data",
      c: 400,
      d: { message: "Invalid Data" },
    });
  }
});


module.exports = {
  createUser,
  createSocialsUser,
  signin,
  getUserData,
  generateOtp,
};