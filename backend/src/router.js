import { Router } from 'express';
import { mongoRegisterUser } from './controllers/userController.js';
import { db } from '../app.js';
import { body, validationResult } from 'express-validator';
import passport from 'passport';
import cors from 'cors';

const router = new Router();

router.get('/', (req, res) => {
    res.send('Hello World');
});

const validateUser = [
    cors(),
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
        } else {
            next(); // Seguir con el siguiente middleware
        }
    }
];

router.post('/register', validateUser, mongoRegisterUser);

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) { return next(err); }
        if (!user) { return res.status(401).json({ message: info.message }); }
        req.login(user, (err) => {
            if (err) { return next(err); }
            return res.status(200).json({ message: 'Inicio de sesión exitoso' });
        });
    })(req, res, next);
});

router.post('/logout', (req, res) => {
    req.logout();
    res.status(200).json({ message: 'Deslogueo exitoso' });
});

// router.post('/login', passport.authenticate('local'), (req, res) => {
//     res.status(200);
// });

export default router;