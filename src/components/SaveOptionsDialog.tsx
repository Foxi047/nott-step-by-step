
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { FileText, Download, Lock } from 'lucide-react';

interface SaveOptionsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (options: {
    format: 'html' | 'markdown' | 'json';
    password?: string;
    theme: 'light' | 'gray' | 'dark';
  }) => void;
}

const SaveOptionsDialog: React.FC<SaveOptionsDialogProps> = ({ isOpen, onClose, onSave }) => {
  const [format, setFormat] = useState<'html' | 'markdown' | 'json'>('html');
  const [usePassword, setUsePassword] = useState(false);
  const [password, setPassword] = useState('');
  const [theme, setTheme] = useState<'light' | 'gray' | 'dark'>('dark');

  const handleSave = () => {
    onSave({
      format,
      password: usePassword ? password : undefined,
      theme
    });
    onClose();
    // Сбрасываем состояние
    setFormat('html');
    setUsePassword(false);
    setPassword('');
    setTheme('dark');
  };

  const formatNames = {
    html: 'HTML',
    markdown: 'Markdown',
    json: 'JSON'
  };

  const themeNames = {
    light: 'Светлая',
    gray: 'Серая',
    dark: 'Тёмная'
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 border-slate-600 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Download className="w-5 h-5" />
            Параметры сохранения
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="format" className="text-white">Формат сохранения</Label>
            <Select value={format} onValueChange={(value: 'html' | 'markdown' | 'json') => setFormat(value)}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="html">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    HTML
                  </div>
                </SelectItem>
                <SelectItem value="markdown">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Markdown
                  </div>
                </SelectItem>
                <SelectItem value="json">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    JSON
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {format === 'html' && (
            <>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-white flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Защита паролем
                  </Label>
                  <p className="text-xs text-slate-400">
                    Добавить пароль для просмотра файла
                  </p>
                </div>
                <Switch
                  checked={usePassword}
                  onCheckedChange={setUsePassword}
                />
              </div>

              {usePassword && (
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white">Пароль</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Введите пароль"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="theme" className="text-white">Тема инструкции</Label>
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
            </>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            Отмена
          </Button>
          <Button
            onClick={handleSave}
            disabled={usePassword && !password.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Сохранить {formatNames[format]}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SaveOptionsDialog;
