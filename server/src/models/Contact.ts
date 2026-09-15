import { Document, Schema, Types, model } from "mongoose";

export interface IContact extends Document {
  name: string;
  role: string;
  projectId: Types.ObjectId;
  contactInfo?: {
    email?: string;
    phone?: string;
    address?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const contactSchema = new Schema<IContact>(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    contactInfo: {
      email: { type: String, trim: true },
      phone: { type: String, trim: true },
      address: { type: String, trim: true },
    },
  },
  { timestamps: true }
);

export const Contact = model<IContact>("Contact", contactSchema);
