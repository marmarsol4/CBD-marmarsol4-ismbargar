import { GridFSBucket, ObjectId } from 'mongodb';
import { db, mongooseMode } from '../../app.js';
import File from '../models/fileSchema.js';
import User from '../models/userSchema.js';

export function getMyFiles(user) {
    return new Promise(async (resolve, reject) => {
        try {
            let files = undefined;
            if (mongooseMode) {
                files = await File.find({ $or: [{ owner: user._id }, { 'sharedWith.user': user._id }] }).populate('owner').populate('sharedWith.user');
            } else {
                files = await db.collection("fs.files").find({ $or: [{ owner: user._id }, { 'sharedWith.user': user._id }] }).toArray();
                files = await Promise.all(files.map(async file => {
                    file.owner = await db.collection('users').findOne({ _id: file.owner });
                    file.sharedWith = await Promise.all(file.sharedWith.map(async x => {
                        x.user = await db.collection('users').findOne({ _id: x.user });
                        return x;
                    }));
                    return file;
                }));
            }
            resolve(files);
        } catch (error) {
            reject(error);
        }
    });
}

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
                    reject(new Error('No se encontró el archivo guardado en MongoDB'));
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
                    reject(new Error('No se encontró el archivo guardado en MongoDB'));
                    return;
                }
                const perm = file.sharedWith.some(x =>x.user == user._id && x.perm=='write');
                if (perm || file.owner.equals(user._id)) {
                    await File.deleteOne({ _id: file._id });
                } else {
                    reject(new Error('No tiene permisos para eliminar el archivo')); 
                }
            
            } else {
                file = await db.collection("fs.files").findOne({ _id: ObjectId.createFromHexString(fileId) });
                if (!file) {
                    reject(new Error('No se encontró el archivo guardado en MongoDB'));
                    return;
                }
                const perm = file.sharedWith.some(x =>x.user == user._id && x.perm=='write');
                if (perm || file.owner.equals(user._id)) {
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

export function changePerms(fileId, username, perm, reqUser) {
    return new Promise(async (resolve, reject) => {
        try {
            let file = undefined;
            
            if (mongooseMode) {
                file = await File.findOne({ _id: fileId });
                if (!file) {
                    reject(new Error('No se encontró el archivo guardado en MongoDB'));
                    return;
                }
                if (file.owner.equals(reqUser._id)) {
                    const user = await User.findOne({username: username});
                    if (!user) {
                        reject(new Error('El usuario no existe'));
                        return;
                    }
                    const shared = file.sharedWith.filter(x => !x.user.equals(user._id));
                    if (perm != 'none'){
                        shared.push({ user: user._id, perm: perm });
                    }
                    file.sharedWith=shared;
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
                if (file.owner.equals(reqUser._id)) {
                    const userId = await db.collection('users').findOne({username: username}).then(x=>x._id);
                    if (!userId) {
                        reject(new Error('El usuario no existe'));
                        return;
                    }
                    const shared = file.sharedWith.filter(x => !x.user.equals(userId));
                    if (perm != 'none'){
                        shared.push({ user: userId, perm: perm });
                    }
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

export function downloadFile(fileId, user) {
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
            const perm = file.sharedWith.some(x => x.user.equals(user._id) && (x.perm=='write' || x.perm=='read'));
            if (user && user._id && (file.owner.equals(user._id) || perm)) {
                const bucket = new GridFSBucket(db);
                const downloadStream = bucket.openDownloadStream(ObjectId.createFromHexString(fileId));
                resolve(downloadStream);
            } else {
                reject(new Error('No tiene permisos para descargar el archivo'));
            }
        } catch (error) {
            reject(error);
        }
    });
}

export function toggleFavorite(fileId, user) {
    return new Promise(async (resolve, reject) => {
        try {
            let liked = undefined;
            let file = undefined;
            let dbUser = undefined;
            if (mongooseMode) {
                file = await File.findOne({ _id: fileId });
                dbUser = await User.findOne({ _id: user._id }); 
            } else {
                file = await db.collection("fs.files").findOne({ _id: ObjectId.createFromHexString(fileId) });
                dbUser = await db.collection('users').findOne({ _id: user._id }); 
            }

            if (!file) {
                reject(new Error('No se encontró el archivo guardado en MongoDB'));
                return;
            }

            if (dbUser.favorites.includes(fileId)) {
                dbUser.favorites = dbUser.favorites.filter(x => x != fileId);
                liked = false;
            } else {
                dbUser.favorites.push(fileId);
                liked = true;
            }
            
            if (mongooseMode) {
                await User.updateOne({ _id: user._id }, dbUser);
            } else {
                await db.collection('users').updateOne({ _id: dbUser._id }, { $set: dbUser });
            }
            resolve(liked);
            
        } catch (error) {
            reject(error);
        }
    });
};