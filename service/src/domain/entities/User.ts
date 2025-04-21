import Role from '../types/authorization/Role';

export class User {
	public id?: number;
	public googleId?: string;
	public githubId?: string;
	public email?: string;
	public roles?: Role[];
	public emailVerified?: boolean;
	public accountActive?: boolean;
	public lastLoginAt?: Date;
	public createdAt?: Date;
	public updatedAt?: Date;

	constructor(user: Partial<User>) {
		Object.assign(this, user);
	}
}

export class UserWithPassword extends User {
	public password?: string;

	constructor(user: Partial<UserWithPassword>) {
		super(user as User);
		Object.assign(this, user);
	}
}

export class UserWithProfile extends User {
	firstName?: string;
	lastName?: string;
	phoneNumber?: string;
	profileImage?: string;

	constructor(
		user: Partial<UserWithPassword>,
		profileInfo: Partial<UserWithProfile>
	) {
		super(user);
		Object.assign(this, { ...user, ...profileInfo });
	}
}
