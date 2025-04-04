type User = {
  id?: number;
  googleId?: string;
  githubId?: string;
  email?: string;
  emailVerified?: boolean;
  // roles?: Role[];
  accountActive?: boolean;
  lastLoginAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  profileImage?: string;
};

// type Role = {
//   id: number;
//   permissionLevel: string;
// };

export default User;
