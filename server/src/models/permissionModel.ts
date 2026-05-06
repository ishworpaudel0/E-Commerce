import { Schema, Document, model, Types } from "mongoose";

export interface IPermission extends Document {
  name: string;
  description: string;
}

const permissionSchema = new Schema<IPermission>(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

const PermissionModel = model<IPermission>("Permission", permissionSchema);

export default PermissionModel;
