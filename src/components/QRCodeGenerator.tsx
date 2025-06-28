
import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Download, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface QRCodeGeneratorProps {
  onClose: () => void;
  defaultUrl?: string;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({
  onClose,
  defaultUrl = ''
}) => {
  const [url, setUrl] = useState(defaultUrl);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  const generateQRCode = async () => {
    if (!url.trim()) {
      toast.error('Введите URL для генерации QR-кода');
      return;
    }

    setIsGenerating(true);
    try {
      const qrDataUrl = await QRCode.toDataURL(url, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      setQrCodeDataUrl(qrDataUrl);
      toast.success('QR-код сгенерирован');
    } catch (error) {
      toast.error('Ошибка генерации QR-кода');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadQRCode = () => {
    if (!qrCodeDataUrl) return;

    const link = document.createElement('a');
    link.download = 'qr-code.png';
    link.href = qrCodeDataUrl;
    link.click();
    toast.success('QR-код скачан');
  };

  const copyQRCode = async () => {
    if (!qrCodeDataUrl) return;

    try {
      const response = await fetch(qrCodeDataUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      toast.success('QR-код скопирован в буфер обмена');
    } catch (error) {
      toast.error('Ошибка копирования QR-кода');
    }
  };

  useEffect(() => {
    if (defaultUrl) {
      generateQRCode();
    }
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Генерация QR-кода</h2>
          <Button variant="ghost" onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">URL</label>
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>

          <Button
            onClick={generateQRCode}
            disabled={isGenerating}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {isGenerating ? 'Генерация...' : 'Сгенерировать QR-код'}
          </Button>

          {qrCodeDataUrl && (
            <div className="text-center space-y-4">
              <div className="bg-white p-4 rounded-lg inline-block">
                <img src={qrCodeDataUrl} alt="QR Code" className="mx-auto" />
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={downloadQRCode}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Скачать
                </Button>
                <Button
                  onClick={copyQRCode}
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Копировать
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRCodeGenerator;
