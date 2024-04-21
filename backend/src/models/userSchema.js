import { mongoose } from '../../app.js';

const userSchema = new mongoose.Schema({
    username: { type: String, required: [true, "El nombre de usuario es obligatorio"], 
        validate: {  
            validator: (value) => {
            return value.trim().length > 0;
            }, message: props => `El nombre de usuario no puede estar vacío`
        }
    },
    password: { type: String, required: [true, "La contraseña es obligatoria"], minLength: [12, "La contraseña debe tener al menos 12 caracteres"]},     
    email: { type: String, required: [true, "El email es obligatorio"], 
        validate: {
            validator: (value) => {
                return /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(value);
            }, message: props => `${props.value} no es un correo electrónico válido.`
        }
    },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'File', default: [] }],
});

export default mongoose.model('User', userSchema);