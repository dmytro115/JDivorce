import { Client } from './../../core/client/client.model';
import { Order } from "./order.model";

export class LegalProfessional extends Order {
  constructor(client: Client) {
    super()
    const { email, id } = client;
    this.amount = 40000;
    this.description = "Legal Professional Order";
    this.type = 'LegalProfessional';
    this.client_id = id;
    this.email = email;
  }
}