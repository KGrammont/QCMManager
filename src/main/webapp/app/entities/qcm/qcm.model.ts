export interface IQcm {
  id?: number;
  subjectContentType?: string | null;
  subject?: string | null;
}

export class Qcm implements IQcm {
  constructor(public id?: number, public subjectContentType?: string | null, public subject?: string | null) {}
}

export function getQcmIdentifier(qcm: IQcm): number | undefined {
  return qcm.id;
}
