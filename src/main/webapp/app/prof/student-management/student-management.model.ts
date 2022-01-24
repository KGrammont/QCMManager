export interface IUser {
  id?: number;
  login?: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string;
  pass?: string;
  activated?: boolean;
  langKey?: string;
  authorities?: string[];
  createdBy?: string;
  createdDate?: Date;
  lastModifiedBy?: string;
  lastModifiedDate?: Date;
}

export class User implements IUser {
  constructor(
    public id?: number,
    public login?: string,
    public firstName?: string | null,
    public lastName?: string | null,
    public email?: string,
    public pass?: string,
    public activated?: boolean,
    public langKey?: string,
    public authorities?: string[],
    public createdBy?: string,
    public createdDate?: Date,
    public lastModifiedBy?: string,
    public lastModifiedDate?: Date
  ) {}
}

export interface IUserCreationFeedback {
  email: string;
  hasBeenCreated: boolean;
  reason: string;
}

export class UserCreationFeedback implements IUserCreationFeedback {
  constructor(public email: string, public hasBeenCreated: boolean, public reason: string) {}
}

export interface IUserPlusFeedback {
  user: User;
  hasBeenCreated?: boolean;
  reason?: string;
}

export class UserPlusFeedback implements IUserPlusFeedback {
  constructor(public user: User, public hasBeenCreated?: boolean, public reason?: string) {}
}

export class SelectableUser implements IUser {
  constructor(public isSelected: boolean, public id?: number, public login?: string, public firstName?: string, public lastName?: string) {}
}
