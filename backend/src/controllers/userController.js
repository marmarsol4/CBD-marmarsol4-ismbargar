import { body, validationResult } from 'express-validator';
import { db } from '../../app.js';
import User from '../models/userModel.js';
  
export const mongoRegisterUser = async (req, res) => {
    
    try {
        await validateUser(req, res);
        const usersCollection = db.collection('users');
        const { username, email, password } = req.body;
        await usersCollection.insertOne({ username, email, password });
        return res.status(201).json({ message: 'Usuario registrado exitosamente.' });
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor.' });
    }    
};

export const mongooseRegisterUser = async (req, res) => {
    try {
        await validateUser(req, res);
        
        const { username, email, password } = req.body;
        const newUser = new User({ username, email, password });
        await newUser.save();
        return res.status(201).json({ message: 'Usuario registrado exitosamente.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor.' });
    }
};

const validateUser = () => [

    body('username').trim().notEmpty().withMessage('El nombre de usuario es obligatorio.').custom(async (value) => {
        const usersCollection = db.collection('users');
        const existingUser = await usersCollection.findOne({ username: value });
        if (existingUser) {
            return Promise.reject('El nombre de usuario ya está en uso.');
        }
    }),

    body('email').trim().notEmpty().isEmail().withMessage('El correo electrónico no es válido.').custom(async (value) => {
        const usersCollection = db.collection('users');
        const existingMail = await usersCollection.findOne({ email: value });
        if (existingMail) {
            return Promise.reject('El correo electrónico ya está en uso.');
        }
    }),

    body('password').trim().notEmpty().isLength({ min: 12 }).withMessage('La contraseña debe tener al menos 12 caracteres.'),
    
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
        }
        next(); // Si no errores, seguir con el siguiente middleware
    }
];