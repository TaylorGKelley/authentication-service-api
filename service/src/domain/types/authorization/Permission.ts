import { UUID } from 'node:crypto';

type Permission = {
	id: number;
	name: string;
	assignToNewRole: boolean;
	linkedServiceId: UUID;
};

export default Permission;
