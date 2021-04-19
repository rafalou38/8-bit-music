import {connect} from '$lib/server/mongoose'
import User from '../../models/user';

export async function create_user(username: string, password: string){
	await connect;

	const newUser = await User.create({username, password})
	return newUser
}
export async function get_user(username: string){
	await connect;

	const newUser = await User.findOne({username}).exec()
	return newUser
}