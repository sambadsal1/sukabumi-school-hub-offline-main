
import { AnnouncementAttachment } from '@/contexts/AppContext';
import { FileImage, Globe, FileText, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AttachmentDisplayProps {
  attachments: AnnouncementAttachment[];
}

export const AttachmentDisplay = ({ attachments }: AttachmentDisplayProps) => {
  if (!attachments || attachments.length === 0) return null;

  const getAttachmentIcon = (type: string) => {
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

  const renderAttachment = (attachment: AnnouncementAttachment) => {
    const { type, url, title } = attachment;
    
    switch (type) {
      case 'image':
        return (
          <div className="space-y-1">
            <p className="text-sm font-medium">{title || 'Gambar'}</p>
            <div className="border rounded overflow-hidden">
              <img src={url} alt={title || 'Lampiran gambar'} className="max-w-full h-auto object-contain max-h-64" />
            </div>
          </div>
        );
      case 'pdf':
      case 'link':
      case 'youtube':
        return (
          <Button 
            variant="outline" 
            className="flex items-center gap-2 w-full justify-start"
            asChild
          >
            <a href={url} target="_blank" rel="noopener noreferrer">
              {getAttachmentIcon(type)}
              <span>{title || (type === 'youtube' ? 'Video YouTube' : type === 'pdf' ? 'Dokumen PDF' : 'Link Website')}</span>
            </a>
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mt-4 space-y-3">
      <h4 className="font-medium">Lampiran:</h4>
      <div className="space-y-3">
        {attachments.map((attachment, index) => (
          <div key={index}>
            {renderAttachment(attachment)}
          </div>
        ))}
      </div>
    </div>
  );
};
