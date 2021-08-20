import { IUser } from 'app/entities/user/user.model';

export interface IClasse {
  id?: number;
  name?: string;
  prof?: IUser;
  students?: IUser[] | null;
}

export class Classe implements IClasse {
  constructor(public id?: number, public name?: string, public prof?: IUser, public students?: IUser[] | null) {}
}

export function getClasseIdentifier(classe: IClasse): number | undefined {
  return classe.id;
}

export interface ISelectable {
  isSelected?: boolean;
}

export class SelectableUser implements ISelectable, IUser {
  constructor(public isSelected: boolean, public id?: number, public login?: string, public firstName?: string, public lastName?: string) {}
}
