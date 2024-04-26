import { Router } from 'express';
import multer from 'multer';
import dotenv from 'dotenv';
import passport from './config/passport.js';
import { registerUser } from './controllers/userController.js';
import { getMyFiles, uploadFile, deleteFile, changePerms, downloadFile, toggleFavorite } from './controllers/fileController.js';
import { mongoValidateUser, isLogged } from './middlewares/userMiddleware.js';
import { mongoValidatePerm } from './middlewares/fileMiddleware.js';
import { mongooseMode, mongooseModeChange } from '../app.js';

dotenv.config();  
const router = new Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/register',  mongoValidateUser, registerUser);

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(404).json({ message: info.message || 'Hubo un error al intentar iniciar sesión'}); 
        }
        if (req.isAuthenticated()) {
            return res.status(401).json({ message: 'Ya existe una sesión activa'});
        }
        req.login(user, (err) => {
            if (err) {
                return next(err); 
            }
            return res.status(200).json({ message: 'Inicio de sesión exitoso' });
        });
    })(req, res, next);
});

router.post('/logout', (req, res) => {
    
    if(!req.isAuthenticated()){
        return res.status(401).json({ message: 'No existe ninguna sesión activa' });
    }
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ message: 'Error durante el proceso de cierre de sesión' });
        }
        return res.status(200).json({ message: 'Deslogueo exitoso' });
    });
});

router.post('/changeMode',  (req, res) => {
    const {mode} = req.body;
    let message = "";
    if (mode === 'mongoose') {
        mongooseModeChange(true);
        message = 'Modo cambiado a Mongoose';
    } else {
        mongooseModeChange(false);
        message = 'Modo cambiado a MongoDB';
    }
    return res.status(200).json({ message: message});
});

router.get('/file', isLogged, async (req, res) => {
    try {
        const files = await getMyFiles(req.user);
        res.json({ success: true, files: files, currentUser: req.user, mode: mongooseMode?'mongoose':'mongoDB'});
    } catch(error) {
        const mode = mongooseMode?'Mongoose':'MongoDB';
        res.status(500).json({ success: false, error: 'Error al obtener los archivos con '+ mode + '. ' + error });
    };
});

router.post('/file',  isLogged, (req, res, next) => {
    next(); 
}, upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, error: 'No se ha enviado ningún archivo' });
    }
    const file = {
      originalname: req.file.originalname,
      buffer: req.file.buffer
    };

    try {
        const fileId = await uploadFile(file, req.user)
        res.json({ success: true, fileId: fileId });
    } catch(error) {
        const mode = mongooseMode?'Mongoose':'MongoDB';
        res.status(500).json({ success: false, error: 'Error al guardar el archivo con '+ mode + '. ' + error });
      };
  });

router.delete('/file', isLogged, async (req, res) => {
    const { id } = req.body;
    try {
        await deleteFile(id, req.user);
        res.json({ success: true });
    } catch(error) {
        const mode = mongooseMode?'Mongoose':'MongoDB';
        res.status(500).json({ success: false, error: 'Error al borrar el archivo con '+ mode + '. ' + error });
      };
});

router.put('/file', isLogged, mongoValidatePerm, async (req, res) => {
    const { fileId, username, perm } = req.body;

    try {
        await changePerms(fileId, username, perm, req.user)
        perm !== "none"?res.json({ success: true, message: 'Permisos del archivo '+ fileId + ' para el usuario '+ username + ' cambiados a '+ perm}):res.json({ success: true, message: 'Eliminados permisos del archivo '+ fileId + ' para el usuario '+ username});
    } catch(error) {
        const mode = mongooseMode?'Mongoose':'MongoDB';
        res.status(500).json({ success: false, error: 'Error al guardar el archivo con '+ mode + '. ' + error });
      };
  });

router.put('/file/like', isLogged, async (req, res) => {
    const { fileId } = req.body;
    try {
        let liked = await toggleFavorite(fileId, req.user)
        liked?res.json({ success: true, message: 'Archivo '+ fileId + ' marcado como favorito'}):res.json({ success: true, message: 'Archivo '+ fileId + ' desmarcado como favorito'});
    } catch(error) {
        const mode = mongooseMode?'Mongoose':'MongoDB';
        console.log(error);
        res.status(500).json({ success: false, error: 'Error al actualizar el archivo con '+ mode + '. ' + error });
      };
});

router.post('/file/download', isLogged, async (req, res) => {
    const { id } = req.body;
    try {
        const downloadStream = await downloadFile(id, req.user);
        res.setHeader('Content-disposition', 'attachment; filename=archivo_descargado');
        res.setHeader('Content-type', 'application/octet-stream');
        downloadStream.pipe(res);
    } catch(error) {
        const mode = mongooseMode?'Mongoose':'MongoDB';
        res.status(500).json({ success: false, error: 'Error al obtener el archivo con '+ mode + '. ' + error });
      };
});

export default router;