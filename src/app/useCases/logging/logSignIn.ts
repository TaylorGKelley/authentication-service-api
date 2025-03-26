import { UserWithPassword } from '@/domain/entities/User';

export default function logSignIn(
	username: string,
	user: UserWithPassword | null
) {
	if (user) {
		console.log('User logged in');
	} else {
		console.log('Login failed');
	}
	// Add logging to Database when a user logs in
}
