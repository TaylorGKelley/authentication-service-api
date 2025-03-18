import { UUID } from 'crypto';

export default class RefreshTokenPayload {
	public rid: UUID;
	public id: number;

	constructor(payload: { rid: UUID; id: number }) {
		this.rid = payload.rid;
		this.id = payload.id;
	}
}
