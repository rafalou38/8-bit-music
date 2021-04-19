import mongoose from "mongoose";

export interface IUser extends mongoose.Document {
  username: string;
  password?: string;
}

export const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const User = mongoose.model<IUser>("User", UserSchema);
export default User;
