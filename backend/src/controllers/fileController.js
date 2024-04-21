import { db, mongooseMode } from '../../app.js';
import File from '../models/fileSchema.js';
import { GridFSBucket } from 'mongodb';

export function guardarArchivoEnMongoDB(archivo, user) {
    return new Promise((resolve, reject) => {
        const bucket = new GridFSBucket(db);
        const stream = bucket.openUploadStream(archivo.originalname);
        stream.on('error', reject);
        stream.on('finish', async () => {
            try {
                let file = await File.findOne({ _id: stream.id });
                if (!file) {
                    reject(new Error('No se encontró el archivo guardado en MongoDB.'));
                    return;
                }
                file.contentType = file.filename.split('.').pop();
                file.owner = user;
                file.sharedWith = [];
                await file.save();
                resolve(file._id);
            } catch (error) {
                reject(error);
            }
        });
        stream.end(archivo.buffer);
    });
}


export const mongoUploadFile = async (req, res) => {
    try {
        const fileId = req.file.id;
        if (!fileId) {
            return res.status(400).send('Por favor, suba un archivo');
        }
        const file = undefined;
        File.findOne({ _id: fileId }).then((foundFile) => {
            file=foundFile;
        });
        if (!file) {
            return res.status(400).send('Error subiendo el archivo');
        }
        file.owner = req.user;
        file.sharedWith = [];
        console.log(file);
        file.save(file);
        res.json({ file: req.file });
        
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}