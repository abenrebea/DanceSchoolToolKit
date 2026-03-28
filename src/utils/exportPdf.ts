import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { SimulatorState, ClassOccupancy, PaymentOffer } from '../types';
import { calculateOfferRevenue } from './calculations';

const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

const BRAND: [number, number, number] = [76, 110, 245];
const GREEN: [number, number, number] = [34, 139, 34];
const RED: [number, number, number] = [200, 50, 50];
const LIGHT_GRAY: [number, number, number] = [245, 245, 250];

interface ExportData {
  state: SimulatorState;
  seasonWeeks: number;
  weeklyHours: number;
  annualCost: number;
  totalRevenue: number;
  profitLoss: number;
  isProfitable: boolean;
  offersWithPricePerClass: (PaymentOffer & { pricePerClass: number | null })[];
  classOccupancy: ClassOccupancy[];
}

export function exportSimulationPDF(data: ExportData) {
  const {
    state,
    seasonWeeks,
    weeklyHours,
    annualCost,
    totalRevenue,
    profitLoss,
    isProfitable,
    offersWithPricePerClass,
    classOccupancy,
  } = data;

  const doc = new jsPDF();
  const fmt = (n: number) => n.toLocaleString('fr-FR');
  let y: number;

  // Title
  doc.setFontSize(20);
  doc.setTextColor(...BRAND);
  doc.text('Simulateur de Revenus', 14, 20);
  doc.setFontSize(10);
  doc.setTextColor(120, 120, 120);
  doc.text('Professeur indépendant — Danse, Yoga, Pilates...', 14, 27);

  // Season info
  doc.setFontSize(9);
  doc.text(
    `Saison : ${state.season.startDate} au ${state.season.endDate}  |  ${seasonWeeks} semaines  |  ${weeklyHours}h/semaine`,
    14,
    34
  );

  // --- Financial Summary ---
  doc.setFontSize(13);
  doc.setTextColor(50, 50, 50);
  doc.text('Bilan financier', 14, 44);

  const totalStudents = state.simulation.reduce((sum, s) => sum + s.studentCount, 0);

  autoTable(doc, {
    startY: 48,
    head: [['Indicateur', 'Valeur']],
    body: [
      ['Total élèves / ventes', String(totalStudents)],
      ['Revenus annuels', `${fmt(totalRevenue)} EUR`],
      ['Charges annuelles', `${fmt(annualCost)} EUR`],
      ['Résultat net', `${profitLoss >= 0 ? '+' : ''}${fmt(profitLoss)} EUR`],
      ['Statut', isProfitable ? 'Rentable' : 'Déficitaire'],
    ],
    headStyles: { fillColor: BRAND, fontSize: 9 },
    bodyStyles: { fontSize: 9 },
    alternateRowStyles: { fillColor: LIGHT_GRAY },
    columnStyles: { 1: { halign: 'right' } },
    didParseCell(hookData) {
      if (hookData.section === 'body' && hookData.row.index === 3) {
        hookData.cell.styles.textColor = isProfitable ? GREEN : RED;
        hookData.cell.styles.fontStyle = 'bold';
      }
      if (hookData.section === 'body' && hookData.row.index === 4) {
        hookData.cell.styles.textColor = isProfitable ? GREEN : RED;
        hookData.cell.styles.fontStyle = 'bold';
      }
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  y = (doc as any).lastAutoTable.finalY + 10;

  // --- Revenue Breakdown ---
  doc.setFontSize(13);
  doc.setTextColor(50, 50, 50);
  doc.text('Détail des revenus par offre', 14, y);

  const revenueRows = offersWithPricePerClass.map((offer) => {
    const count = state.simulation.find((s) => s.offerId === offer.id)?.studentCount ?? 0;
    const revenue = calculateOfferRevenue(offer, count);
    return [
      offer.label,
      `${fmt(offer.price)} EUR`,
      String(count),
      `${fmt(revenue)} EUR`,
    ];
  });

  revenueRows.push(
    [{ content: 'Total revenus', colSpan: 3, styles: { fontStyle: 'bold' } } as never, `${fmt(totalRevenue)} EUR`],
    [{ content: 'Total charges', colSpan: 3, styles: { fontStyle: 'bold' } } as never, `-${fmt(annualCost)} EUR`],
    [{ content: 'Résultat', colSpan: 3, styles: { fontStyle: 'bold' } } as never, `${profitLoss >= 0 ? '+' : ''}${fmt(profitLoss)} EUR`]
  );

  autoTable(doc, {
    startY: y + 4,
    head: [['Offre', 'Prix unitaire', 'Quantité', 'Revenu']],
    body: revenueRows,
    headStyles: { fillColor: BRAND, fontSize: 9 },
    bodyStyles: { fontSize: 9 },
    alternateRowStyles: { fillColor: LIGHT_GRAY },
    columnStyles: {
      1: { halign: 'right' },
      2: { halign: 'right' },
      3: { halign: 'right' },
    },
    didParseCell(hookData) {
      const totalRowStart = offersWithPricePerClass.length;
      if (hookData.section === 'body' && hookData.row.index === totalRowStart) {
        hookData.cell.styles.fillColor = [220, 252, 231];
        hookData.cell.styles.textColor = GREEN;
      }
      if (hookData.section === 'body' && hookData.row.index === totalRowStart + 1) {
        hookData.cell.styles.fillColor = [254, 226, 226];
        hookData.cell.styles.textColor = RED;
      }
      if (hookData.section === 'body' && hookData.row.index === totalRowStart + 2) {
        hookData.cell.styles.fillColor = isProfitable ? [220, 252, 231] : [254, 226, 226];
        hookData.cell.styles.textColor = isProfitable ? GREEN : RED;
        hookData.cell.styles.fontStyle = 'bold';
      }
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  y = (doc as any).lastAutoTable.finalY + 10;

  // --- Charges Breakdown ---
  doc.setFontSize(13);
  doc.setTextColor(50, 50, 50);
  doc.text('Détail des charges', 14, y);

  const weeklyRent = state.charges.rentPerHour * weeklyHours;
  const annualRent = weeklyRent * seasonWeeks;
  const weeklyInstructor = state.charges.instructorHourlyRate * weeklyHours;
  const annualInstructor = weeklyInstructor * seasonWeeks;

  const chargesBody: string[][] = [
    ['Loyer studio', `${state.charges.rentPerHour} EUR/h x ${weeklyHours}h x ${seasonWeeks} sem.`, `${fmt(annualRent)} EUR`],
  ];
  if (state.charges.instructorHourlyRate > 0) {
    chargesBody.push([
      'Rémunération Prof',
      `${state.charges.instructorHourlyRate} EUR/h x ${weeklyHours}h x ${seasonWeeks} sem.`,
      `${fmt(annualInstructor)} EUR`,
    ]);
  }
  for (const c of state.charges.fixedCharges) {
    chargesBody.push([c.label || 'Frais fixe', 'Annuel', `${fmt(c.annualAmount)} EUR`]);
  }
  chargesBody.push(['Total charges', '', `${fmt(annualCost)} EUR`]);

  autoTable(doc, {
    startY: y + 4,
    head: [['Charge', 'Calcul', 'Montant']],
    body: chargesBody,
    headStyles: { fillColor: BRAND, fontSize: 9 },
    bodyStyles: { fontSize: 9 },
    alternateRowStyles: { fillColor: LIGHT_GRAY },
    columnStyles: { 2: { halign: 'right' } },
    didParseCell(hookData) {
      const lastRow = chargesBody.length - 1;
      if (hookData.section === 'body' && hookData.row.index === lastRow) {
        hookData.cell.styles.fontStyle = 'bold';
        hookData.cell.styles.fillColor = [254, 226, 226];
        hookData.cell.styles.textColor = RED;
      }
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  y = (doc as any).lastAutoTable.finalY + 10;

  // Check if we need a new page for occupancy table
  if (y > 230) {
    doc.addPage();
    y = 20;
  }

  // --- Class Occupancy ---
  doc.setFontSize(13);
  doc.setTextColor(50, 50, 50);
  doc.text('Occupation par cours (moyenne hebdomadaire)', 14, y);

  const sortedClasses = [...state.classes].sort((a, b) => a.day - b.day || a.time.localeCompare(b.time));
  const occupancyRows = sortedClasses.map((cls) => {
    const occ = classOccupancy.find((o) => o.classId === cls.id);
    return [
      cls.name || 'Sans nom',
      DAYS[cls.day],
      cls.time,
      (occ?.byType.trial ?? 0).toFixed(1),
      (occ?.byType.dropin ?? 0).toFixed(1),
      (occ?.byType.package ?? 0).toFixed(1),
      (occ?.byType.annual ?? 0).toFixed(1),
      (occ?.byType.unlimited ?? 0).toFixed(1),
      (occ?.total ?? 0).toFixed(1),
    ];
  });

  autoTable(doc, {
    startY: y + 4,
    head: [['Cours', 'Jour', 'Heure', 'Essais', 'Unités', 'Forfaits', 'Annuels', 'Illimité', 'Total']],
    body: occupancyRows,
    headStyles: { fillColor: BRAND, fontSize: 8 },
    bodyStyles: { fontSize: 8 },
    alternateRowStyles: { fillColor: LIGHT_GRAY },
    columnStyles: {
      3: { halign: 'right' },
      4: { halign: 'right' },
      5: { halign: 'right' },
      6: { halign: 'right' },
      7: { halign: 'right' },
      8: { halign: 'right', fontStyle: 'bold' },
    },
  });

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(160, 160, 160);
    doc.text(
      `Simulateur de Revenus — Généré le ${new Date().toLocaleDateString('fr-FR')}`,
      14,
      doc.internal.pageSize.height - 10
    );
    doc.text(
      `Page ${i}/${pageCount}`,
      doc.internal.pageSize.width - 30,
      doc.internal.pageSize.height - 10
    );
  }

  doc.save('simulation-revenus.pdf');
}
