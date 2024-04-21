import cors from 'cors';
import { body, validationResult } from 'express-validator';
import { db } from '../../app.js';

export const mongoValidateFile = [
    cors(),
    body('filename').trim().notEmpty().withMessage('El nombre del archivo es obligatorio.'),
    body('owner').trim().notEmpty().withMessage('El propietario del archivo es obligatorio.').custom(async (value) => {
        const usersCollection = db.collection('users');
        const existingUser = await usersCollection.findOne({ username: value });
        if (!existingUser) {
            return Promise.reject('Este usuario no existe y no puede ser propietario de un archivo.');
        }
    }),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
        } else {
            next();
        }
    }
];

