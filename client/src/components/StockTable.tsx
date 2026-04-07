/**
 * Tabela de resumo de estoque
 */

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import type { StockSummary } from '@/types/dashboard';

interface StockTableProps {
  data: StockSummary[];
}

export function StockTable({ data }: StockTableProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'low_stock':
        return (
          <Badge variant="destructive" className="flex gap-1 w-fit">
            <AlertTriangle className="h-3 w-3" />
            Baixo Estoque
          </Badge>
        );
      case 'active':
        return (
          <Badge variant="default" className="flex gap-1 w-fit bg-green-600">
            <CheckCircle2 className="h-3 w-3" />
            Ativo
          </Badge>
        );
      case 'inactive':
        return (
          <Badge variant="secondary" className="flex gap-1 w-fit">
            Inativo
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhum dado de estoque disponível
      </div>
    );
  }

  return (
    <div className="rounded-lg border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-semibold">SKU</TableHead>
            <TableHead className="font-semibold">Produto</TableHead>
            <TableHead className="text-right font-semibold">Quantidade</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="text-right text-xs text-muted-foreground">
              Atualizado
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.slice(0, 10).map((item) => (
            <TableRow key={item.sku} className="hover:bg-muted/50 transition-colors">
              <TableCell className="font-mono text-sm font-medium">
                {item.sku}
              </TableCell>
              <TableCell className="max-w-xs truncate">{item.productName}</TableCell>
              <TableCell className="text-right font-semibold">
                {item.quantity.toLocaleString('pt-BR')}
              </TableCell>
              <TableCell>{getStatusBadge(item.status)}</TableCell>
              <TableCell className="text-right text-xs text-muted-foreground">
                {new Date(item.lastUpdate).toLocaleDateString('pt-BR')}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {data.length > 10 && (
        <div className="px-6 py-3 text-sm text-muted-foreground border-t bg-muted/30">
          Mostrando 10 de {data.length} itens
        </div>
      )}
    </div>
  );
}
