import UserSession from "$lib/models/session";
import type { IUser } from "$lib/models/user";
import { v4 as uuidv4 } from "uuid";

export async function createSession(user: IUser) {
	await UserSession.deleteMany({
		username: user.username,
	}).exec();

	const uuid: string = uuidv4();
	await UserSession.create({ username: user.username, uuid });

	return uuid;
}
export async function getSession(uuid: string) {
	return await UserSession.findOne({
		uuid
	}).exec();
}
