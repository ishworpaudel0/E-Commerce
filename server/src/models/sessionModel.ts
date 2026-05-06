import { Schema, Document, model, Types } from "mongoose";

export interface ISession extends Document {
  userId: Types.ObjectId;
  refreshToken: string;
  expiresAt: Date;
}

const sessionSchema = new Schema<ISession>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    refreshToken: { type: String, required: true },
    expiresAt: { type: Date, required: true },
  },
  {
    timestamps: true,
  },
);

const SessionModel = model<ISession>("Session", sessionSchema);
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default SessionModel;
