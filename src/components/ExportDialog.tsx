
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Download, Lock, Palette } from 'lucide-react';

interface ExportDialogProps {
  onExport: (options: {
    format: 'html' | 'markdown' | 'json';
    password?: string;
    theme: 'light' | 'gray' | 'dark';
  }) => void;
}

const ExportDialog: React.FC<ExportDialogProps> = ({ onExport }) => {
  const [format, setFormat] = useState<'html' | 'markdown' | 'json'>('html');
  const [theme, setTheme] = useState<'light' | 'gray' | 'dark'>('dark');
  const [password, setPassword] = useState('');
  const [usePassword, setUsePassword] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleExport = () => {
    onExport({
      format,
      theme,
      password: usePassword ? password : undefined
    });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Download className="w-4 h-4 mr-2" />
          Экспорт
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-800 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Экспорт инструкции</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label className="text-white">Формат</Label>
            <Select value={format} onValueChange={(value: 'html' | 'markdown' | 'json') => setFormat(value)}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="html">HTML</SelectItem>
                <SelectItem value="markdown">Markdown</SelectItem>
                <SelectItem value="json">JSON</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {format === 'html' && (
            <div>
              <Label className="text-white flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Тема
              </Label>
              <Select value={theme} onValueChange={(value: 'light' | 'gray' | 'dark') => setTheme(value)}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="light">Светлая</SelectItem>
                  <SelectItem value="gray">Серая</SelectItem>
                  <SelectItem value="dark">Тёмная</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Checkbox
              id="password"
              checked={usePassword}
              onCheckedChange={(checked) => setUsePassword(!!checked)}
              className="border-slate-600"
            />
            <Label htmlFor="password" className="text-white flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Защитить паролем
            </Label>
          </div>

          {usePassword && (
            <div>
              <Label className="text-white">Пароль</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Введите пароль"
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={() => setIsOpen(false)} className="border-slate-600 text-slate-300">
            Отмена
          </Button>
          <Button onClick={handleExport} className="bg-blue-600 hover:bg-blue-700">
            Экспортировать
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExportDialog;
