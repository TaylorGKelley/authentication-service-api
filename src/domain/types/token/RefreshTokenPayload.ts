import { UUID } from 'crypto';

export default class RefreshTokenPayload {
  public rid: UUID;
  public id: UUID; // userid

  constructor(payload: { rid: UUID; id: UUID }) {
    this.rid = payload.rid;
    this.id = payload.id;
  }
}
