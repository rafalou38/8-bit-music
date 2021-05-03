import mongoose from 'mongoose';

export interface IUserSession extends mongoose.Document {
	username: string;

	uuid: string;
}

export const UserSchema = new mongoose.Schema(
	{
		username: String,
		uuid: String
	},
	{ timestamps: true }
);

UserSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 7 });

const UserSession = mongoose.models.Session || mongoose.model<IUserSession>('Session', UserSchema);
export default UserSession;
