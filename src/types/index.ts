export type UserRole = 'reception' | 'vet' | 'admin' | 'assistant';

export interface UserAccount {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  phone: string;
  active: boolean;
  pin?: string;
  licenseNumber?: string; // Cédula profesional veterinaria
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  notes?: string;
  createdAt: string;
}

export type PetSpecies = 'Perro' | 'Gato' | 'Ave' | 'Conejo / Roedor' | 'Reptil' | 'Otro';
export type PetSex = 'Macho' | 'Hembra' | 'Macho Castrado' | 'Hembra Esterilizada';

export interface Pet {
  id: string;
  ownerId: string;
  name: string;
  species: PetSpecies;
  breed: string;
  sex: PetSex;
  birthDate: string;
  color: string;
  initialWeight: number; // kg
  currentWeight: number; // kg
  microchip?: string;
  allergies?: string;
  chronicConditions?: string;
  photoUrl?: string;
  createdAt: string;
}

export type AppointmentStatus = 'Programada' | 'En espera' | 'En consulta' | 'Cancelada' | 'Completada';
export type AppointmentType = 'Consulta General' | 'Vacunación' | 'Desparasitación' | 'Estética / Baño' | 'Cirugía' | 'Urgencia';

export interface Appointment {
  id: string;
  clientId: string;
  petId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  type: AppointmentType;
  status: AppointmentStatus;
  veterinarianName?: string;
  reason: string;
  notes?: string;
}

export interface PhysiologicalVitals {
  weightKg: number;
  temperatureC: number;
  heartRateBpm: number;
  respiratoryRateRpm: number;
  capillaryRefillTime: string; // e.g. "1-2 seg"
  mucousMembranes: 'Rosadas' | 'Pálidas' | 'Cianóticas' | 'Ictéricas' | 'Congestivas';
  bodyConditionScore: '1/5 (Muy delgado)' | '2/5 (Bajo peso)' | '3/5 (Ideal)' | '4/5 (Sobrepeso)' | '5/5 (Obeso)';
}

export interface MedicalConsultation {
  id: string;
  petId: string;
  clientId: string;
  veterinarianName: string;
  date: string;
  reason: string;
  vitals: PhysiologicalVitals;
  symptoms: string;
  physicalExamFindings: string;
  diagnosis: string;
  recommendations: string;
  prescriptions: PrescribedMedication[];
  followUpDate?: string;
}

export interface PrescribedMedication {
  id: string;
  name: string;
  dosage: string; // e.g. "1 comprimido cada 12 hrs"
  duration: string; // e.g. "7 días"
  instructions: string; // e.g. "Administrar con alimento"
}

export interface VaccineRecord {
  id: string;
  petId: string;
  type: string; // e.g. "Séxtuple", "Rabia", "Triple Felina"
  brand: string;
  batchNumber: string;
  applicationDate: string;
  nextBoosterDate: string;
  veterinarianName: string;
  isDeworming?: boolean; // True si es desparasitación interna/externa
  productName?: string;
}

export interface ServiceItem {
  id: string;
  code: string;
  name: string;
  category: 'Consulta' | 'Estética' | 'Cirugía' | 'Laboratorio' | 'Vacunación' | 'Otro';
  price: number;
  durationMinutes: number;
  description?: string;
}

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: 'Medicamento' | 'Alimento' | 'Accesorio' | 'Insumo Médico';
  activeSubstance?: string;
  costPrice: number;
  salePrice: number;
  stock: number;
  minStock: number;
  unit: string; // e.g. "Frasco", "Caja", "Bolsa 15kg", "Unidad"
}

export type PaymentMethod = 'Efectivo' | 'Tarjeta' | 'Transferencia';

export interface SaleItem {
  id: string;
  type: 'servicio' | 'producto';
  itemId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface SaleTransaction {
  id: string;
  folio: string;
  clientId?: string;
  clientName: string;
  clientPhone?: string;
  petId?: string;
  petName?: string;
  items: SaleItem[];
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  amountReceived?: number;
  change?: number;
  paymentReference?: string;
  createdAt: string; // ISO
  cashierName: string;
}

export interface DailyCashClosing {
  id: string;
  date: string;
  totalCash: number;
  totalCard: number;
  totalTransfer: number;
  totalSales: number;
  transactionCount: number;
  cashCounted: number; // Efectivo real contado en caja
  cashDifference: number; // Sobrante (+) o Faltante (-)
  notes?: string;
  closedBy: string;
  closedAt: string;
}
