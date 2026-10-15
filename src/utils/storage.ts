import {
  Client,
  Pet,
  Appointment,
  MedicalConsultation,
  VaccineRecord,
  ServiceItem,
  InventoryItem,
  SaleTransaction,
  UserAccount,
  DailyCashClosing,
} from '../types';
import {
  SAMPLE_CLIENTS,
  SAMPLE_PETS,
  SAMPLE_APPOINTMENTS,
  SAMPLE_SERVICES,
  SAMPLE_INVENTORY,
  SAMPLE_CONSULTATIONS,
  SAMPLE_VACCINES,
  SAMPLE_SALES,
  SAMPLE_USERS,
} from '../data/sampleData';

const STORAGE_KEYS = {
  CLEARED_FLAG: 'vet_sample_data_cleared',
  CLIENTS: 'vet_clients',
  PETS: 'vet_pets',
  APPOINTMENTS: 'vet_appointments',
  SERVICES: 'vet_services',
  INVENTORY: 'vet_inventory',
  CONSULTATIONS: 'vet_consultations',
  VACCINES: 'vet_vaccines',
  SALES: 'vet_sales',
  USERS: 'vet_users',
  CASH_CLOSINGS: 'vet_cash_closings',
  SUPABASE_URL: 'vet_supabase_url',
  SUPABASE_KEY: 'vet_supabase_anon_key',
};

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

export function isSampleDataCleared(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(STORAGE_KEYS.CLEARED_FLAG) === 'true';
}

function loadOrInit<T>(key: string, sampleFallback: T[]): T[] {
  if (typeof window === 'undefined') return sampleFallback;
  const isCleared = localStorage.getItem(STORAGE_KEYS.CLEARED_FLAG) === 'true';
  const saved = localStorage.getItem(key);

  if (saved !== null) {
    try {
      return JSON.parse(saved);
    } catch {
      return isCleared ? [] : sampleFallback;
    }
  }

  // If user explicitly cleared sample data previously, start completely empty!
  if (isCleared) {
    return [];
  }

  // Otherwise provide initial demonstration data
  localStorage.setItem(key, JSON.stringify(sampleFallback));
  return sampleFallback;
}

export function getInitialClients(): Client[] {
  return loadOrInit(STORAGE_KEYS.CLIENTS, SAMPLE_CLIENTS);
}

export function getInitialPets(): Pet[] {
  return loadOrInit(STORAGE_KEYS.PETS, SAMPLE_PETS);
}

export function getInitialAppointments(): Appointment[] {
  return loadOrInit(STORAGE_KEYS.APPOINTMENTS, SAMPLE_APPOINTMENTS);
}

export function getInitialServices(): ServiceItem[] {
  return loadOrInit(STORAGE_KEYS.SERVICES, SAMPLE_SERVICES);
}

export function getInitialInventory(): InventoryItem[] {
  return loadOrInit(STORAGE_KEYS.INVENTORY, SAMPLE_INVENTORY);
}

export function getInitialConsultations(): MedicalConsultation[] {
  return loadOrInit(STORAGE_KEYS.CONSULTATIONS, SAMPLE_CONSULTATIONS);
}

export function getInitialVaccines(): VaccineRecord[] {
  return loadOrInit(STORAGE_KEYS.VACCINES, SAMPLE_VACCINES);
}

export function getInitialSales(): SaleTransaction[] {
  return loadOrInit(STORAGE_KEYS.SALES, SAMPLE_SALES);
}

export function getInitialUsers(): UserAccount[] {
  return loadOrInit(STORAGE_KEYS.USERS, SAMPLE_USERS);
}

export function getInitialCashClosings(): DailyCashClosing[] {
  return loadOrInit(STORAGE_KEYS.CASH_CLOSINGS, []);
}

export function getSupabaseConfig(): SupabaseConfig {
  if (typeof window === 'undefined') return { url: '', anonKey: '' };
  return {
    url: localStorage.getItem(STORAGE_KEYS.SUPABASE_URL) || '',
    anonKey: localStorage.getItem(STORAGE_KEYS.SUPABASE_KEY) || '',
  };
}

export function saveSupabaseConfig(config: SupabaseConfig) {
  localStorage.setItem(STORAGE_KEYS.SUPABASE_URL, config.url.trim());
  localStorage.setItem(STORAGE_KEYS.SUPABASE_KEY, config.anonKey.trim());
}

export function persistState(key: string, data: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.warn(`Failed to persist key ${key}:`, err);
  }
}

export function clearAllSystemData(): void {
  // Flag that sample data is cleared so it is NEVER restored automatically
  localStorage.setItem(STORAGE_KEYS.CLEARED_FLAG, 'true');

  localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify([]));
  localStorage.setItem(STORAGE_KEYS.PETS, JSON.stringify([]));
  localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify([]));
  localStorage.setItem(STORAGE_KEYS.CONSULTATIONS, JSON.stringify([]));
  localStorage.setItem(STORAGE_KEYS.VACCINES, JSON.stringify([]));
  localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify([]));
  localStorage.setItem(STORAGE_KEYS.CASH_CLOSINGS, JSON.stringify([]));

  // Retain default essential categories/catalogs if needed or wipe
  localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify([]));
  localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify([]));
  
  // Retain a base admin user so access is never locked
  const baseAdmin: UserAccount[] = [
    {
      id: 'u-admin-root',
      name: 'Administrador Principal',
      role: 'admin',
      email: 'admin@veterinaria.com',
      phone: '',
      active: true,
      pin: '1234',
    },
  ];
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(baseAdmin));
}

export function restoreAllSampleData(): void {
  localStorage.removeItem(STORAGE_KEYS.CLEARED_FLAG);
  localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(SAMPLE_CLIENTS));
  localStorage.setItem(STORAGE_KEYS.PETS, JSON.stringify(SAMPLE_PETS));
  localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(SAMPLE_APPOINTMENTS));
  localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(SAMPLE_SERVICES));
  localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(SAMPLE_INVENTORY));
  localStorage.setItem(STORAGE_KEYS.CONSULTATIONS, JSON.stringify(SAMPLE_CONSULTATIONS));
  localStorage.setItem(STORAGE_KEYS.VACCINES, JSON.stringify(SAMPLE_VACCINES));
  localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(SAMPLE_SALES));
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(SAMPLE_USERS));
  localStorage.setItem(STORAGE_KEYS.CASH_CLOSINGS, JSON.stringify([]));
}

export { STORAGE_KEYS };
