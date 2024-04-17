import { Router } from 'express';
import cors from 'cors';
import passport from './config/passport.js';
import { mongoRegisterUser } from './controllers/userController.js';
import { validateUser } from './middlewares/userMiddleware.js';

const router = new Router();

router.get('/', (req, res) => {
    res.send('Hello World');
});

router.post('/register', validateUser, mongoRegisterUser);

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

export default router;