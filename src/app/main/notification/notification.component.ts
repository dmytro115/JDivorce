import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Notification, NotificationService } from "../../core";

@Component({
  selector: "app-notification",
  templateUrl: "./notification.component.html",
  styleUrls: ["./notification.component.scss"]
})
export class NotificationComponent implements OnInit {
  @Input()
  notifications: Notification[] = [];
  @Output()
  notificationChangeEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private notificationService: NotificationService) { }

  ngOnInit(): void {
  }

  showInviteAcceptReject(notification) {
    let status = (notification.invite_status == 'INVITED' || notification.invite_status == 'SHARE' || notification.invite_status == 'HIRE');

    return status;
  }

  getInviterDetails(notification) {
    this.notificationService.getDetails(notification.id).subscribe((data: any) => {
      console.log(data);
    });
  }

  readInvite(notification) {
    this.notificationService.readNotification(notification.id).subscribe((data: any) => {
      this.notificationChangeEvent.emit(true);
    });
  }

  acceptInvite(notification) {
    this.notificationService.acceptNotification(notification.id).subscribe((data: any) => {
      this.notificationChangeEvent.emit(true);
      this.notificationService.isUpdateNotification = true;
      this.notificationService.notificationUpdate.next(this.notificationService.isUpdateNotification);
    });
  }

  rejectInvite(notification) {
    this.notificationService.rejectNotification(notification.id).subscribe((data: any) => {
      this.notificationChangeEvent.emit(true);
      this.notificationService.isUpdateNotification = true;
      this.notificationService.notificationUpdate.next(this.notificationService.isUpdateNotification);
    });
  }
}
