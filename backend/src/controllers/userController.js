import { db, mongooseMode } from '../../app.js';
import bcrypt from 'bcrypt';
import User from '../models/userSchema.js';
  
export const registerUser = async (req, res) => {
    
    try {
        const { username, email, password } = req.body;
        const codedPassword = bcrypt.hashSync(password, 10);

        if (!mongooseMode) {
            const usersCollection = db.collection('users');
            await usersCollection.insertOne({ username, email, password: codedPassword });
            return res.status(201).json({ message: 'Usuario registrado exitosamente' });  
        } else {
            const user = new User({ username, email, password });
            try {
                await user.validate();
            } catch (errors) {
                const errorsMessages = [];
                for (let fieldErrors in errors.errors) {
                    errorsMessages.push(errors.errors[fieldErrors].message);
                }
                return res.status(400).json({ message: errorsMessages });
            }
            user.password = codedPassword;
            await user.save();
            return res.status(201).json({ message: 'Usuario registrado exitosamente' });
        }
     } catch (error) {
        return res.status(500).json({ message: 'Error en el servidor:' + error });
    } 
};