import { db, mongooseMode } from '../../app.js';
import File from '../models/fileSchema.js';
import { GridFSBucket } from 'mongodb';

export function uploadFile(archivo, user) {
    return new Promise((resolve, reject) => {
        const bucket = new GridFSBucket(db);
        const stream = bucket.openUploadStream(archivo.originalname);
        stream.on('error', reject);
        stream.on('finish', async () => {
            try {
                let file = undefined;
                
                if (mongooseMode) {
                    file = await File.findOne({ _id: stream.id });
                    file.contentType = file.filename.split('.').pop();
                    file.owner = user;
                    file.sharedWith = [];
                    await file.save();
                } else {
                    file = await db.collection("fs.files").findOne({ _id: stream.id });
                    file.contentType = file.filename.split('.').pop();
                    file.owner = user;
                    file.sharedWith = [];
                    await db.collection("fs.files").updateOne({ _id: stream.id }, { $set: file });
                }
                
                if (!file) {
                    reject(new Error('No se encontró el archivo guardado en MongoDB.'));
                    return;
                }
                resolve(file._id);
            } catch (error) {
                reject(error);
            }
        });
        stream.end(archivo.buffer);
    });
}