const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AuthService = require('./authService');
const Usuario = require('./models/Usuario');

const router = express.Router();
const secretKey = process.env.SECRET_KEY || 'defaultSecret';
const authService = new AuthService(Usuario, secretKey);

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log('Credenciales recibidas:', { email, password });

    const user = await authService.getUserByEmail(email);

    if (user) {
      const isValidPassword = await authService.comparePasswords(password, user.USU_CONTRASENIA);

      if (isValidPassword) {
        const token = jwt.sign(
          { userId: user.USR_IDENTIFICACION, email: user.USU_CORREO, rol: user.ROL_DESCRIPCION },
          secretKey,
          { expiresIn: '2m' }
        );

        console.log('Loged:', { email });

        res.json({ token });
      } else {
        res.status(401).json({ message: 'Contraseña incorrecta' });
      }
    } else {
      res.status(401).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error('Error en la autenticación:', error);
    res.status(500).json({ message: 'Error en la autenticación' });
  }
});

router.post('/logout', (req, res) => {
  const token = req.headers['authorization'];
  authService.revokeToken(token);
  res.json({ message: 'Logout exitoso' });
});

module.exports = router;
