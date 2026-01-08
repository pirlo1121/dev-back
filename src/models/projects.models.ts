import mongoose, { Schema, Document } from "mongoose"

export interface IProject extends Document {
    name: string;
    description?: string;
    image?: string;
    repository?: string;
    stack: string[];
    deploy?: string;
    userId: mongoose.Types.ObjectId;
}

const projectsSchema = new mongoose.Schema<IProject>(
    {
        name: {
            type: String,
            required: [true, 'El nombre del proyecto es obligatorio'],
            trim: true
        },
        description: String,
        image: String, // SUBIR A S3
        repository: String,
        stack: {
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

export const Projects = mongoose.model<IProject>('Project', projectsSchema);

