import { UUID } from 'node:crypto';

type Role = {
	id: number;
	name: string;
	assignToNewUser: boolean;
	linkedServiceId: UUID;
};

export default Role;
