/**
 * Dashboard Fulfillment Estratégico
 * Página principal com upload de arquivos e visualizações
 */

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Download, BarChart3, Package, TrendingUp } from 'lucide-react';
import { FileUpload } from '@/components/FileUpload';
import { MetricsGrid } from '@/components/MetricsGrid';
import { StockTable } from '@/components/StockTable';
import {
  StockDistributionChart,
  TopProductsChart,
  MovementTrendChart,
} from '@/components/Charts';
import { exportToExcel } from '@/lib/excelParser';
import type { UploadedData } from '@/types/dashboard';

export default function Home() {
  const [data, setData] = useState<UploadedData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDataLoaded = (uploadedData: UploadedData) => {
    setData(uploadedData);
  };

  const handleExport = () => {
    if (data) {
      const timestamp = new Date().toISOString().split('T')[0];
      exportToExcel(data, `fulfillment-dashboard-${timestamp}.xlsx`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-green-600 to-green-700">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                Dashboard Fulfillment
              </h1>
              <p className="text-xs text-muted-foreground">Estratégico</p>
            </div>
          </div>

          {data && (
            <Button
              onClick={handleExport}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Exportar
            </Button>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {!data ? (
          // Upload Section
          <div className="max-w-2xl mx-auto">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-foreground mb-2">
                Carregue seus Relatórios
              </h2>
              <p className="text-muted-foreground">
                Envie os arquivos XLSX do Mercado Livre Full para começar a análise
              </p>
            </div>

            <FileUpload onDataLoaded={handleDataLoaded} isLoading={isLoading} />

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <div className="p-4 rounded-lg border bg-card">
                <Package className="h-6 w-6 text-blue-600 mb-2" />
                <h3 className="font-semibold text-sm mb-1">Resumo de Estoque</h3>
                <p className="text-xs text-muted-foreground">
                  Visualize todos os SKUs e quantidades
                </p>
              </div>
              <div className="p-4 rounded-lg border bg-card">
                <TrendingUp className="h-6 w-6 text-green-600 mb-2" />
                <h3 className="font-semibold text-sm mb-1">Impulsionar Vendas</h3>
                <p className="text-xs text-muted-foreground">
                  Recomendações de preços e estratégias
                </p>
              </div>
              <div className="p-4 rounded-lg border bg-card">
                <BarChart3 className="h-6 w-6 text-purple-600 mb-2" />
                <h3 className="font-semibold text-sm mb-1">Movimentações</h3>
                <p className="text-xs text-muted-foreground">
                  Tendências e análise de entradas/saídas
                </p>
              </div>
            </div>
          </div>
        ) : (
          // Dashboard Section
          <div className="space-y-8">
            {/* Metrics */}
            <MetricsGrid metrics={data.metrics} />

            {/* Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                <TabsTrigger value="stock">Estoque</TabsTrigger>
                <TabsTrigger value="movements">Movimentações</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <StockDistributionChart data={data.stockSummary} />
                  <TopProductsChart data={data.stockSummary} />
                </div>
              </TabsContent>

              {/* Stock Tab */}
              <TabsContent value="stock" className="space-y-6 mt-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Resumo de Estoque</h3>
                  <StockTable data={data.stockSummary} />
                </div>
              </TabsContent>

              {/* Movements Tab */}
              <TabsContent value="movements" className="space-y-6 mt-6">
                <MovementTrendChart data={data.movementConsolidated} />
              </TabsContent>
            </Tabs>

            {/* Reset Button */}
            <div className="flex justify-center pt-4">
              <Button
                onClick={() => setData(null)}
                variant="outline"
                className="gap-2"
              >
                Carregar Novo Arquivo
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
