import cors from 'cors';
import { body, validationResult } from 'express-validator';

export const mongoValidateFile = [ // TODO
    cors(),
    body('perm').trim().notEmpty().withMessage('El permiso del archivo es obligatorio').isIn(['view', 'read', 'write']).withMessage('El permiso del archivo debe ser view, read o write.'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
        } else {
            next();
        }
    }
];