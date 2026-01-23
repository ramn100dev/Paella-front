import { HistoryItem } from './../models/HistoryItem';
import { map } from 'rxjs';
import { Component, Renderer2 } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormsServiceService } from '../service/forms-service.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forms-tickets',
  templateUrl: './forms-tickets.component.html',
  styleUrls: ['./forms-tickets.component.css']
})
export class FormsTicketsComponent {

  isNaN(arg0: any) {
    throw new Error('Method not implemented.');
  }
  Number(arg0: any): any {
    throw new Error('Method not implemented.');
  }

  headerRaciones: string[] = []
  raciones: any[][] = []
  filteredRaciones: Array<{ [key: string]: number }> = []
  diarios: any[][] = []
  paellas: any[][] = []

  historyList: HistoryItem[] = []
  historyItems: any

  historyMode = false

  constructor(private dialogRef: MatDialogRef<FormsTicketsComponent>, private renderer: Renderer2, private service: FormsServiceService, private router: Router) {

    const storedHistory = localStorage.getItem('ticketHistory')
    console.log(this.historyList)

    if(storedHistory){
      this.historyList = JSON.parse(storedHistory)
    } else {
      this.historyList = []
    }


    this.service.getForm('Paella_Form').subscribe(data => {
      this.paellas = data.slice(1)
    })
  }

  onTabChange(event: MatTabChangeEvent): void {
    switch (event.index) {
      case 1:
        if (this.raciones.length == 0) {
          this.service.getForm('Raciones_Form').subscribe(data => {
            console.log(data)
            this.headerRaciones = data[0]
            this.raciones = data.slice(1)

            //console.log(this.raciones)

            this.filteredRaciones = this.raciones.map(fila => {
              const pedido: { [key: string]: number } = {}

              fila.forEach((cantidadStr, i) => {
                const nombreCompleto = this.headerRaciones[i]
                const cantidad = parseInt(cantidadStr) || 0

                if (nombreCompleto.includes('hielo')) {
                  pedido['Hielo'] = cantidad
                }

                if (nombreCompleto.includes('barras de pan')) {
                  pedido['Barras de pan'] = cantidad
                }

                if (cantidad > 0 && nombreCompleto.includes('[')) {
                  const match = nombreCompleto.match(/\[(.*?)\]/);

                  if (match && match[1]) {
                    const nombreComida = match[1]

                    pedido[nombreComida] = cantidad
                  }
                }
              })
              return pedido
            })

            console.log(this.filteredRaciones)
          })
        }
        break

      case 2:
        if (this.diarios.length == 0) {
          this.service.getForm('Menu_Form').subscribe(data => {
            let diariosUnfiltered = data.slice(1)
            this.diarios = diariosUnfiltered.map((subArray: any[]) => subArray.filter((element: string) => element !== ""))
            console.log(this.diarios)

            if (this.diarios[9]) {
              let check = this.Number(this.diarios[9])
              console.log(!isNaN(check))
            }
          })
        }
        break
    }
  }

  selectFormTicket(type: string, form: any, index: number) {

    let historyItem: HistoryItem

    switch (type) {
      case 'Paella':

        this.router.navigate(['/ticket', form[0]], { state: { client: form, food: form[1] + " para " + form[2] + " personas", time: form[4].replace(/:\d{2}(?=\s[AP]M)/, "") + " Para el " + form[3], ticketType: type, confirm: true } })

        historyItem = {
          type: type,
          name: form[5],
          address: form[6],
          phone: form[7],
          time: form[4].replace(/:\d{2}(?=\s[AP]M)/, "") + " Para el " + form[3],
          data: {
            food: form[1],
            people: form[2]
          }
        }

        this.service.deleteRow("Paella_Form", index + 1).subscribe()
        break;

      case 'Raciones':
        const pedido = this.filteredRaciones[index]

        const food = Object.keys(pedido).map(key => `-${key}: ${pedido[key]}`).join('<br>')

        this.router.navigate(['/ticket', form[0]], { state: { client: form, food: food, time: form[1].replace(/:\d{2}(?=\s[AP]M)/, "") + " Para el " + form[2], ticketType: type, confirm: true } })

        historyItem = {
          type: type,
          name: form[5],
          address: form[3],
          phone: form[4],
          time: form[1].replace(/:\d{2}(?=\s[AP]M)/, "") + " Para el " + form[2],
          data: {
            food: food
          }
        }

        this.service.deleteRow("Raciones_Form", index + 1).subscribe()
        break;

      case 'Menu diario':
        let repeticiones = null
        let bebida = ''
        let numeric = this.isNumeric(form[9])

        if (numeric) {
          repeticiones = form[9]
        } else {
          bebida = form[9]
        }

        if (form[10]) {
          repeticiones = form[10];
        }

        if (form[9] && !numeric) {
          this.router.navigate(['/ticket', form[0]], { state: { client: form, food: `Primero: ${form[6]}<br>Segundo: ${form[7]}<br>Postre: ${form[8]}<br>Bebida: ${form[9]}`, time: form[2].replace(/:\d{2}(?=\s[AP]M)/, "") + " Para el " + form[1], ticketType: type, confirm: true } })
          historyItem = {
            type: type,
            name: form[3],
            address: form[4],
            phone: form[5],
            time: form[2].replace(/:\d{2}(?=\s[AP]M)/, "") + " Para el " + form[1],
            data: {
              food: `Primero: ${form[6]}<br>Segundo: ${form[7]}<br>Postre: ${form[8]}<br>Bebida: ${bebida}`,
              repetir: repeticiones
            }
          }
        } else {
          this.router.navigate(['/ticket', form[0]], { state: { client: form, food: `Primero: ${form[6]}<br>Segundo: ${form[7]}<br>Postre: ${form[8]}`, time: form[2].replace(/:\d{2}(?=\s[AP]M)/, "") + " Para el " + form[1], ticketType: type, confirm: true } })

          historyItem = {
            type: type,
            name: form[3],
            address: form[4],
            phone: form[5],
            time: form[2].replace(/:\d{2}(?=\s[AP]M)/, "") + " Para el " + form[1],
            data: {
              food: `Primero: ${form[6]}<br>Segundo: ${form[7]}<br>Postre: ${form[8]}`,
              repetir: repeticiones
            }
          }
        }

        this.service.deleteRow("Menu_Form", index + 1).subscribe()
        break;

      default:
        return;
    }

    this.historyList.unshift(historyItem)
    localStorage.setItem('ticketHistory', JSON.stringify(this.historyList))

    this.dialogRef.close()
  }

  reprint(form: any){
    let mockClientArray = [];

    switch(form.type){
      case 'Paella':
        mockClientArray[5] = form.name
        mockClientArray[6] = form.address
        mockClientArray[7] = form.phone
        break

      case 'Raciones':
        mockClientArray[5] = form.name
        mockClientArray[3] = form.address
        mockClientArray[4] = form.phone
        break

      case 'Menu diario':
        mockClientArray[3] = form.name
        mockClientArray[4] = form.address
        mockClientArray[5] = form.phone
        break;
    }

    this.router.navigate(['/ticket', 'PaellaReprint'], { state: { client: mockClientArray, food: form.data.food, time: form.time, ticketType: form.type, confirm: true } })

    this.dialogRef.close()
  }

  deleteHistory(){
    const res = window.confirm("¿Quieres eliminar todo el historial?")
    if (res) {
      localStorage.removeItem('ticketHistory')
      this.historyList = []
      this.historyMode = !this.historyMode
    }
  }

  isNumeric(value: any): boolean {
    return !isNaN(Number(value));
  }

  closeDialog() {
    this.dialogRef.close()
  }
}
