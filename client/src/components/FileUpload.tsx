/**
 * Componente de upload de arquivos XLSX
 * Aceita relatórios do Mercado Livre Full
 */

import { useState, useRef } from 'react';
import { Upload, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { parseExcelFile } from '@/lib/excelParser';
import type { UploadedData } from '@/types/dashboard';

interface FileUploadProps {
  onDataLoaded: (data: UploadedData) => void;
  isLoading?: boolean;
}

export function FileUpload({ onDataLoaded, isLoading = false }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await processFile(files[0]);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      await processFile(files[0]);
    }
  };

  const processFile = async (file: File) => {
    setError(null);
    setSuccess(false);

    // Validate file type
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      setError('Por favor, envie um arquivo Excel (.xlsx ou .xls)');
      return;
    }

    try {
      const data = await parseExcelFile(file);
      onDataLoaded(data);
      setSuccess(true);
      
      // Reset success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Erro ao processar arquivo. Verifique o formato.'
      );
    }
  };

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative rounded-lg border-2 border-dashed transition-all p-8 text-center cursor-pointer ${
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-primary/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isLoading}
        />

        <div
          onClick={() => fileInputRef.current?.click()}
          className="space-y-3"
        >
          <div className="flex justify-center">
            <Upload className="h-10 w-10 text-muted-foreground" />
          </div>
          
          <div>
            <p className="text-sm font-medium text-foreground">
              Arraste seus arquivos aqui ou clique para selecionar
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Suporta arquivos .xlsx e .xls do Mercado Livre Full
            </p>
          </div>

          <Button
            type="button"
            disabled={isLoading}
            className="mt-4"
          >
            {isLoading ? 'Processando...' : 'Selecionar Arquivo'}
          </Button>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/30 flex gap-2">
          <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {success && (
        <div className="mt-4 p-3 rounded-lg bg-green-500/10 border border-green-500/30 flex gap-2">
          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-green-700">Arquivo carregado com sucesso!</p>
        </div>
      )}
    </div>
  );
}
