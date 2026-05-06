import { Schema, model, Document, Types } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  roles?: Types.ObjectId[];
}
const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    roles: [{ type: Schema.Types.ObjectId, ref: "Role" }],
  },
  {
    timestamps: true,
  },
);

const UserModel = model<IUser>("User", userSchema);

export default UserModel;
