import { DatePipe } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';

export interface ClientReform {
  name: string,
  address: string,
  phone: string
}

@Component({
  standalone: true,
  imports: [
    DatePipe
  ],
  selector: 'app-ticket-generator',
  templateUrl: './ticket-generator.component.html',
  styleUrls: ['./ticket-generator.component.css']
})
export class TicketGeneratorComponent implements AfterViewInit{

  clientReform: ClientReform;

  ticketType: string

  //Hay que cambiar esta mierda del any
  client: any
  food: string
  time: string
  confirm: boolean

  day: Date = new Date()

  constructor(){
    //Posible tipado
    this.ticketType = history.state.ticketType
    this.client = history.state.client
    this.food = history.state.food
    this.time = history.state.time
    this.confirm = history.state.confirm

    //Revisar, no reescribe, solo iguala
    this.clientReform = this.client

    this.manageTypes()

  }


  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.confirm && this.clientReform.phone) { this.confirmTicket() }
      window.print()
      window.history.back()
    }, 100)
  }

  manageTypes(){
    switch (this.ticketType) {
      case "Menu":
        this.clientReform.name = this.client.name
        this.clientReform.address = this.client.address
        this.clientReform.phone = this.client.phone
      break;

      case "Paella":
        this.clientReform.name = this.client[5]
        this.clientReform.address = this.client[6]
        this.clientReform.phone = this.client[7]
      break

      case "Raciones":
        this.clientReform.name = this.client[5]
        this.clientReform.address = this.client[3]
        this.clientReform.phone = this.client[4]
      break

      case "Menu diario":
        this.clientReform.name = this.client[3]
        this.clientReform.address = this.client[4]
        this.clientReform.phone = this.client[5]
      break

      default:
        break;
    }
  }

  confirmTicket(){
    const cleanedPhone = this.clientReform.phone.replace(/\D/g, '');
    const mensaje = `Hola ${this.clientReform.name}, tu  ${this.ticketType} esta confirmado/a`
    const url = `https://wa.me/${cleanedPhone}?text=${encodeURIComponent(mensaje)}`

    window.open(url, '_blank')
  }
}
