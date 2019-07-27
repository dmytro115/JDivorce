import { Client } from './../../core/client/client.model';
import { Order } from "./order.model";

export class PrintAppOrder extends Order {
  constructor(client: Client) {
    super()
    const { email, id } = client;
    this.amount = 1000;
    this.description = "Print Application Order";
    this.type = 'PrintOrder';
    this.client_id = id;
    this.email = email;
  }
}