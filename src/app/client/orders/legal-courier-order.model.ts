import { Client } from './../../core/client/client.model';
import { Order } from "./order.model";

export class LegalCourier extends Order {
  constructor(client: Client) {
    super()
    const { email, id } = client;
    this.amount = 6900;
    this.description = "Legal Courier Order";
    this.type = 'LegalCourier';
    this.client_id = id;
    this.email = email;
  }
}