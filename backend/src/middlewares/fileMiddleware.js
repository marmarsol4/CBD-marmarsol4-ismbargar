import cors from 'cors';
import { ObjectId } from 'mongodb';
import { body, validationResult } from 'express-validator';
import { db } from '../../app.js';

export const mongoValidatePerm = [
    cors(),
    body('userId').custom(async (value) => {
        const user = await db.collection('users').findOne({ _id: ObjectId.createFromHexString(value)});
        if (!user) {
            return Promise.reject('El usuario no existe');
        }
    }),
    body('fileId').custom(async (value) => {
        const file = await db.collection("fs.files").findOne({ _id: ObjectId.createFromHexString(value)});
        if (!file) {
            return Promise.reject('El archivo no existe');
        }
    }),
    body('perm').trim().notEmpty().withMessage('El permiso del archivo es obligatorio').isIn(['view', 'read', 'write']).withMessage('El permiso del archivo debe ser view, read o write'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
        } else {
            next();
        }
    }
];