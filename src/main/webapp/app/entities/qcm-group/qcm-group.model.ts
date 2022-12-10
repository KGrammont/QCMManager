import dayjs from 'dayjs/esm';
import { IClasse } from 'app/entities/classe/classe.model';

export interface IQcmGroup {
  id?: number;
  name?: string;
  created_at?: dayjs.Dayjs;
  classe?: IClasse;
}

export class QcmGroup implements IQcmGroup {
  constructor(public id?: number, public name?: string, public created_at?: dayjs.Dayjs, public classe?: IClasse) {}
}

export function getQcmGroupIdentifier(qcmGroup: IQcmGroup): number | undefined {
  return qcmGroup.id;
}
