const bcrypt = require('bcrypt');
const saltRounds = 10;

// Contrase�a a hashear
const password = '12345678';

// Generar el hash
bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error('Error al generar el hash:', err);
  } else {
    console.log('Contrase�a original:', password);
    console.log('Contrase�a hashada:', hash);
  }
});
