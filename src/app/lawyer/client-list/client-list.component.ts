import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService, NotificationService } from '../../core';
import { AppCloneComponent } from '../app-clone/app-clone.component';
import { ClientInviteComponent } from '../client-invite/client-invite.component';

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.scss']
})
export class ClientListComponent implements OnInit {
  lawyer: any;
  clients: Array<any> = [];
  selectedFilter = 'All Clients';
  isUpdateNotification: boolean;

  constructor(
    private readonly authService: AuthService,
    private readonly modalService: NgbModal,
    private readonly dialogService: MatDialog,
    private readonly router: Router,
    private readonly notificationService: NotificationService
  ) {
    this.isUpdateNotification = notificationService.isUpdateNotification;
    notificationService.notificationUpdate.subscribe(value => {
      this.isUpdateNotification = value;

      if (this.isUpdateNotification) { this.loadUser(); }
    });
  }

  ngOnInit(): void {
    this.loadUser();
  }

  loadUser(): void {
    this.authService.getLoggedInUser().subscribe((data: any) => {
      this.lawyer = data;
      this.clients = data.lawyers_clients;
    });
  }

  inviteClient() {
    const modalRef = this.dialogService.open(ClientInviteComponent, { width: '450px' });
    modalRef.afterClosed().subscribe(result => {
      this.loadUser();
    }, reason => {
    });
  }

  createApplication() {
    const modalRef = this.modalService.open(AppCloneComponent);
    modalRef.result.then(result => {
      this.loadUser();
    }, reason => {
    });
  }

  cloneClient(client) {
    const modalRef = this.modalService.open(AppCloneComponent);
    modalRef.componentInstance.client = client;
    modalRef.result.then(result => {
      this.loadUser();
    }, reason => {
      console.log('dismissed');
    });
  }

  showViewClientBtn(client) {
    return (!client.disableView && client.accept_status == 'CLIENT_ACCEPTED')
      || client.accept_status == 'SHARED'
      || client.accept_status == 'SHARED_ACCEPTED'
      || client.accept_status == 'LAWYER_ACCEPTED'
      || client.accept_status == 'APPLICATION_CREATED';
  }

  showNotifyInviteClientBtn(client) {
    return !client.disableView
      && client.accept_status == 'APPLICATION_CREATED';
  }

  showCreateApplicationBtn(client) {
    return (!client.disableView && client.accept_status == 'CLIENT_ACCEPTED')
      || client.accept_status == 'SHARED'
      || client.accept_status == 'SHARED_ACCEPTED'
      || client.accept_status == 'LAWYER_ACCEPTED'
      || client.accept_status == 'APPLICATION_CREATED';
  }

  getAcceptStatusClass(client) {
    return client.accept_status == 'CLIENT_ACCEPTED'
      || client.accept_status == 'ACCEPTED'
      || client.accept_status == 'CLIENT_ACCEPTED'
      || client.accept_status == 'LAWYER_ACCEPTED'
      || client.accept_status == 'SHARED_ACCEPTED' ? 'label-success' : 'label-warning';
  }

  notifyClient(client) {
    const modalRef = this.dialogService.open(ClientInviteComponent);
    modalRef.componentInstance.email = client.client_email;
    modalRef.componentInstance.notify = true;
    modalRef.afterClosed().subscribe(result => {
      this.loadUser();
    }, reason => {
      console.log('dismissed');
    });
  }

  filterClients(data: any, name: string) {
    if (name === 'All Clients') {
      this.clients = this.lawyer.lawyers_clients;
    } else {
      const client_ids = data.map(client => client.id);
      this.clients = this.lawyer.lawyers_clients.filter(client =>
        client_ids.includes(client.client_id));
    }
    this.selectedFilter = name;
  }

  viewClient(clientId, clientEmail) {
    this.authService.setViewClientDetails(clientId, clientEmail);
    this.router.navigate(['/a/l/clients/' + clientId]);
  }
}
