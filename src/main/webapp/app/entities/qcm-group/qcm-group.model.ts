import * as dayjs from 'dayjs';
import { IClasse } from 'app/entities/classe/classe.model';

export interface IQcmGroup {
  id?: number;
  name?: string;
  createdAt?: dayjs.Dayjs;
  classe?: IClasse;
}

export class QcmGroup implements IQcmGroup {
  constructor(public id?: number, public name?: string, public createdAt?: dayjs.Dayjs, public classe?: IClasse) {}
}

export function getQcmGroupIdentifier(qcmGroup: IQcmGroup): number | undefined {
  return qcmGroup.id;
}
