import { Router } from 'express';
import cors from 'cors';
import multer from 'multer';
import dotenv from 'dotenv';
import passport from './config/passport.js';
import { registerUser } from './controllers/userController.js';
import { uploadFile, deleteFile, changePerms } from './controllers/fileController.js';
import { mongoValidateUser, isLogged } from './middlewares/userMiddleware.js';
import { mongooseMode, mongooseModeChange } from '../app.js';

dotenv.config();  
const router = new Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/', (req, res) => {
    res.send('Hello World');
});

router.post('/mongo/register', mongoValidateUser, registerUser); 
router.post('/mongoose/register', registerUser);  

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

router.post('/logout', cors(), (req, res) => {
    
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

router.post('/changeMode', (req, res) => {
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

router.post('/file', isLogged, (req, res, next) => {
    next(); 
}, upload.single('file'), async (req, res) => {
    const archivo = {
      originalname: req.file.originalname,
      buffer: req.file.buffer
    };

    try {
        const fileId = await uploadFile(archivo, req.user)
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

router.put('/file', isLogged, async (req, res) => {
    const { fileId, userId, perm } = req.body;

    try {
        await changePerms(fileId, userId, perm, req.user)
        res.json({ success: true, message: 'Permisos del archivo '+ fileId + ' para el usuario '+ userId + ' cambiados a '+ perm});
    } catch(error) {
        const mode = mongooseMode?'Mongoose':'MongoDB';
        res.status(500).json({ success: false, error: 'Error al guardar el archivo con '+ mode + '. ' + error });
      };
  });

export default router;