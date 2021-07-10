import { IClasse } from 'app/entities/classe/classe.model';

export interface IQcmGroup {
  id?: number;
  name?: string;
  classe?: IClasse;
}

export class QcmGroup implements IQcmGroup {
  constructor(public id?: number, public name?: string, public classe?: IClasse) {}
}

export function getQcmGroupIdentifier(qcmGroup: IQcmGroup): number | undefined {
  return qcmGroup.id;
}
