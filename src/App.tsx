/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  UserRole,
  Client,
  Pet,
  Appointment,
  ServiceItem,
  InventoryItem,
  MedicalConsultation,
  VaccineRecord,
  SaleTransaction,
  UserAccount,
  DailyCashClosing,
  AppointmentStatus,
} from './types';
import {
  getInitialClients,
  getInitialPets,
  getInitialAppointments,
  getInitialServices,
  getInitialInventory,
  getInitialConsultations,
  getInitialVaccines,
  getInitialSales,
  getInitialUsers,
  getInitialCashClosings,
  persistState,
  clearAllSystemData,
  restoreAllSampleData,
  STORAGE_KEYS,
} from './utils/storage';

// Components
import { RoleSelector } from './components/RoleSelector';
import { Header } from './components/Header';
import { Sidebar, AppViewId } from './components/Sidebar';
import { BottomBar } from './components/BottomBar';
import { SupabaseModal } from './components/SupabaseModal';
import { TicketModal } from './components/TicketModal';
import { PrescriptionModal } from './components/PrescriptionModal';
import { OfflineIndicator } from './components/OfflineIndicator';

// Views
import { ClientsView } from './views/reception/ClientsView';
import { PetsView } from './views/reception/PetsView';
import { AppointmentsView } from './views/reception/AppointmentsView';
import { CashRegisterView } from './views/reception/CashRegisterView';
import { ClinicalHistoryView } from './views/vet/ClinicalHistoryView';
import { NewConsultationView } from './views/vet/NewConsultationView';
import { PrescriptionsView } from './views/vet/PrescriptionsView';
import { VaccinesView } from './views/vet/VaccinesView';
import { CashClosingView } from './views/admin/CashClosingView';
import { ServicesCatalogView } from './views/admin/ServicesCatalogView';
import { InventoryView } from './views/admin/InventoryView';
import { StaffView } from './views/admin/StaffView';
import { Phase2RoadmapView } from './views/phase2/Phase2RoadmapView';

export default function App() {
  // Navigation & Session
  const [currentRole, setCurrentRole] = useState<UserRole | null>(null);
  const [currentView, setCurrentView] = useState<AppViewId>('clients');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Cross-module preselection states
  const [preselectedClientId, setPreselectedClientId] = useState<string | null>(null);
  const [preselectedPetId, setPreselectedPetId] = useState<string | null>(null);

  // Modals
  const [activeTicket, setActiveTicket] = useState<SaleTransaction | null>(null);
  const [activePrescription, setActivePrescription] = useState<MedicalConsultation | null>(null);
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);

  // App State Data
  const [clients, setClients] = useState<Client[]>(getInitialClients);
  const [pets, setPets] = useState<Pet[]>(getInitialPets);
  const [appointments, setAppointments] = useState<Appointment[]>(getInitialAppointments);
  const [services, setServices] = useState<ServiceItem[]>(getInitialServices);
  const [inventory, setInventory] = useState<InventoryItem[]>(getInitialInventory);
  const [consultations, setConsultations] = useState<MedicalConsultation[]>(getInitialConsultations);
  const [vaccines, setVaccines] = useState<VaccineRecord[]>(getInitialVaccines);
  const [sales, setSales] = useState<SaleTransaction[]>(getInitialSales);
  const [users, setUsers] = useState<UserAccount[]>(getInitialUsers);
  const [cashClosings, setCashClosings] = useState<DailyCashClosing[]>(getInitialCashClosings);

  // Sync state changes with LocalStorage
  useEffect(() => {
    persistState(STORAGE_KEYS.CLIENTS, clients);
  }, [clients]);

  useEffect(() => {
    persistState(STORAGE_KEYS.PETS, pets);
  }, [pets]);

  useEffect(() => {
    persistState(STORAGE_KEYS.APPOINTMENTS, appointments);
  }, [appointments]);

  useEffect(() => {
    persistState(STORAGE_KEYS.SERVICES, services);
  }, [services]);

  useEffect(() => {
    persistState(STORAGE_KEYS.INVENTORY, inventory);
  }, [inventory]);

  useEffect(() => {
    persistState(STORAGE_KEYS.CONSULTATIONS, consultations);
  }, [consultations]);

  useEffect(() => {
    persistState(STORAGE_KEYS.VACCINES, vaccines);
  }, [vaccines]);

  useEffect(() => {
    persistState(STORAGE_KEYS.SALES, sales);
  }, [sales]);

  useEffect(() => {
    persistState(STORAGE_KEYS.USERS, users);
  }, [users]);

  useEffect(() => {
    persistState(STORAGE_KEYS.CASH_CLOSINGS, cashClosings);
  }, [cashClosings]);

  // Handle Role Selection from Home Screen
  const handleSelectRole = (role: UserRole) => {
    setCurrentRole(role);
    switch (role) {
      case 'reception':
        setCurrentView('clients');
        break;
      case 'vet':
        setCurrentView('clinical-history');
        break;
      case 'admin':
        setCurrentView('cash-closing');
        break;
      case 'assistant':
        setCurrentView('appointments');
        break;
    }
  };

  const handleLogout = () => {
    setCurrentRole(null);
    setPreselectedClientId(null);
    setPreselectedPetId(null);
    setIsSidebarOpen(false);
  };

  // Clear all sample data permanently
  const handleClearAllSampleData = () => {
    clearAllSystemData();
    setClients([]);
    setPets([]);
    setAppointments([]);
    setServices([]);
    setInventory([]);
    setConsultations([]);
    setVaccines([]);
    setSales([]);
    setCashClosings([]);
    setUsers(getInitialUsers());
  };

  // Restore sample demo data
  const handleRestoreSampleData = () => {
    restoreAllSampleData();
    setClients(getInitialClients());
    setPets(getInitialPets());
    setAppointments(getInitialAppointments());
    setServices(getInitialServices());
    setInventory(getInitialInventory());
    setConsultations(getInitialConsultations());
    setVaccines(getInitialVaccines());
    setSales(getInitialSales());
    setUsers(getInitialUsers());
    setCashClosings([]);
  };

  // CRUD & Operations Handlers
  const handleAddClient = (client: Client) => {
    setClients([client, ...clients]);
  };

  const handleUpdateClient = (updated: Client) => {
    setClients(clients.map((c) => (c.id === updated.id ? updated : c)));
  };

  const handleDeleteClient = (id: string) => {
    setClients(clients.filter((c) => c.id !== id));
  };

  const handleAddPet = (pet: Pet) => {
    setPets([pet, ...pets]);
  };

  const handleUpdatePet = (updated: Pet) => {
    setPets(pets.map((p) => (p.id === updated.id ? updated : p)));
  };

  const handleDeletePet = (id: string) => {
    setPets(pets.filter((p) => p.id !== id));
  };

  const handleAddAppointment = (apt: Appointment) => {
    setAppointments([apt, ...appointments]);
  };

  const handleUpdateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    setAppointments(
      appointments.map((a) => (a.id === id ? { ...a, status } : a))
    );
  };

  const handleDeleteAppointment = (id: string) => {
    setAppointments(appointments.filter((a) => a.id !== id));
  };

  const handleAddSale = (sale: SaleTransaction) => {
    setSales([sale, ...sales]);

    // Deduct inventory stock if products were sold
    sale.items.forEach((item) => {
      if (item.type === 'producto') {
        setInventory((prev) =>
          prev.map((inv) =>
            inv.id === item.itemId
              ? { ...inv, stock: Math.max(0, inv.stock - item.quantity) }
              : inv
          )
        );
      }
    });
  };

  const handleSaveConsultation = (con: MedicalConsultation) => {
    setConsultations([con, ...consultations]);

    // Update patient's current weight from consultation vitals
    setPets((prev) =>
      prev.map((p) =>
        p.id === con.petId ? { ...p, currentWeight: con.vitals.weightKg } : p
      )
    );
  };

  const handleAddVaccine = (record: VaccineRecord) => {
    setVaccines([record, ...vaccines]);
  };

  const handleDeleteVaccine = (id: string) => {
    setVaccines(vaccines.filter((v) => v.id !== id));
  };

  const handleAddService = (item: ServiceItem) => {
    setServices([...services, item]);
  };

  const handleUpdateService = (updated: ServiceItem) => {
    setServices(services.map((s) => (s.id === updated.id ? updated : s)));
  };

  const handleDeleteService = (id: string) => {
    setServices(services.filter((s) => s.id !== id));
  };

  const handleAddInventory = (item: InventoryItem) => {
    setInventory([...inventory, item]);
  };

  const handleUpdateInventory = (updated: InventoryItem) => {
    setInventory(inventory.map((i) => (i.id === updated.id ? updated : i)));
  };

  const handleDeleteInventory = (id: string) => {
    setInventory(inventory.filter((i) => i.id !== id));
  };

  const handleAddUser = (user: UserAccount) => {
    setUsers([...users, user]);
  };

  const handleUpdateUser = (updated: UserAccount) => {
    setUsers(users.map((u) => (u.id === updated.id ? updated : u)));
  };

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter((u) => u.id !== id));
  };

  const handleAddCashClosing = (closing: DailyCashClosing) => {
    setCashClosings([closing, ...cashClosings]);
  };

  // Cross-module shortcuts
  const handleOpenClinicalHistoryForPet = (petId: string) => {
    setPreselectedPetId(petId);
    setCurrentView('clinical-history');
  };

  const handleScheduleAppointmentForPet = (petId: string, clientId: string) => {
    setPreselectedPetId(petId);
    setPreselectedClientId(clientId);
    setCurrentView('appointments');
  };

  const handleStartConsultationFromAppointment = (apt: Appointment) => {
    setPreselectedPetId(apt.petId);
    setPreselectedClientId(apt.clientId);
    // Change appointment status to En consulta
    handleUpdateAppointmentStatus(apt.id, 'En consulta');
    setCurrentView('new-consultation');
  };

  const handleSendToCashierFromAppointment = (apt: Appointment) => {
    setPreselectedPetId(apt.petId);
    setPreselectedClientId(apt.clientId);
    setCurrentView('cash-register');
  };

  // If no role is selected yet, render the strict home Role Selector
  if (!currentRole) {
    return (
      <main className="min-h-screen bg-slate-100 flex flex-col justify-center">
        <RoleSelector onSelectRole={handleSelectRole} />
        <OfflineIndicator />
      </main>
    );
  }

  // Active pet/client for prescription modal if open
  const prescriptionPet = activePrescription
    ? pets.find((p) => p.id === activePrescription.petId)
    : undefined;
  const prescriptionClient = prescriptionPet
    ? clients.find((c) => c.id === prescriptionPet.ownerId)
    : undefined;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      {/* 1. Cabecera Institucional Unificada */}
      <Header
        currentRole={currentRole}
        onLogout={handleLogout}
        onOpenDataManagement={() => setIsDataModalOpen(true)}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
      />

      {/* Main Layout Area */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* 2. Menú Lateral Desplegable en Escritorio */}
        <Sidebar
          currentRole={currentRole}
          currentView={currentView}
          onSelectView={(view) => {
            setCurrentView(view);
            setIsSidebarOpen(false);
          }}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onSwitchRole={handleLogout}
          onOpenDataManagement={() => setIsDataModalOpen(true)}
        />

        {/* 3. Área de Trabajo Limpia (Sin pestañas duplicadas) */}
        <main className="flex-1 p-3 sm:p-6 lg:p-8 pb-24 lg:pb-8 min-w-0 overflow-y-auto">
          {/* Reception Modules */}
          {currentView === 'clients' && (
            <ClientsView
              clients={clients}
              pets={pets}
              onAddClient={handleAddClient}
              onUpdateClient={handleUpdateClient}
              onDeleteClient={handleDeleteClient}
              onSelectPetForView={handleOpenClinicalHistoryForPet}
              onNewPetForClient={(clientId) => {
                setPreselectedClientId(clientId);
                setCurrentView('pets');
              }}
            />
          )}

          {currentView === 'pets' && (
            <PetsView
              pets={pets}
              clients={clients}
              onAddPet={handleAddPet}
              onUpdatePet={handleUpdatePet}
              onDeletePet={handleDeletePet}
              onOpenClinicalHistory={handleOpenClinicalHistoryForPet}
              onScheduleAppointment={handleScheduleAppointmentForPet}
              initialSelectedClientId={preselectedClientId}
            />
          )}

          {currentView === 'appointments' && (
            <AppointmentsView
              appointments={appointments}
              clients={clients}
              pets={pets}
              onAddAppointment={handleAddAppointment}
              onUpdateStatus={handleUpdateAppointmentStatus}
              onDeleteAppointment={handleDeleteAppointment}
              onStartConsultation={handleStartConsultationFromAppointment}
              onSendToCashier={handleSendToCashierFromAppointment}
              preselectedPetId={preselectedPetId}
              preselectedClientId={preselectedClientId}
            />
          )}

          {currentView === 'cash-register' && (
            <CashRegisterView
              services={services}
              inventory={inventory}
              clients={clients}
              pets={pets}
              sales={sales}
              onAddSale={handleAddSale}
              onOpenTicket={(sale) => setActiveTicket(sale)}
              preselectedClientId={preselectedClientId}
              preselectedPetId={preselectedPetId}
            />
          )}

          {/* Veterinarian Modules */}
          {currentView === 'clinical-history' && (
            <ClinicalHistoryView
              pets={pets}
              clients={clients}
              consultations={consultations}
              vaccines={vaccines}
              onOpenNewConsultation={(petId) => {
                setPreselectedPetId(petId);
                setCurrentView('new-consultation');
              }}
              onOpenPrescriptionModal={(con) => setActivePrescription(con)}
              preselectedPetId={preselectedPetId}
            />
          )}

          {currentView === 'new-consultation' && (
            <NewConsultationView
              pets={pets}
              clients={clients}
              onSaveConsultation={handleSaveConsultation}
              onOpenPrescriptionModal={(con) => setActivePrescription(con)}
              preselectedPetId={preselectedPetId}
            />
          )}

          {currentView === 'prescriptions' && (
            <PrescriptionsView
              consultations={consultations}
              pets={pets}
              clients={clients}
              onOpenPrescriptionModal={(con) => setActivePrescription(con)}
            />
          )}

          {currentView === 'vaccines' && (
            <VaccinesView
              vaccines={vaccines}
              pets={pets}
              clients={clients}
              onAddVaccine={handleAddVaccine}
              onDeleteVaccine={handleDeleteVaccine}
            />
          )}

          {/* Admin Modules */}
          {currentView === 'cash-closing' && (
            <CashClosingView
              sales={sales}
              cashClosings={cashClosings}
              onAddCashClosing={handleAddCashClosing}
            />
          )}

          {currentView === 'services-catalog' && (
            <ServicesCatalogView
              services={services}
              onAddService={handleAddService}
              onUpdateService={handleUpdateService}
              onDeleteService={handleDeleteService}
            />
          )}

          {currentView === 'inventory' && (
            <InventoryView
              inventory={inventory}
              onAddInventoryItem={handleAddInventory}
              onUpdateInventoryItem={handleUpdateInventory}
              onDeleteInventoryItem={handleDeleteInventory}
            />
          )}

          {currentView === 'staff' && (
            <StaffView
              users={users}
              onAddUser={handleAddUser}
              onUpdateUser={handleUpdateUser}
              onDeleteUser={handleDeleteUser}
              onSelectRoleToTest={(role) => handleSelectRole(role)}
            />
          )}

          {/* Phase 2 Interactive Roadmap */}
          {currentView === 'phase2' && <Phase2RoadmapView />}
        </main>
      </div>

      {/* 4. Navegación Móvil y Tablet (Bottom Bar) */}
      <BottomBar
        currentRole={currentRole}
        currentView={currentView}
        onSelectView={(view) => setCurrentView(view)}
        onOpenMenu={() => setIsSidebarOpen(true)}
      />

      {/* Modales Compartidos */}
      <TicketModal
        sale={activeTicket}
        onClose={() => setActiveTicket(null)}
      />

      <PrescriptionModal
        consultation={activePrescription}
        pet={prescriptionPet}
        client={prescriptionClient}
        onClose={() => setActivePrescription(null)}
      />

      <SupabaseModal
        isOpen={isDataModalOpen}
        onClose={() => setIsDataModalOpen(false)}
        onClearSampleData={handleClearAllSampleData}
        onRestoreSampleData={handleRestoreSampleData}
      />

      <OfflineIndicator />
    </div>
  );
}
