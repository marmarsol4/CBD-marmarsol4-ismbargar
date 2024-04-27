import { ObjectId } from 'mongodb';
import { body, validationResult } from 'express-validator';
import { db } from '../../app.js';
import { mongooseMode } from '../../app.js';

export const mongoValidatePerm = [
    body('username').trim().notEmpty().withMessage('El nombre de usuario es obligatorio').custom(async (value) => {
        if (value.trim() !== '') { 
            const user = await db.collection('users').findOne({ username: value});
            if (!user) {
                return Promise.reject('El usuario no existe');
            }
        }
    }),
    body('fileId').custom(async (value) => {
        const file = await db.collection("fs.files").findOne({ _id: ObjectId.createFromHexString(value)});
        if (!file) {
            return Promise.reject('El archivo no existe');
        }
    }),
    body('perm').trim().notEmpty().withMessage('El permiso del archivo es obligatorio').isIn(['none','view', 'read', 'write']).withMessage('El permiso del archivo debe ser view, read o write, o none para eliminar el permiso'),
    (req, res, next) => {
        if (!mongooseMode) {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
            } else {
                next();
            }
        } else {
            next();
        }
    }
];