
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AnnouncementAttachment } from '@/contexts/AppContext';
import { FileImage, Globe, FileText, Youtube, X } from 'lucide-react';
import { toast } from 'sonner';

interface AttachmentInputProps {
  attachments: AnnouncementAttachment[];
  onAttachmentsChange: (attachments: AnnouncementAttachment[]) => void;
}

export const AttachmentInput = ({
  attachments,
  onAttachmentsChange,
}: AttachmentInputProps) => {
  const [attachmentType, setAttachmentType] = useState<'image' | 'pdf' | 'youtube' | 'link'>('image');
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [attachmentTitle, setAttachmentTitle] = useState('');

  const handleAddAttachment = () => {
    if (!attachmentUrl) {
      toast.error('URL lampiran harus diisi');
      return;
    }

    // Validate URL format
    try {
      new URL(attachmentUrl);
    } catch (e) {
      toast.error('URL tidak valid');
      return;
    }

    // YouTube URL validation
    if (attachmentType === 'youtube') {
      const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
      if (!youtubeRegex.test(attachmentUrl)) {
        toast.error('URL YouTube tidak valid');
        return;
      }
    }

    const newAttachment: AnnouncementAttachment = {
      type: attachmentType,
      url: attachmentUrl,
      title: attachmentTitle || undefined,
    };

    onAttachmentsChange([...attachments, newAttachment]);
    setAttachmentUrl('');
    setAttachmentTitle('');
  };

  const handleRemoveAttachment = (index: number) => {
    const updatedAttachments = [...attachments];
    updatedAttachments.splice(index, 1);
    onAttachmentsChange(updatedAttachments);
  };

  const getAttachmentTypeIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <FileImage className="w-4 h-4" />;
      case 'pdf':
        return <FileText className="w-4 h-4" />;
      case 'youtube':
        return <Youtube className="w-4 h-4" />;
      case 'link':
        return <Globe className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label>Jenis Lampiran</Label>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant={attachmentType === 'image' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setAttachmentType('image')}
          >
            <FileImage className="mr-1 w-4 h-4" /> Gambar
          </Button>
          <Button
            type="button"
            variant={attachmentType === 'pdf' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setAttachmentType('pdf')}
          >
            <FileText className="mr-1 w-4 h-4" /> PDF
          </Button>
          <Button
            type="button"
            variant={attachmentType === 'youtube' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setAttachmentType('youtube')}
          >
            <Youtube className="mr-1 w-4 h-4" /> YouTube
          </Button>
          <Button
            type="button"
            variant={attachmentType === 'link' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setAttachmentType('link')}
          >
            <Globe className="mr-1 w-4 h-4" /> Website
          </Button>
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="attachment-url">URL {attachmentType === 'image' ? 'Gambar' : 
          attachmentType === 'pdf' ? 'PDF' : 
          attachmentType === 'youtube' ? 'YouTube' : 'Website'}</Label>
        <Input
          id="attachment-url"
          placeholder={`Masukkan URL ${
            attachmentType === 'image' ? 'gambar' : 
            attachmentType === 'pdf' ? 'dokumen PDF' : 
            attachmentType === 'youtube' ? 'video YouTube' : 'website'
          }`}
          value={attachmentUrl}
          onChange={(e) => setAttachmentUrl(e.target.value)}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="attachment-title">Judul Lampiran (Opsional)</Label>
        <Input
          id="attachment-title"
          placeholder="Masukkan judul lampiran (opsional)"
          value={attachmentTitle}
          onChange={(e) => setAttachmentTitle(e.target.value)}
        />
      </div>

      <Button type="button" onClick={handleAddAttachment} size="sm">
        Tambah Lampiran
      </Button>

      {attachments.length > 0 && (
        <div className="border rounded p-4 space-y-2">
          <Label>Lampiran yang ditambahkan:</Label>
          <ul className="space-y-2">
            {attachments.map((attachment, index) => (
              <li key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                <div className="flex items-center gap-2">
                  {getAttachmentTypeIcon(attachment.type)}
                  <span className="text-sm truncate max-w-[300px]">
                    {attachment.title || attachment.url}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveAttachment(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
