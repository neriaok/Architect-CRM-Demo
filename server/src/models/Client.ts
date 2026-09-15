import { Document, Schema, model } from "mongoose";

export interface IClient extends Document {
  name: string;
  contactInfo: {
    email?: string;
    phone?: string;
    address?: string;
  };
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const clientSchema = new Schema<IClient>(
  {
    name: { type: String, required: true, trim: true },
    contactInfo: {
      email: { type: String, trim: true },
      phone: { type: String, trim: true },
      address: { type: String, trim: true },
    },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

export const Client = model<IClient>("Client", clientSchema);
