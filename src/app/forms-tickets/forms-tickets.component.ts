import { HistoryItem } from './../models/HistoryItem';
import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormsServiceService } from '../service/forms-service.service';
import { MatTab, MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TicketHistoryService } from '../service/ticket-history.service';

type HistoryTabType = 'Paella' | 'Raciones' | 'Menu diario' | 'Menu';

@Component({
    imports: [
        MatIcon,
        MatTabGroup,
        MatTab,
        CommonModule,
        FormsModule
    ],
    selector: 'app-forms-tickets',
    templateUrl: './forms-tickets.component.html',
    styleUrls: ['./forms-tickets.component.css']
})
export class FormsTicketsComponent {

  headerRaciones: string[] = []
  raciones: any[][] = []
  filteredRaciones: Array<{ [key: string]: number }> = []
  diarios: any[][] = []
  paellas: any[][] = []

  historyList: HistoryItem[] = []
  historyTabs: { label: string, type: HistoryTabType }[] = [
    { label: 'Paellas', type: 'Paella' },
    { label: 'Raciones', type: 'Raciones' },
    { label: 'Menús diarios', type: 'Menu diario' },
    { label: 'Local', type: 'Menu' }
  ]

  historyMode = false
  historyDeleteMode = false

  fromDate: string | null = null
  toDate: string | null = null

  activeHistoryTabIndex = 0

  private dialogRef = inject(MatDialogRef<FormsTicketsComponent>)
  private service = inject(FormsServiceService)
  private router = inject(Router)
  private historyService = inject(TicketHistoryService)

  constructor() {

    this.historyList = this.historyService.getAll()

    this.service.getForm('Paella_Form').subscribe(data => {
      this.paellas = data.slice(1)
    })
  }

  historyByType(type: HistoryTabType): HistoryItem[] {
    return this.historyInRange().filter(item => item.type === type)
  }

  historyInRange(): HistoryItem[] {
    return this.historyService.getInRange(this.parseFromDate(), this.parseToDate())
  }

  private parseFromDate(): Date | null {
    return this.fromDate ? new Date(`${this.fromDate}T00:00:00`) : null
  }

  private parseToDate(): Date | null {
    return this.toDate ? new Date(`${this.toDate}T23:59:59.999`) : null
  }

  exportFilteredHistory() {
    const activeType = this.historyTabs[this.activeHistoryTabIndex].type
    this.historyService.exportAsCsv(this.historyByType(activeType))
  }

  deleteFilteredHistory() {
    const activeTab = this.historyTabs[this.activeHistoryTabIndex]

    const res = window.confirm(`¿Quieres eliminar el historial de ${activeTab.label} en la franja seleccionada? Esta acción no se puede deshacer.`)
    if (res) {
      const ids = this.historyByType(activeTab.type).map(item => item.id)
      this.historyService.remove(ids)
      this.historyList = this.historyService.getAll()
    }
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
              let check = Number(this.diarios[9])
              console.log(!isNaN(check))
            }
          })
        }
        break
    }
  }

  selectFormTicket(type: string, form: any, index: number) {

    switch (type) {
      case 'Paella':
        this.router.navigate(['/ticket', form[0]], { state: { client: form, food: form[1] + " para " + form[2] + " personas", time: form[4].replace(/:\d{2}(?=\s[AP]M)/, "") + " Para el " + form[3], ticketType: type, confirm: true } })
        this.service.deleteRow("Paella_Form", index + 1).subscribe()
        break;

      case 'Raciones':
        const pedido = this.filteredRaciones[index]
        const food = Object.keys(pedido).map(key => `-${key}: ${pedido[key]}`).join('<br>')

        this.router.navigate(['/ticket', form[0]], { state: { client: form, food: food, time: form[1].replace(/:\d{2}(?=\s[AP]M)/, "") + " Para el " + form[2], ticketType: type, confirm: true } })
        this.service.deleteRow("Raciones_Form", index + 1).subscribe()
        break;

      case 'Menu diario':
        let numeric = this.isNumeric(form[9])

        if (form[9] && !numeric) {
          this.router.navigate(['/ticket', form[0]], { state: { client: form, food: `Primero: ${form[6]}<br>Segundo: ${form[7]}<br>Postre: ${form[8]}<br>Bebida: ${form[9]}`, time: form[2].replace(/:\d{2}(?=\s[AP]M)/, "") + " Para el " + form[1], ticketType: type, confirm: true } })
        } else {
          this.router.navigate(['/ticket', form[0]], { state: { client: form, food: `Primero: ${form[6]}<br>Segundo: ${form[7]}<br>Postre: ${form[8]}`, time: form[2].replace(/:\d{2}(?=\s[AP]M)/, "") + " Para el " + form[1], ticketType: type, confirm: true } })
        }

        this.service.deleteRow("Menu_Form", index + 1).subscribe()
        break;

      default:
        return;
    }

    this.dialogRef.close()
  }

  reprint(form: HistoryItem){
    let mockClient: any = {};

    switch(form.type){
      case 'Paella':
        mockClient = []
        mockClient[5] = form.name
        mockClient[6] = form.address
        mockClient[7] = form.phone
        break

      case 'Raciones':
        mockClient = []
        mockClient[5] = form.name
        mockClient[3] = form.address
        mockClient[4] = form.phone
        break

      case 'Menu diario':
        mockClient = []
        mockClient[3] = form.name
        mockClient[4] = form.address
        mockClient[5] = form.phone
        break;

      case 'Menu':
        mockClient.name = form.name
        mockClient.address = form.address
        mockClient.phone = form.phone
        break;
    }

    this.router.navigate(['/ticket', 'reprint'], { state: { client: mockClient, food: form.data.food, time: form.time, ticketType: form.type, confirm: true, isReprint: true } })

    this.dialogRef.close()
  }

  toggleHistoryDeleteMode(){
    this.historyDeleteMode = !this.historyDeleteMode
  }

  deleteHistoryItem(item: HistoryItem){
    this.historyService.remove([item.id])
    this.historyList = this.historyList.filter(h => h.id !== item.id)
  }

  isNumeric(value: any): boolean {
    return !isNaN(Number(value));
  }

  closeDialog() {
    this.dialogRef.close()
  }
}
