import { SaleTransaction, MedicalConsultation, Pet, Client, Appointment } from '../types';

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  if (!dateString) return '';
  try {
    const parts = dateString.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const d = new Date(year, month, day);
      return d.toLocaleDateString('es-MX', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    }
    const d = new Date(dateString);
    return isNaN(d.getTime())
      ? dateString
      : d.toLocaleDateString('es-MX', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        });
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateTimeStr: string): string {
  if (!dateTimeStr) return '';
  try {
    const d = new Date(dateTimeStr);
    return isNaN(d.getTime())
      ? dateTimeStr
      : d.toLocaleDateString('es-MX', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
  } catch {
    return dateTimeStr;
  }
}

export function cleanPhoneForWhatsApp(phone: string): string {
  let cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    cleaned = '521' + cleaned;
  } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
    cleaned = '52' + cleaned;
  }
  return cleaned;
}

export function buildWhatsAppLink(phone: string, message: string): string {
  const clean = cleanPhoneForWhatsApp(phone);
  return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`;
}

export function buildAppointmentReminderMessage(
  apt: Appointment,
  client?: Client,
  pet?: Pet
): string {
  const clientName = client?.name || 'Estimado(a) tutor(a)';
  const petName = pet?.name || 'su mascota';
  return (
    `🐾 *VETERINARIA PRO - RECORDATORIO DE CITA*\n\n` +
    `¡Hola ${clientName}!\n` +
    `Le recordamos su cita programada para *${petName}*:\n\n` +
    `📅 *Fecha:* ${formatDate(apt.date)}\n` +
    `⏰ *Hora:* ${apt.time} hrs\n` +
    `🩺 *Motivo:* ${apt.type} - ${apt.reason}\n` +
    (apt.veterinarianName ? `👨‍⚕️ *Atiende:* ${apt.veterinarianName}\n` : '') +
    `\n📍 *Ubicación:* Clínica Veterinaria Pro\n` +
    `Por favor confirmar su asistencia respondiendo a este mensaje. ¡Los esperamos con mucho gusto! 🐶🐱`
  );
}

export function buildReceiptWhatsAppMessage(sale: SaleTransaction): string {
  const itemsText = sale.items
    .map(
      (item) =>
        `• ${item.quantity}x ${item.name} - ${formatCurrency(item.subtotal)}`
    )
    .join('\n');

  return (
    `🧾 *VETERINARIA PRO - COMPROBANTE DE PAGO*\n\n` +
    `*Folio:* ${sale.folio}\n` +
    `*Cliente:* ${sale.clientName}\n` +
    (sale.petName ? `*Paciente:* ${sale.petName}\n` : '') +
    `*Fecha:* ${formatDateTime(sale.createdAt)}\n\n` +
    `*DETALLE DE COBRO:*\n` +
    `${itemsText}\n\n` +
    `---------------------------\n` +
    (sale.discount > 0 ? `*Descuento:* -${formatCurrency(sale.discount)}\n` : '') +
    `*TOTAL PAGADO:* ${formatCurrency(sale.total)}\n` +
    `*Forma de Pago:* ${sale.paymentMethod}\n` +
    (sale.change ? `*Cambio:* ${formatCurrency(sale.change)}\n` : '') +
    (sale.paymentReference ? `*Referencia:* ${sale.paymentReference}\n` : '') +
    `*Atendió:* ${sale.cashierName}\n\n` +
    `¡Muchas gracias por confiar en la salud de su mascota con nosotros! 🐾✨`
  );
}

export function buildPrescriptionWhatsAppMessage(
  con: MedicalConsultation,
  pet?: Pet,
  client?: Client
): string {
  const rxList = con.prescriptions
    .map(
      (rx, idx) =>
        `${idx + 1}. *${rx.name}*\n` +
        `   • Dosis: ${rx.dosage}\n` +
        `   • Duración: ${rx.duration}\n` +
        `   • Indicación: ${rx.instructions}`
    )
    .join('\n\n');

  return (
    `📋 *VETERINARIA PRO - RECETA Y PLAN MÉDICO*\n\n` +
    `*Paciente:* ${pet?.name || 'Mascota'} (${pet?.species || ''} - ${pet?.breed || ''})\n` +
    `*Tutor:* ${client?.name || 'Tutor'}\n` +
    `*Fecha de Consulta:* ${formatDate(con.date)}\n` +
    `*Médico Veterinario:* ${con.veterinarianName}\n\n` +
    `*DIAGNÓSTICO:*\n${con.diagnosis}\n\n` +
    `*TRATAMIENTO Y MEDICAMENTOS:*\n` +
    `${rxList || 'Sin medicamentos prescritos'}\n\n` +
    (con.recommendations ? `*INDICACIONES GENERALES:*\n${con.recommendations}\n\n` : '') +
    (con.followUpDate ? `🗓️ *Próxima Cita de Revisión:* ${formatDate(con.followUpDate)}\n\n` : '') +
    `Cualquier duda o urgencia, estamos a sus órdenes. ¡Pronta recuperación! 🐾`
  );
}
