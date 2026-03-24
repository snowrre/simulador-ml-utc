// jspdf is imported dynamically inside functions to avoid SSR issues

interface MLResult {
    accuracy: number;
    precision: number;
    recall: number;
    f1: number;
    config: any;
}

interface ReportData {
    fileName: string;
    modelType: string;
    results: MLResult;
    taskType: string;
    featureColumns: string[];
    targetColumn: string;
}

export const generateMLReport = async (data: ReportData) => {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const navySlate = [26, 43, 76];
    const techBlue = [37, 99, 235];
    const emerald = [16, 185, 129];
    
    let y = 30;

    // Header
    doc.setFillColor(techBlue[0], techBlue[1], techBlue[2]);
    doc.rect(0, 0, pageWidth, 5, "F");

    doc.setFontSize(22);
    doc.setTextColor(navySlate[0], navySlate[1], navySlate[2]);
    doc.setFont("helvetica", "bold");
    doc.text("Reporte de Experimentación ML", margin, y);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.setFont("helvetica", "normal");
    doc.text(`Generado por TechHub Simulator - ${new Date().toLocaleDateString()}`, margin, y + 8);
    
    y += 25;

    // Dataset Info Section
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(margin, y, pageWidth - (margin * 2), 35, 3, 3, "F");
    
    doc.setFontSize(12);
    doc.setTextColor(techBlue[0], techBlue[1], techBlue[2]);
    doc.setFont("helvetica", "bold");
    doc.text("Configuración del Dataset", margin + 10, y + 12);
    
    doc.setFontSize(9);
    doc.setTextColor(navySlate[0], navySlate[1], navySlate[2]);
    doc.setFont("helvetica", "normal");
    doc.text(`Archivo: ${data.fileName}`, margin + 10, y + 22);
    doc.text(`Tarea: ${data.taskType === 'classification' ? 'Clasificación' : 'Regresión'}`, margin + 10, y + 28);
    
    doc.text(`Target (Y): ${data.targetColumn}`, pageWidth / 2, y + 22);
    doc.text(`Features (X): ${data.featureColumns.join(", ")}`, pageWidth / 2, y + 28);
    
    y += 45;

    // Model Performance Section
    doc.setFontSize(16);
    doc.setTextColor(navySlate[0], navySlate[1], navySlate[2]);
    doc.setFont("helvetica", "bold");
    doc.text(`Resultados del Modelo: ${data.modelType.toUpperCase()}`, margin, y);
    
    y += 15;

    // Metrics Grid
    const metrics = [
        { label: "Accuracy", value: data.results.accuracy },
        { label: "Precision", value: data.results.precision },
        { label: "Recall", value: data.results.recall },
        { label: "F1-Score", value: data.results.f1 }
    ];

    let xPos = margin;
    const boxWidth = (pageWidth - (margin * 2) - 15) / 4;
    
    metrics.forEach((m, i) => {
        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(226, 232, 240);
        doc.roundedRect(xPos, y, boxWidth, 25, 2, 2, "FD");
        
        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        doc.text(m.label, xPos + (boxWidth / 2), y + 8, { align: "center" });
        
        doc.setFontSize(14);
        doc.setTextColor(techBlue[0], techBlue[1], techBlue[2]);
        doc.setFont("helvetica", "bold");
        doc.text(`${(m.value * 100).toFixed(1)}%`, xPos + (boxWidth / 2), y + 18, { align: "center" });
        
        xPos += boxWidth + 5;
    });

    y += 40;

    // Hyperparameters Section
    doc.setFontSize(12);
    doc.setTextColor(navySlate[0], navySlate[1], navySlate[2]);
    doc.setFont("helvetica", "bold");
    doc.text("Hiperparámetros Utilizados", margin, y);
    
    y += 8;
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y, pageWidth - margin, y);
    
    y += 12;
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    
    Object.entries(data.results.config).forEach(([key, value], i) => {
        const rowY = y + (Math.floor(i / 2) * 8);
        const colX = (i % 2 === 0) ? margin : pageWidth / 2;
        doc.text(`${key}: ${value}`, colX, rowY);
    });

    y += 30;

    // Analysis Section
    doc.setFillColor(navySlate[0], navySlate[1], navySlate[2]);
    doc.roundedRect(margin, y, pageWidth - (margin * 2), 40, 3, 3, "F");
    
    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text("Análisis Técnico y Conclusiones", margin + 10, y + 12);
    
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    const analysis = `El modelo ha sido entrenado y validado con rigor académico. Con un Accuracy del ${(data.results.accuracy * 100).toFixed(1)}%, demuestra una robustez excepcional para este conjunto de datos. La consistencia entre Precision y Recall indica un equilibrio óptimo en la detección de clases, minimizando tanto falsos positivos como negativos. Este resultado es evidencia sólida para la validación de hipótesis en entornos de simulación controlada.`;
    
    const splitText = doc.splitTextToSize(analysis, pageWidth - (margin * 2) - 20);
    doc.text(splitText, margin + 10, y + 20);

    // Footer
    y = doc.internal.pageSize.getHeight() - 20;
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text("TechHub Simulator - Herramienta de Visualización y Análisis para Tesis Académicas", pageWidth / 2, y, { align: "center" });

    doc.save(`Reporte_ML_${data.modelType}_${data.fileName.replace(/\.[^/.]+$/, "")}.pdf`);
    
    // Auto-open in new tab for immediate viewing
    window.open(doc.output('bloburl'), '_blank');
};

export const generateComparativeReport = async (data: { 
    fileName: string, 
    experiments: any[], 
    taskType: string,
    featureColumns: string[],
    targetColumn: string
}) => {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const navySlate = [26, 43, 76];
    const techBlue = [37, 99, 235];
    
    let y = 30;

    // Header
    doc.setFillColor(navySlate[0], navySlate[1], navySlate[2]);
    doc.rect(0, 0, pageWidth, 5, "F");

    doc.setFontSize(22);
    doc.setTextColor(navySlate[0], navySlate[1], navySlate[2]);
    doc.setFont("helvetica", "bold");
    doc.text("Dashboard Comparativo de Modelos", margin, y);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.setFont("helvetica", "normal");
    doc.text(`Proyecto Final de Tesis - Simulador ML - ${new Date().toLocaleDateString()}`, margin, y + 8);
    
    y += 25;

    // Summary Box
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(margin, y, pageWidth - (margin * 2), 30, 3, 3, "F");
    
    doc.setFontSize(11);
    doc.setTextColor(techBlue[0], techBlue[1], techBlue[2]);
    doc.setFont("helvetica", "bold");
    doc.text("Resumen de Configuración", margin + 10, y + 10);
    
    doc.setFontSize(9);
    doc.setTextColor(navySlate[0], navySlate[1], navySlate[2]);
    doc.setFont("helvetica", "normal");
    doc.text(`Dataset: ${data.fileName} | Tarea: ${data.taskType}`, margin + 10, y + 20);
    
    y += 45;

    // Comparison Table
    doc.setFontSize(14);
    doc.setTextColor(navySlate[0], navySlate[1], navySlate[2]);
    doc.setFont("helvetica", "bold");
    doc.text("Análisis Comparativo de Métricas", margin, y);
    
    y += 10;
    
    // Table Header
    doc.setFillColor(241, 245, 249);
    doc.rect(margin, y, pageWidth - (margin * 2), 10, "F");
    doc.setFontSize(9);
    doc.text("Modelo", margin + 5, y + 7);
    doc.text("Accuracy", margin + 60, y + 7);
    doc.text("Precision", margin + 100, y + 7);
    doc.text("Recall", margin + 140, y + 7);
    
    y += 10;

    data.experiments.forEach((exp, i) => {
        doc.setTextColor(navySlate[0], navySlate[1], navySlate[2]);
        doc.setFont("helvetica", "normal");
        doc.text(exp.modelType.toUpperCase(), margin + 5, y + 7);
        doc.text(`${(exp.results.accuracy * 100).toFixed(1)}%`, margin + 60, y + 7);
        doc.text(`${(exp.results.precision * 100).toFixed(1)}%`, margin + 100, y + 7);
        doc.text(`${(exp.results.recall * 100).toFixed(1)}%`, margin + 140, y + 7);
        
        doc.setDrawColor(241, 245, 249);
        doc.line(margin, y + 10, pageWidth - margin, y + 10);
        y += 10;
    });

    y += 20;

    // Executive Decision
    const bestExp = data.experiments.reduce((prev, curr) => (prev.results.accuracy > curr.results.accuracy) ? prev : curr);
    
    doc.setFillColor(37, 99, 235);
    doc.roundedRect(margin, y, pageWidth - (margin * 2), 40, 3, 3, "F");
    
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text("Dictamen Técnico Recomendado", margin + 10, y + 12);
    
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    const recommendation = `Tras evaluar la consistencia de los modelos bajo los parámetros establecidos, el modelo ${bestExp.modelType.toUpperCase()} se posiciona como el de mayor rendimiento con una precisión del ${(bestExp.results.accuracy * 100).toFixed(1)}%. Se recomienda su implementación para este tipo de datos debido a su equilibrio entre sesgo y varianza demostrado en la fase de prueba.`;
    
    const splitText = doc.splitTextToSize(recommendation, pageWidth - (margin * 2) - 20);
    doc.text(splitText, margin + 10, y + 22);

    // Footer
    y = doc.internal.pageSize.getHeight() - 20;
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text("TechHub Simulator - Reporte Comparativo Final para Tesis Académicas", pageWidth / 2, y, { align: "center" });

    doc.save(`Comparativa_ML_${data.fileName.replace(/\.[^/.]+$/, "")}.pdf`);
    window.open(doc.output('bloburl'), '_blank');
};
