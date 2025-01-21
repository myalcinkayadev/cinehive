export abstract class Entity {
  private _id: string;

  constructor(id: string) {
    this._id = id;
  }

  public get id(): string {
    return this._id;
  }

  protected set id(value: string) {
    this._id = value;
  }
}
