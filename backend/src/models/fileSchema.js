import { mongoose } from '../../app.js';

const fileSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    filename: { type: String, required: [true, "El nombre del archivo es obligatorio"], 
        validate: {  
            validator: (value) => {
            return value.trim().length > 0;
            }, message: props => `El nombre del archivo no puede estar vacío`
        }
    },
    contentType: { type: String },
    length: { type: Number, required: true },
    chunkSize: { type: Number, required: true },
    uploadDate: { type: Date, default: Date.now },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: [true, "Es obligatorio que el archivo tenga un dueño asociado"] },
    sharedWith: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
        permissions: [{ type: String, enum: ['view', 'read', 'write'], default: 'view' }], // view es que esté visible pero sin acceder
      }
    ],
});

export default mongoose.model('File', fileSchema, 'fs.files');