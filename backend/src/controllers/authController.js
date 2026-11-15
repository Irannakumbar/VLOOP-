const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/env');
const { successResponse, errorResponse } = require('../utils/responseFormatter');

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return errorResponse(res, 'Please provide name, email and password', 400);
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return errorResponse(res, 'An account with this email address already exists.', 409);
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      walletBalances: {
        VEs: 1500, // Welcome bonus
        SVEs: 1000,
        Tokens: 5000,
      },
    });

    const token = generateToken(user._id);

    return successResponse(
      res,
      {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          walletBalances: user.walletBalances,
          shippingAddress: user.shippingAddress,
        },
      },
      'Account created successfully! Welcome bonus credited to your wallet.',
      201
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Login user & get token
// @route   POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, 'Please provide both email and password', 400);
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return errorResponse(res, 'Invalid email or password.', 401);
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return errorResponse(res, 'Invalid email or password.', 401);
    }

    const token = generateToken(user._id);

    return successResponse(
      res,
      {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          walletBalances: user.walletBalances,
          shippingAddress: user.shippingAddress,
        },
      },
      'Welcome back to VELOOP Rewards!'
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Get current authenticated user profile & live balances
// @route   GET /api/auth/me
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    return successResponse(res, {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        walletBalances: user.walletBalances,
        shippingAddress: user.shippingAddress,
        phone: user.phone,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update shipping address for physical prize claims
// @route   PUT /api/auth/shipping-address
exports.updateShippingAddress = async (req, res, next) => {
  try {
    const { fullName, phone, address, city, state, pinCode } = req.body;

    const user = await User.findById(req.user._id);
    user.shippingAddress = {
      fullName: fullName || user.shippingAddress.fullName,
      phone: phone || user.shippingAddress.phone,
      address: address || user.shippingAddress.address,
      city: city || user.shippingAddress.city,
      state: state || user.shippingAddress.state,
      pinCode: pinCode || user.shippingAddress.pinCode,
    };

    await user.save();

    return successResponse(res, { shippingAddress: user.shippingAddress }, 'Shipping address saved successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Claim daily activity reward / earn more simulation faucet
// @route   POST /api/auth/faucet
exports.earnDailyTokens = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    // Add 250 VEs, 200 SVEs, 1000 Tokens
    user.walletBalances.VEs += 250;
    user.walletBalances.SVEs += 200;
    user.walletBalances.Tokens += 1000;
    await user.save();

    return successResponse(
      res,
      { walletBalances: user.walletBalances },
      'Daily reward earned! +250 VEs, +200 SVEs, +1,000 Tokens added to your wallet.'
    );
  } catch (error) {
    next(error);
  }
};
