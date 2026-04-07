/**
 * Tipos de dados para o Dashboard Fulfillment Estratégico
 * Estrutura baseada nos relatórios do Mercado Livre Full
 */

export interface StockSummary {
  sku: string;
  productName: string;
  quantity: number;
  status: 'active' | 'inactive' | 'low_stock';
  lastUpdate: string;
}

export interface SalesBoost {
  sku: string;
  productName: string;
  currentPrice: number;
  recommendedPrice: number;
  potentialIncrease: number;
  priority: 'high' | 'medium' | 'low';
}

export interface MovementConsolidated {
  date: string;
  sku: string;
  productName: string;
  movementType: 'entry' | 'exit' | 'adjustment';
  quantity: number;
  reason: string;
}

export interface DashboardMetrics {
  totalSKUs: number;
  totalStock: number;
  lowStockItems: number;
  movementToday: number;
  averagePrice: number;
  totalValue: number;
}

export interface UploadedData {
  stockSummary: StockSummary[];
  salesBoost: SalesBoost[];
  movementConsolidated: MovementConsolidated[];
  metrics: DashboardMetrics;
}
