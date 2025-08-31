import mongoose, { Schema } from "mongoose"

const projectsSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'El nombre del proyecto es obligatorio'],
            trim: true
        },
        description: String,
        repository: String,
        stack:{
            type: [String],
            required: [true, 'El stack es obligatorio']
        },
        deploy: String,
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    }
);

export const Projects = mongoose.model('Project', projectsSchema);