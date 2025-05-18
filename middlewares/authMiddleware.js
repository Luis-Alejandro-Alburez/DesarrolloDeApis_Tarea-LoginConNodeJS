const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Proteger rutas
exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: "No autorizado para acceder a esta ruta",
    });
  }

  try {
    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select("-password");

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: "No autorizado para acceder a esta ruta",
    });
  }
};

// Autorizar por roles (opcional)
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `El rol ${req.user.role} no tiene acceso a esta ruta`,
      });
    }
    next();
  };
};
