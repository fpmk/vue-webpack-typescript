export class TableColumn {

  private _id: string;
  private _title: string;
  private _visible: boolean;

  constructor(id: string, title: string, visible: boolean) {
    this._id = id;
    this._title = title;
    this._visible = visible;
  }

  get title(): string {
    return this._title;
  }

  set title(value: string) {
    this._title = value;
  }

  get visible(): boolean {
    return this._visible;
  }

  set visible(value: boolean) {
    this._visible = value;
  }

  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }
}
