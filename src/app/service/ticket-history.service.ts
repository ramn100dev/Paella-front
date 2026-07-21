import { Injectable } from '@angular/core';
import { HistoryItem } from '../models/HistoryItem';

const STORAGE_KEY = 'ticketHistory';

@Injectable({
  providedIn: 'root'
})
export class TicketHistoryService {

  getAll(): HistoryItem[] {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  add(item: Omit<HistoryItem, 'id' | 'date'>): void {
    const history = this.getAll();
    history.unshift({ ...item, id: crypto.randomUUID(), date: new Date().toISOString() });
    this.save(history);
  }

  remove(ids: string[]): void {
    const history = this.getAll().filter(item => !ids.includes(item.id));
    this.save(history);
  }

  getInRange(from: Date | null, to: Date | null): HistoryItem[] {
    return this.getAll().filter(item => {
      const itemDate = new Date(item.date);

      if (from && itemDate < from) return false;
      if (to && itemDate > to) return false;

      return true;
    });
  }

  exportAsCsv(items?: HistoryItem[]): void {
    const history = items ?? this.getAll();

    const header = ['Nombre', 'Direccion', 'Telefono', 'Entrega', 'Detalle'];
    const rows = history.map(item => [
      item.name,
      item.address,
      item.phone,
      item.time,
      this.flattenData(item.data)
    ]);

    const csv = [header, ...rows]
      .map(row => row.map(cell => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(';'))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `historial-tickets-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();

    URL.revokeObjectURL(url);
  }

  private flattenData(data: any): string {
    if (!data) return '';
    return Object.entries(data)
      .filter(([, value]) => value !== null && value !== undefined && value !== '')
      .map(([key, value]) => `${key}: ${String(value).replace(/<br>/g, ', ')}`)
      .join(' | ');
  }

  private save(history: HistoryItem[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }
}
