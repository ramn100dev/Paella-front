import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-ticket-generator',
  templateUrl: './ticket-generator.component.html',
  styleUrls: ['./ticket-generator.component.css']
})
export class TicketGeneratorComponent {

  client: any
  food: any

  constructor(private route: ActivatedRoute){
    this.client = history.state.client
    this.food = history.state.food
  }


}
