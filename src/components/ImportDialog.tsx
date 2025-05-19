
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { File, FileInput } from 'lucide-react';

interface ImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onImport: (file: File) => Promise<void>;
  onDownloadTemplate: () => void;
}

const ImportDialog = ({
  open,
  onOpenChange,
  title,
  description,
  onImport,
  onDownloadTemplate,
}: ImportDialogProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progressMessage, setProgressMessage] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
      setProgressMessage(null);
    }
  };

  const handleImport = async () => {
    if (!file) {
      setError('Silakan pilih file Excel terlebih dahulu');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setProgressMessage('Memproses data...');
      await onImport(file);
      setProgressMessage('Data berhasil diimpor!');
      setTimeout(() => {
        onOpenChange(false);
        setProgressMessage(null);
      }, 1500);
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : 'Terjadi kesalahan saat mengimpor data'}`);
      setProgressMessage(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-6">
          <div>
            <Button 
              variant="outline"
              className="w-full flex items-center gap-2"
              onClick={onDownloadTemplate}
            >
              <File className="h-4 w-4" />
              <span>Download Template Excel</span>
            </Button>
          </div>
          <div className="grid gap-2">
            <label
              htmlFor="file-upload"
              className="flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-gray-300 p-6 hover:border-gray-400"
            >
              <div className="flex flex-col items-center gap-1">
                <FileInput className="h-8 w-8 text-muted-foreground" />
                <span className="text-sm font-medium">
                  {file ? file.name : 'Klik untuk memilih file Excel'}
                </span>
                <span className="text-xs text-muted-foreground">
                  File harus dalam format .xlsx
                </span>
              </div>
              <input
                id="file-upload"
                type="file"
                accept=".xlsx"
                className="sr-only"
                onChange={handleFileChange}
              />
            </label>
            {error && <p className="text-sm text-destructive">{error}</p>}
            {progressMessage && <p className="text-sm text-green-600">{progressMessage}</p>}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button onClick={handleImport} disabled={!file || isLoading}>
            {isLoading ? 'Memproses...' : 'Import Data'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportDialog;
