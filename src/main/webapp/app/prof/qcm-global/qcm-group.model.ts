import * as dayjs from 'dayjs';
import { IClasse } from 'app/entities/classe/classe.model';

export interface ICompleteQcmGroup {
  id?: number;
  name?: string;
  createdAt?: dayjs.Dayjs;
  classe?: IClasse;
  qcms?: string;
}

export class CompleteQcmGroup implements ICompleteQcmGroup {
  constructor(public id?: number, public name?: string, public createdAt?: dayjs.Dayjs, public classe?: IClasse, public qcms?: string) {}
}

export function getQcmGroupIdentifier(qcmGroup: ICompleteQcmGroup): number | undefined {
  return qcmGroup.id;
}
