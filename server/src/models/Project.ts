import { Document, Schema, Types, model } from "mongoose";
import { PROJECT_STAGES, ProjectStage } from "./projectStages";

export interface IProject extends Document {
  title: string;
  clientId: Types.ObjectId;
  stage: ProjectStage;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true, trim: true },
    clientId: { type: Schema.Types.ObjectId, ref: "Client", required: true },
    stage: {
      type: String,
      enum: PROJECT_STAGES,
      default: "inquiry",
      required: true,
    },
  },
  { timestamps: true }
);

export const Project = model<IProject>("Project", projectSchema);
