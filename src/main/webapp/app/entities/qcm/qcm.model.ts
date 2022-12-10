import dayjs from 'dayjs/esm';
import { IQcmGroup } from 'app/entities/qcm-group/qcm-group.model';
import { IUser } from 'app/entities/user/user.model';

export interface IQcm {
  id?: number;
  questionContentType?: string;
  question?: string;
  answerContentType?: string | null;
  answer?: string | null;
  completeAnswerContentType?: string | null;
  completeAnswer?: string | null;
  correctionContentType?: string | null;
  correction?: string | null;
  created_at?: dayjs.Dayjs;
  qcmGroup?: IQcmGroup;
  student?: IUser;
}

export class Qcm implements IQcm {
  constructor(
    public id?: number,
    public questionContentType?: string,
    public question?: string,
    public answerContentType?: string | null,
    public answer?: string | null,
    public completeAnswerContentType?: string | null,
    public completeAnswer?: string | null,
    public correctionContentType?: string | null,
    public correction?: string | null,
    public created_at?: dayjs.Dayjs,
    public qcmGroup?: IQcmGroup,
    public student?: IUser
  ) {}
}

export function getQcmIdentifier(qcm: IQcm): number | undefined {
  return qcm.id;
}
