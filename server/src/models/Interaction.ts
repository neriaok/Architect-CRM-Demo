import { Document, Schema, Types, model } from "mongoose";

export interface IInteraction extends Document {
  projectId: Types.ObjectId;
  date: Date;
  rawText: string;
  summary: string;
  suggestedFollowUp: string;
  createdAt: Date;
  updatedAt: Date;
}

const interactionSchema = new Schema<IInteraction>(
  {
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    date: { type: Date, default: Date.now, required: true },
    rawText: { type: String, required: true, trim: true },
    summary: { type: String, required: true },
    suggestedFollowUp: { type: String, required: true },
  },
  { timestamps: true }
);

export const Interaction = model<IInteraction>("Interaction", interactionSchema);
