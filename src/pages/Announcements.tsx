
import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { AttachmentInput } from '@/components/announcements/AttachmentInput';
import { AttachmentDisplay } from '@/components/announcements/AttachmentDisplay';
import { AnnouncementAttachment } from '@/contexts/AppContext';

const Announcements = () => {
  const { currentUser, classes, announcements, addAnnouncement, updateAnnouncement, removeAnnouncement } = useApp();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [selectedAnnouncementId, setSelectedAnnouncementId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [attachments, setAttachments] = useState<AnnouncementAttachment[]>([]);

  const isTeacher = currentUser?.role === 'teacher';

  // Filter announcements based on search term
  const filteredAnnouncements = announcements.filter((announcement) => {
    const matchesSearch = 
      announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!isTeacher) {
      // Students can only see announcements for their classes or global announcements
      const studentClasses = currentUser ? 
        classes.filter(c => c.students.includes(currentUser.id)).map(c => c.id) :
        [];
      return matchesSearch && (
        announcement.classId === null || 
        (announcement.classId && studentClasses.includes(announcement.classId))
      );
    }
    
    return matchesSearch;
  });

  const openAddDialog = () => {
    setTitle('');
    setContent('');
    setSelectedClassId(null);
    setAttachments([]);
    setIsAddDialogOpen(true);
  };

  const openEditDialog = (announcement: any) => {
    setSelectedAnnouncementId(announcement.id);
    setTitle(announcement.title);
    setContent(announcement.content);
    setSelectedClassId(announcement.classId);
    setAttachments(announcement.attachments || []);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (announcementId: string) => {
    setSelectedAnnouncementId(announcementId);
    setIsDeleteDialogOpen(true);
  };

  const handleAddAnnouncement = () => {
    if (!title || !content) {
      toast.error('Judul dan konten pengumuman harus diisi');
      return;
    }

    if (currentUser) {
      addAnnouncement({
        title,
        content,
        date: new Date().toISOString(),
        teacherId: currentUser.id,
        classId: selectedClassId,
        attachments: attachments.length > 0 ? attachments : undefined,
      });
    }

    setIsAddDialogOpen(false);
  };

  const handleEditAnnouncement = () => {
    if (!title || !content) {
      toast.error('Judul dan konten pengumuman harus diisi');
      return;
    }

    if (selectedAnnouncementId) {
      updateAnnouncement(selectedAnnouncementId, {
        title,
        content,
        classId: selectedClassId,
        attachments: attachments.length > 0 ? attachments : undefined,
      });
    }

    setIsEditDialogOpen(false);
  };

  const handleDeleteAnnouncement = () => {
    if (selectedAnnouncementId) {
      removeAnnouncement(selectedAnnouncementId);
    }

    setIsDeleteDialogOpen(false);
  };

  const getClassName = (classId: string | null) => {
    if (!classId) return 'Semua Kelas';
    const classItem = classes.find((c) => c.id === classId);
    return classItem ? classItem.name : '-';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Pengumuman</h1>
            <p className="text-muted-foreground">
              {isTeacher 
                ? 'Kelola pengumuman untuk siswa dan kelas' 
                : 'Lihat pengumuman dari guru'}
            </p>
          </div>
          {isTeacher && (
            <Button onClick={openAddDialog}>Tambah Pengumuman</Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Input
            placeholder="Cari pengumuman..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <div className="space-y-4">
          {filteredAnnouncements.length > 0 ? (
            filteredAnnouncements
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((announcement) => (
                <div
                  key={announcement.id}
                  className="rounded-lg border bg-card text-card-foreground shadow-sm"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">{announcement.title}</h3>
                      {isTeacher && (
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(announcement)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => openDeleteDialog(announcement.id)}
                          >
                            Hapus
                          </Button>
                        </div>
                      )}
                    </div>
                    <div className="mt-1 flex text-sm text-muted-foreground">
                      <p>
                        {formatDate(announcement.date)} • {getClassName(announcement.classId)}
                      </p>
                    </div>
                    <div className="mt-4 whitespace-pre-line">{announcement.content}</div>
                    {announcement.attachments && (
                      <AttachmentDisplay attachments={announcement.attachments} />
                    )}
                  </div>
                </div>
              ))
          ) : (
            <div className="text-center py-8">
              <p className="text-lg text-muted-foreground">
                {searchTerm ? 'Tidak ada pengumuman yang sesuai dengan pencarian' : 'Belum ada pengumuman'}
              </p>
            </div>
          )}
        </div>
      </div>

      {isTeacher && (
        <>
          {/* Add Announcement Dialog */}
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Tambah Pengumuman Baru</DialogTitle>
                <DialogDescription>
                  Isi formulir di bawah ini untuk membuat pengumuman baru.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Judul</Label>
                  <Input
                    id="title"
                    placeholder="Masukkan judul pengumuman"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="content">Konten</Label>
                  <Textarea
                    id="content"
                    placeholder="Masukkan isi pengumuman"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={5}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="class">Kelas</Label>
                  <Select
                    value={selectedClassId || 'all'}
                    onValueChange={(value) => setSelectedClassId(value === 'all' ? null : value)}
                  >
                    <SelectTrigger id="class">
                      <SelectValue placeholder="Pilih kelas (kosongkan untuk semua kelas)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Kelas</SelectItem>
                      {classes.map((classItem) => (
                        <SelectItem key={classItem.id} value={classItem.id}>
                          {classItem.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Lampiran</Label>
                  <AttachmentInput 
                    attachments={attachments} 
                    onAttachmentsChange={setAttachments} 
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Batal
                </Button>
                <Button onClick={handleAddAnnouncement}>Simpan</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Edit Announcement Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Pengumuman</DialogTitle>
                <DialogDescription>Ubah pengumuman yang dipilih.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-title">Judul</Label>
                  <Input
                    id="edit-title"
                    placeholder="Masukkan judul pengumuman"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-content">Konten</Label>
                  <Textarea
                    id="edit-content"
                    placeholder="Masukkan isi pengumuman"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={5}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-class">Kelas</Label>
                  <Select
                    value={selectedClassId || 'all'}
                    onValueChange={(value) => setSelectedClassId(value === 'all' ? null : value)}
                  >
                    <SelectTrigger id="edit-class">
                      <SelectValue placeholder="Pilih kelas (kosongkan untuk semua kelas)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Kelas</SelectItem>
                      {classes.map((classItem) => (
                        <SelectItem key={classItem.id} value={classItem.id}>
                          {classItem.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Lampiran</Label>
                  <AttachmentInput 
                    attachments={attachments} 
                    onAttachmentsChange={setAttachments} 
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Batal
                </Button>
                <Button onClick={handleEditAnnouncement}>Simpan Perubahan</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Hapus Pengumuman</DialogTitle>
                <DialogDescription>
                  Apakah Anda yakin ingin menghapus pengumuman ini? Tindakan ini tidak dapat dibatalkan.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                  Batal
                </Button>
                <Button variant="destructive" onClick={handleDeleteAnnouncement}>
                  Hapus
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </AppLayout>
  );
};

export default Announcements;
