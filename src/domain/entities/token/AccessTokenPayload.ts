export default class AccessTokenPayload {
  public id: number;

  constructor(payload: { id: number }) {
    this.id = payload.id;
  }
}
