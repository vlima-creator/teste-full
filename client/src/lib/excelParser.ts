/**
 * Parser para arquivos XLSX do Mercado Livre Full
 * Processa relatórios de estoque e movimentações
 */

import * as XLSX from 'xlsx';
import type {
  StockSummary,
  SalesBoost,
  MovementConsolidated,
  DashboardMetrics,
  UploadedData,
} from '@/types/dashboard';

export async function parseExcelFile(file: File): Promise<UploadedData> {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });

  const stockSummary: StockSummary[] = [];
  const salesBoost: SalesBoost[] = [];
  const movementConsolidated: MovementConsolidated[] = [];

  // Parse Resumo (Stock Summary)
  if (workbook.SheetNames.includes('Resumo')) {
    const sheet = workbook.Sheets['Resumo'];
    const data = XLSX.utils.sheet_to_json(sheet);
    
    stockSummary.push(
      ...data.map((row: any) => {
        const quantity = parseInt(row['Quantidade'] || row['Quantity'] || 0);
        return {
          sku: row.SKU || row.sku || '',
          productName: row['Produto'] || row['Product'] || '',
          quantity,
          status: (quantity < 10 ? 'low_stock' : 'active') as 'active' | 'inactive' | 'low_stock',
          lastUpdate: new Date().toISOString(),
        };
      })
    );
  }

  // Parse Para impulsionar vendas (Sales Boost)
  if (workbook.SheetNames.includes('Para impulsionar vendas')) {
    const sheet = workbook.Sheets['Para impulsionar vendas'];
    const data = XLSX.utils.sheet_to_json(sheet);
    
    salesBoost.push(
      ...data.map((row: any) => {
        const priorityMap: Record<string, 'high' | 'medium' | 'low'> = {
          'Alta': 'high',
          'Média': 'medium',
          'Baixa': 'low',
        };
        return {
          sku: row.SKU || row.sku || '',
          productName: row['Produto'] || row['Product'] || '',
          currentPrice: parseFloat(row['Preço Atual'] || row['Current Price'] || 0),
          recommendedPrice: parseFloat(row['Preço Recomendado'] || row['Recommended Price'] || 0),
          potentialIncrease: parseFloat(row['Aumento Potencial'] || row['Potential Increase'] || 0),
          priority: (priorityMap[row['Prioridade']] || 'low') as 'high' | 'medium' | 'low',
        };
      })
    );
  }

  // Parse Consolidado de movimentações (Movement Consolidated)
  if (workbook.SheetNames.includes('Consolidado de movimentações')) {
    const sheet = workbook.Sheets['Consolidado de movimentações'];
    const data = XLSX.utils.sheet_to_json(sheet);
    
    movementConsolidated.push(
      ...data.map((row: any) => ({
        date: row['Data'] || row['Date'] || new Date().toISOString(),
        sku: row.SKU || row.sku || '',
        productName: row['Produto'] || row['Product'] || '',
        movementType: (row['Tipo'] || row['Type'] || 'entry').toLowerCase() as 'entry' | 'exit' | 'adjustment',
        quantity: parseInt(row['Quantidade'] || row['Quantity'] || 0),
        reason: row['Motivo'] || row['Reason'] || '',
      }))
    );
  }

  // Calculate metrics
  const metrics = calculateMetrics(stockSummary, movementConsolidated);

  return {
    stockSummary,
    salesBoost,
    movementConsolidated,
    metrics,
  };
}

function calculateMetrics(
  stockSummary: StockSummary[],
  movements: MovementConsolidated[]
): DashboardMetrics {
  const totalStock = stockSummary.reduce((sum, item) => sum + item.quantity, 0);
  const lowStockItems = stockSummary.filter((item) => item.status === 'low_stock').length;
  const todayMovements = movements.filter((m) => {
    const movementDate = new Date(m.date).toDateString();
    const today = new Date().toDateString();
    return movementDate === today;
  });

  return {
    totalSKUs: stockSummary.length,
    totalStock,
    lowStockItems,
    movementToday: todayMovements.length,
    averagePrice: 0, // Será calculado se houver dados de preço
    totalValue: 0, // Será calculado se houver dados de preço
  };
}

export function exportToExcel(data: UploadedData, filename: string = 'dashboard-export.xlsx') {
  const workbook = XLSX.utils.book_new();

  // Export Stock Summary
  const stockSheet = XLSX.utils.json_to_sheet(data.stockSummary);
  XLSX.utils.book_append_sheet(workbook, stockSheet, 'Resumo');

  // Export Sales Boost
  const salesSheet = XLSX.utils.json_to_sheet(data.salesBoost);
  XLSX.utils.book_append_sheet(workbook, salesSheet, 'Para impulsionar vendas');

  // Export Movements
  const movementSheet = XLSX.utils.json_to_sheet(data.movementConsolidated);
  XLSX.utils.book_append_sheet(workbook, movementSheet, 'Consolidado de movimentações');

  XLSX.writeFile(workbook, filename);
}
