import { Component } from '@angular/core';

import { User, UserCreationFeedback, UserPlusFeedback } from '../student-management.model';
import { StudentManagementService } from '../service/student-management.service';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { AlertError } from 'app/shared/alert/alert-error.model';

@Component({
  selector: 'jhi-user-mgmt-update',
  templateUrl: './student-management-massivecreate.component.html',
})
export class StudentManagementMassiveCreateComponent {
  isSaving = false;
  public users: UserPlusFeedback[] | null = null;

  constructor(private userService: StudentManagementService, private eventManager: EventManager) {}

  previousState(): void {
    window.history.back();
  }

  save(): void {
    const pureUsers: User[] = this.users!.map(u => u.user);
    this.isSaving = true;
    this.userService.massiveCreate(pureUsers).subscribe(userCreationFeedbacks => this.onSaveFeedback(userCreationFeedbacks));
  }

  download(): void {
    const csv = this.users?.map(u => `${u.user.firstName!};${u.user.lastName!};${u.user.email!};${u.user.pass!}`).join('\r\n');
    const blob = new Blob([csv!], { type: 'text/csv' });

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if ((window.navigator as any).msSaveOrOpenBlob) {
      (window.navigator as any).msSaveOrOpenBlob(blob, 'mots de passe.csv');
      return;
    }

    const source = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = source;
    link.download = 'mots de passe.csv';
    link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
  }

  trackLogin(index: number, item: UserPlusFeedback): string {
    return item.user.login!;
  }

  changeListener(event: any): void {
    const files = event.target.files;
    this.users = null;

    if (files && files.length === 1) {
      const file: File = files.item(0);
      if (file.type !== 'text/csv') {
        this.onUploadError('Type de fichier non supporté, veuillez utiliser un fichier csv.');
      } else {
        const reader: FileReader = new FileReader();
        reader.readAsText(file);
        reader.onload = () => {
          const csv: string = reader.result as string;
          const csvRecordsArray = csv.split(/\r\n|\n/);

          this.users = [];
          let blocked = false;
          for (let i = 0; i < csvRecordsArray.length - 1; i++) {
            if (!blocked) {
              const fieldsArray = csvRecordsArray[i].split(/;/);

              if (fieldsArray.length !== 3) {
                this.users = null;
                this.onUploadError("Le fichier csv doit contenir exactement 3 colonnes, le délimiteur est le caractère ';'.");
                blocked = true;
              } else {
                const firstname = fieldsArray[0];
                const lastname = fieldsArray[1];
                const email = fieldsArray[2];
                const user = new User();
                user.firstName = firstname;
                user.lastName = lastname;
                user.email = email;
                user.login = this.sanitize(firstname + lastname);
                user.pass = this.userService.generateRandomPass();
                user.langKey = 'fr';
                this.users![i] = new UserPlusFeedback(user);
              }
            }
          }
        };
      }
    }
  }

  private sanitize(login: string): string {
    return login
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[^0-9a-zA-Z]/gi, '');
  }

  private onUploadError(message: string): void {
    // this.alertService.addAlert({ type: 'danger', message }, this.alertComponent.alerts);
    this.eventManager.broadcast(new EventWithContent('qcmManagerApp.error', new AlertError(message)));
  }

  private onSaveFeedback(userCreationFeedbacks: UserCreationFeedback[]): void {
    this.users!.forEach(user => {
      const creationFeedback = userCreationFeedbacks.find(u => user.user.email! === u.email)!;
      user.hasBeenCreated = creationFeedback.hasBeenCreated;
      user.reason = creationFeedback.reason;
    });
  }
}
