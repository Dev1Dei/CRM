import { Injectable } from '@angular/core';
import { Database, ref, push, set, onValue } from '@angular/fire/database';
import { listVal } from 'rxfire/database';
import { Observable } from 'rxjs';

export interface Company {
  companyName: string;
  companyCode?: string;
  vatCode?: string;
  address: string;
  email: string;
  phone?: string;
  createdAt: number;
}

export interface Client {
  firstName: string;
  lastName: string;
  position: string;
  phone: string;
  createdAt: number;
}

@Injectable({
  providedIn: 'root'
})
export class DbService {
  constructor(private db: Database) {}

  async addCompany(data: Omit<Company, 'createdAt'>) {
    const companiesRef = ref(this.db, 'companies');
    const newRef = push(companiesRef);
    await set(newRef, { ...data, createdAt: Date.now() });
    return newRef.key;
  }

  async addClient(data: Omit<Client, 'createdAt'>) {
    const clientsRef = ref(this.db, 'clients');
    const newRef = push(clientsRef);
    await set(newRef, { ...data, createdAt: Date.now() });
    return newRef.key;
  }

  getCompanies$(): Observable<Company[]> {
    const companiesRef = ref(this.db, 'companies');
    return listVal<Company>(companiesRef, { keyField: 'id' });
  }

  getClients$(): Observable<Client[]> {
    const clientsRef = ref(this.db, 'clients');
    return listVal<Client>(clientsRef, { keyField: 'id' });
  }
  getConnectionStatus$(): Observable<boolean> {
    return new Observable((observer) => {
      const connectedRef = ref(this.db, '.info/connected');
      onValue(connectedRef, (snap) => {
        observer.next(!!snap.val());
      });
    });
  }
}
