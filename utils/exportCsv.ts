export const exportToCSV = (data: any[], filename: string) => {
  if (data.length === 0) return;
  
  const csvRows = [];
  
  // En-têtes
  const headers = Object.keys(data[0]);
  csvRows.push(headers.join(','));
  
  // Données
  for (const row of data) {
    const values = headers.map(header => {
      const escaped = String(row[header]).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }
  
  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  // Vérifier si la méthode msSaveBlob est disponible (pour IE)
  if ((window.navigator as any).msSaveBlob) {
    (window.navigator as any).msSaveBlob(blob, filename);
  } else {
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};