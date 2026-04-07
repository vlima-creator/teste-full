/**
 * Componentes de visualização de dados com Recharts
 */

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { StockSummary, MovementConsolidated } from '@/types/dashboard';

interface StockDistributionChartProps {
  data: StockSummary[];
}

export function StockDistributionChart({ data }: StockDistributionChartProps) {
  // Agrupa por status
  const statusCount = {
    active: data.filter((d) => d.status === 'active').length,
    low_stock: data.filter((d) => d.status === 'low_stock').length,
    inactive: data.filter((d) => d.status === 'inactive').length,
  };

  const chartData = [
    { name: 'Ativo', value: statusCount.active, fill: '#10b981' },
    { name: 'Baixo Estoque', value: statusCount.low_stock, fill: '#f59e0b' },
    { name: 'Inativo', value: statusCount.inactive, fill: '#6b7280' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Distribuição de Status</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

interface TopProductsChartProps {
  data: StockSummary[];
}

export function TopProductsChart({ data }: TopProductsChartProps) {
  // Top 10 produtos por quantidade
  const topProducts = data
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 10)
    .map((item) => ({
      name: item.productName.substring(0, 15),
      quantity: item.quantity,
    }));

  if (topProducts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Top 10 Produtos</CardTitle>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground py-8">
          Nenhum dado disponível
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Top 10 Produtos por Quantidade</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topProducts}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="quantity" fill="#3b82f6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

interface MovementTrendChartProps {
  data: MovementConsolidated[];
}

export function MovementTrendChart({ data }: MovementTrendChartProps) {
  // Agrupa movimentações por dia
  const movementByDay: Record<string, { entries: number; exits: number }> = {};

  data.forEach((movement) => {
    const date = new Date(movement.date).toLocaleDateString('pt-BR');
    if (!movementByDay[date]) {
      movementByDay[date] = { entries: 0, exits: 0 };
    }
    if (movement.movementType === 'entry') {
      movementByDay[date].entries += movement.quantity;
    } else if (movement.movementType === 'exit') {
      movementByDay[date].exits += movement.quantity;
    }
  });

  const chartData = Object.entries(movementByDay)
    .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime())
    .slice(-7) // Últimos 7 dias
    .map(([date, counts]) => ({
      date,
      Entradas: counts.entries,
      Saídas: counts.exits,
    }));

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tendência de Movimentações</CardTitle>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground py-8">
          Nenhum dado disponível
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Tendência de Movimentações (Últimos 7 Dias)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="Entradas"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="Saídas"
              stroke="#ef4444"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
