import { Document, Types, model, Schema } from "mongoose";

export interface IRole extends Document {
  name: string;
  description: string;
  permissions?: Types.ObjectId[];
}

const roleSchema = new Schema<IRole>(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    permissions: [{ type: Schema.Types.ObjectId, ref: "Permission" }],
  },
  {
    timestamps: true,
  },
);

const RoleModel = model<IRole>("Role", roleSchema);

export default RoleModel;
