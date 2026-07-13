const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'Por favor ingrese un nombre'],
    },
    correo: {
      type: String,
      required: [true, 'Por favor ingrese un correo'],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Por favor ingrese un correo válido',
      ],
    },
    contrase\u00f1a: {
      type: String,
      required: [true, 'Por favor ingrese una contraseña'],
      minlength: 6,
    },
    rol: {
      type: String,
      enum: ['administrador', 'cocinero', 'cliente'],
      default: 'cliente',
    },
  },
  {
    timestamps: true,
  }
);

// Encrypt password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('contrase\u00f1a')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.contrase\u00f1a = await bcrypt.hash(this.contrase\u00f1a, salt);
});

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.contrase\u00f1a);
};

module.exports = mongoose.model('User', userSchema);
