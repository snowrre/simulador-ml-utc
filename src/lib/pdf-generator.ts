import { jsPDF } from "jspdf";
import { Solution } from "@/data/solutions";

interface QuoteData {
    folio: string;
    clientName: string;
    clientEmail: string;
    solution: Solution;
    numLicenses: number;
    selectedModules: string[];
    totalMonthly: number;
    totalOneTime: number;
    date: string;
    hasPersonalization?: boolean;
}

export const generateQuotePDF = (data: QuoteData) => {
    const doc = new jsPDF();
    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const navySlate = [26, 43, 76];
    const techBlue = [37, 99, 235];
    const lightGray = [100, 116, 139];
    const dividerGray = [226, 232, 240];

    let y = 25;

    // --- Header / Branding ---
    // Thin accent bar at the top
    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, pageWidth, 2, "F");

    // Company Logo (Matching Website Style)
    const logoSize = 12;
    const logoX = margin;
    const logoY = y - 5;

    // Blue Square
    doc.setFillColor(37, 99, 235); // Tech Blue
    // Approximating rounded-xl with a small rectangle or just a sharp one for minimalism
    // jsPDF doesn't have a built-in "rounded rect" that supports all versions easily, 
    // but the latest versions do. Let's use a standard rect for now or a very simple one.
    doc.roundedRect(logoX, logoY, logoSize, logoSize, 2, 2, "F");

    // White 'H'
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("H", logoX + (logoSize / 2), logoY + (logoSize / 2) + 4, { align: "center" });

    doc.setFontSize(24);
    doc.setTextColor(navySlate[0], navySlate[1], navySlate[2]);
    doc.setFont("helvetica", "bold");
    doc.text("The Tech Hub", margin + 16, y + 4);

    doc.setFontSize(9);
    doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.setFont("helvetica", "normal");
    doc.text("Ecosistema de Soluciones SaaS", margin + 15, y + 9);

    // Proposal ID and Date (Top Right)
    doc.setFontSize(10);
    doc.setTextColor(navySlate[0], navySlate[1], navySlate[2]);
    doc.setFont("helvetica", "bold");
    doc.text(`PROPUESTA FORMAL`, pageWidth - margin, y, { align: "right" });

    doc.setFontSize(14);
    doc.setTextColor(techBlue[0], techBlue[1], techBlue[2]);
    doc.text(data.folio, pageWidth - margin, y + 8, { align: "right" });

    doc.setFontSize(9);
    doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.setFont("helvetica", "normal");
    doc.text(data.date, pageWidth - margin, y + 14, { align: "right" });

    y += 40;

    // --- Information Section ---
    doc.setDrawColor(dividerGray[0], dividerGray[1], dividerGray[2]);
    doc.line(margin, y, pageWidth - margin, y);
    y += 12;

    // Client Info (Left)
    doc.setFontSize(8);
    doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.setFont("helvetica", "bold");
    doc.text("PREPARADO PARA:", margin, y);

    doc.setFontSize(11);
    doc.setTextColor(navySlate[0], navySlate[1], navySlate[2]);
    doc.setFont("helvetica", "bold");
    doc.text(data.clientName.toUpperCase(), margin, y + 6);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(data.clientEmail, margin, y + 11);

    // Solution Info (Right)
    doc.setFontSize(8);
    doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.setFont("helvetica", "bold");
    doc.text("SOLUCIÓN SELECCIONADA:", pageWidth / 2, y);

    doc.setFontSize(11);
    doc.setTextColor(techBlue[0], techBlue[1], techBlue[2]);
    doc.setFont("helvetica", "bold");
    doc.text(data.solution.name, pageWidth / 2, y + 6);

    doc.setFontSize(9);
    doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.setFont("helvetica", "normal");
    doc.text(data.solution.category, pageWidth / 2, y + 11);

    y += 35;

    // --- Configuration Details ---
    doc.setFontSize(10);
    doc.setTextColor(navySlate[0], navySlate[1], navySlate[2]);
    doc.setFont("helvetica", "bold");
    doc.text("DESGLOSE DE SERVICIOS", margin, y);
    y += 4;
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;

    // Table Header
    doc.setFontSize(8);
    doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.text("DESCRIPCIÓN", margin, y);
    doc.text("CANTIDAD", pageWidth - margin - 60, y, { align: "right" });
    doc.text("VALOR ESTIMADO", pageWidth - margin, y, { align: "right" });
    y += 6;

    // Table Content
    doc.setFontSize(10);
    doc.setTextColor(51, 65, 85);
    doc.setFont("helvetica", "normal");

    // 1. Licenses
    doc.text(`Licencias de Usuario (${data.solution.name})`, margin, y);
    doc.text(`${data.numLicenses}`, pageWidth - margin - 60, y, { align: "right" });
    const licenseCost = (data.solution.licensePrice || 0) * (data.solution.includedLicenses === 0 ? data.numLicenses : Math.max(0, data.numLicenses - (data.solution.includedLicenses || 0)));
    doc.setFont("helvetica", "bold");
    doc.text(`$${licenseCost.toLocaleString()}`, pageWidth - margin, y, { align: "right" });
    doc.setFont("helvetica", "normal");
    y += 10;

    // 2. Base Price / Setup
    if (data.solution.setupFee > 0) {
        doc.text("Implementación y Configuración Inicial (Setup)", margin, y);
        doc.text("1", pageWidth - margin - 60, y, { align: "right" });
        doc.setFont("helvetica", "bold");
        doc.text(`$${data.solution.setupFee.toLocaleString()}`, pageWidth - margin, y, { align: "right" });
        doc.setFont("helvetica", "normal");
        y += 10;
    }

    // 3. Modules
    data.selectedModules.forEach(modId => {
        const mod = data.solution.modules.find(m => m.id === modId) || { name: modId, price: 0, type: 'monthly' };
        doc.text(`Módulo: ${mod.name}`, margin, y);
        doc.text("1", pageWidth - margin - 60, y, { align: "right" });
        doc.setFont("helvetica", "bold");
        doc.text(`$${mod.price.toLocaleString()}`, pageWidth - margin, y, { align: "right" });
        doc.setFont("helvetica", "normal");
        y += 10;
    });

    // 4. Personalization Legend (IF APPLICABLE)
    if (data.hasPersonalization) {
        y += 5;
        doc.setFillColor(248, 250, 252);
        doc.roundedRect(margin, y, pageWidth - (margin * 2), 18, 2, 2, "F");
        
        doc.setFontSize(8);
        doc.setTextColor(techBlue[0], techBlue[1], techBlue[2]);
        doc.setFont("helvetica", "bold");
        doc.text("PERSONALIZACIÓN SOLICITADA", margin + 5, y + 6);
        
        doc.setFontSize(8);
        doc.setTextColor(navySlate[0], navySlate[1], navySlate[2]);
        doc.setFont("helvetica", "italic");
        const persText = "Se ha adjuntado un resumen de requerimientos específicos. Estaremos trabajando en su análisis técnico; el precio final y los tiempos de entrega podrían variar respecto a este estimado inicial.";
        const splitPers = doc.splitTextToSize(persText, pageWidth - (margin * 2) - 10);
        doc.text(splitPers, margin + 5, y + 11);
        y += 25;
    }

    y += 15;

    // --- Totals Section ---
    doc.setDrawColor(dividerGray[0], dividerGray[1], dividerGray[2]);
    doc.line(pageWidth / 2, y, pageWidth - margin, y);
    y += 12;

    const summaryX = pageWidth / 2;

    // Recurring
    doc.setFontSize(9);
    doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.text("Suscripción Mensual Recurrente:", summaryX, y);
    doc.setFontSize(14);
    doc.setTextColor(16, 185, 129); // Emerald
    doc.setFont("helvetica", "bold");
    doc.text(`$${data.totalMonthly.toLocaleString()}`, pageWidth - margin, y + 1, { align: "right" });
    y += 12;

    // One-time
    doc.setFontSize(9);
    doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.setFont("helvetica", "normal");
    doc.text("Inversión Inicial (Setup/Únicos):", summaryX, y);
    doc.setFontSize(11);
    doc.setTextColor(navySlate[0], navySlate[1], navySlate[2]);
    doc.setFont("helvetica", "bold");
    doc.text(`$${data.totalOneTime.toLocaleString()}`, pageWidth - margin, y, { align: "right" });

    // --- Final Footer ---
    y = doc.internal.pageSize.getHeight() - 35;

    doc.setDrawColor(dividerGray[0], dividerGray[1], dividerGray[2]);
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;

    doc.setFontSize(8);
    doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.setFont("helvetica", "normal");
    const footerText = "Esta es una propuesta preliminar sujeta a cambios tras la validación técnica final. Los precios no incluyen impuestos locales aplicables. Generado automáticamente por el ecosistema digital The Tech Hub.";
    const splitFooter = doc.splitTextToSize(footerText, pageWidth - (margin * 2));
    doc.text(splitFooter, pageWidth / 2, y, { align: "center" });

    doc.setFontSize(7);
    doc.text("thetechhub.com | Privacidad y Transparencia en Tecnología B2B", pageWidth / 2, y + 12, { align: "center" });

    // Open in new tab and Download
    const blob = doc.output('blob');
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');

    doc.save(`Propuesta_${data.folio}_${data.solution.name.replace(/\s+/g, '_')}.pdf`);
};
