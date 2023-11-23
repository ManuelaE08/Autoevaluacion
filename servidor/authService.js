const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class AuthService {
  constructor(userModel, secretKey) {
    this.userModel = userModel;
    this.secretKey = secretKey;
    this.revokedTokens = new Set();
  }

  async getUserByEmail(email) {
    try {
      const user = await this.userModel.findByEmail(email);
      console.log(user);
      if (!user) {
        return null; // Usuario no encontrado
      }

      return user;
    } catch (error) {
      console.error('Error al obtener usuario por correo:', error);
      throw error;
    }
  }

  async comparePasswords(inputPassword, hashedPassword) {
    try {
      const isValid = await bcrypt.compare(inputPassword, hashedPassword);
      return isValid;
    } catch (error) {
      console.error('Error al comparar contraseñas:', error);
      throw error;
    }
  }

  async login(email, password) {
    try {
      const user = await this.getUserByEmail(email);

      if (!user) {
        return null; // Usuario no encontrado
      }

      const isValidPassword = await this.comparePasswords(password, user.USU_CONTRASENIA);

      if (!isValidPassword) {
        return null; // Contraseña incorrecta
      }

      // Generar token JWT
      const token = this.generateToken(user);

      console.log('Token generado:', token);

      user.token = token;

      return user;
    } catch (error) {
      console.error('Error en la autenticación:', error);
      throw error;
    }
  }

  generateToken(user) {
    return jwt.sign(
      { userId: user.USR_IDENTIFICACION, email: user.USU_CORREO, rol: user.ROL_DESCRIPCION },
      this.secretKey,
      { expiresIn: '2m' }
    );
  }

  verifyToken(token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, this.secretKey, (err, decoded) => {
        if (err) {
          reject(err);
        } else {
          resolve(decoded);
        }
      });
    });
  }

  revokeToken(token) {
    this.revokedTokens.add(token);
  }

  checkRole(allowedRoles) {
    return (req, res, next) => {
      const userRole = req.user ? req.user.rol : null;

      if (!userRole || !allowedRoles.includes(userRole)) {
        return res.status(403).json({ message: 'Unauthorized' });
      }

      next();
    };
  }
}

module.exports = AuthService;
