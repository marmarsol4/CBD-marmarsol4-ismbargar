import { db, mongooseMode } from '../../app.js';
import File from '../models/fileSchema.js';
import { GridFSBucket, ObjectId } from 'mongodb';


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
                    try {
                        await file.validate();
                    } catch (errors) {
                        const errorsMessages = [];
                        for (let fieldErrors in errors.errors) {
                            errorsMessages.push(errors.errors[fieldErrors].message);
                        }
                        reject(errorsMessages);
                    }
                    await file.save();
                } else {
                    file = await db.collection("fs.files").findOne({ _id: stream.id });
                    file.contentType = file.filename.split('.').pop();
                    file.owner = user._id;
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

export function deleteFile(fileId, user) {
    return new Promise(async (resolve, reject) => {
        try {
            let file = undefined;
            
            if (mongooseMode) {
                file = await File.findOne({ _id: fileId });
                if (!file) {
                    reject(new Error('No se encontró el archivo guardado en MongoDB.'));
                    return;
                }
                console.log(file.sharedWith[0].user, user._id)
                const shared = file.sharedWith.filter(x => x.user.equals(user._id));
                console.log(shared)
                if (file.owner.equals(user._id) || shared.length > 0 && shared[0].perm=='write') {
                    await File.deleteOne({ _id: file._id });
                } else {
                    reject(new Error('No tiene permisos para eliminar el archivo')); 
                }
            
            } else {
                file = await db.collection("fs.files").findOne({ _id: ObjectId.createFromHexString(fileId) });
                if (!file) {
                    reject(new Error('No se encontró el archivo guardado en MongoDB.'));
                    return;
                }
                const shared = file.sharedWith.filter(x => x.user == user)
                console.log(file.owner, user)
                if (file.owner.equals(user._id) || shared.length > 0 && shared[0].perm=='write') {
                    await db.collection("fs.files").deleteOne({ _id: ObjectId.createFromHexString(fileId) });
                } else {
                    reject(new Error('No tiene permisos para eliminar el archivo')); 
                }
            }
            resolve();
        } catch (error) {
            reject(error);
        }
    });
}

export function changePerms(fileId, userId, perm, user) {
    return new Promise(async (resolve, reject) => {
        try {
            let file = undefined;
            
            if (mongooseMode) {
                file = await File.findOne({ _id: fileId });
                if (!file) {
                    reject(new Error('No se encontró el archivo guardado en MongoDB'));
                    return;
                }
                if (file.owner.equals(user._id)) {
                    const shared = file.sharedWith.filter(x => x.user != userId);
                    shared.push({ user: userId, perm: perm });
                    file.sharedWith=shared;
                    console.log(file.sharedWith)
                    await file.save();
                } else {
                    reject(new Error('No tiene permisos para cambiar los permisos del archivo')); 
                }
            
            } else {
                file = await db.collection("fs.files").findOne({ _id: ObjectId.createFromHexString(fileId) });
                if (!file) {
                    reject(new Error('No se encontró el archivo guardado en MongoDB'));
                    return;
                }
                if (file.owner.equals(user._id)) {
                    const shared = file.sharedWith.filter(x => x.user != userId);
                    shared.push({ user: userId, perm: perm });
                    file.sharedWith=shared;
                    await db.collection("fs.files").updateOne({ _id: ObjectId.createFromHexString(fileId) }, { $set: file });
                } else {
                    reject(new Error('No tiene permisos para cambiar los permisos del archivo')); 
                }
            }
            resolve();
        } catch (error) {
            reject(error);
        }
    });
}

export function downloadFile(fileId) {
    return new Promise(async (resolve, reject) => {
        try {
            let file = undefined;
            if (mongooseMode) {
                file = await File.findOne({ _id: fileId });
            } else {
                file = await db.collection("fs.files").findOne({ _id: ObjectId.createFromHexString(fileId) });
            }
            if (!file) {
                reject(new Error('No se encontró el archivo guardado en MongoDB'));
                return;
            }
            if (user && user._id && (file.owner.equals(user._id) || (shared.length > 0 && shared[0].perm == 'write'))) {
                const bucket = new GridFSBucket(db);
                const downloadStream = bucket.openDownloadStream(fileId);
                resolve(downloadStream);
            } else {
                reject(new Error('No tiene permisos para descargar el archivo'));
            }
        } catch (error) {
            reject(error);
        }
    });
}

