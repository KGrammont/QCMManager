export interface ICheckbox {
  name: string;
  value: boolean;
}

export class Checkbox implements ICheckbox {
  constructor(public name: string, public value: boolean) {}
}

export interface ICompleteQcmPatch {
  id: number;
  name: string;
  checkboxes: ICheckbox[];
}

export class CompleteQcmPatch implements ICompleteQcmPatch {
  constructor(public id: number, public name: string, public checkboxes: ICheckbox[]) {}
}
