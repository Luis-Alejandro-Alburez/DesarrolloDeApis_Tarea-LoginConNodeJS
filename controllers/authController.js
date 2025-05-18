const User = require("../models/User");
const jwt = require("jsonwebtoken");
const ErrorResponse = require("../utils/errorResponse");

// @desc    Registrar usuario
// @route   POST /api/v1/auth/register
// @access  Private (protegido con token)
exports.register = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    // Validaciones básicas
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: "Por favor proporcione nombre, email y contraseña",
      });
    }

    // Crear usuario
    const user = await User.create({
      name,
      email,
      password,
    });

    // Crear token
    const token = user.getSignedJwtToken();

    res.status(201).json({
      success: true,
      token,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        error: "El email ya está en uso",
      });
    }
    res.status(500).json({
      success: false,
      error: "Error en el servidor",
    });
  }
};

// @desc    Login usuario
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  // Validar email y password
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: "Por favor proporcione un email y contraseña",
    });
  }

  try {
    // Verificar usuario
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Credenciales inválidas",
      });
    }

    // Verificar password
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Credenciales inválidas",
      });
    }

    // Crear token
    const token = user.getSignedJwtToken();

    res.status(200).json({
      success: true,
      token,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Error en el servidor",
    });
  }
};

// @desc    Obtener usuario actual
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Error en el servidor",
    });
  }
};
