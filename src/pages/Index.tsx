import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { currentUser } = useApp();
  const navigate = useNavigate();
  const [showCarousel, setShowCarousel] = useState(true);

  // Redirect to appropriate page based on authentication status
  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard');
      setShowCarousel(false);
    }
    
    // If user is not logged in, we keep showing the carousel and login button
  }, [currentUser, navigate]);

  const handleLoginClick = () => {
    navigate('/login');
  };

  // Images for the carousel
  const carouselImages = [
    {
      src: "/lovable-uploads/e4b0ae67-350d-4030-a252-8ef0a3603e5a.png",
      alt: "Murid-murid SD sedang belajar komputer",
      caption: "Ruang Laboratorium Komputer"
    },
    {
      src: "/lovable-uploads/002f9069-7e90-489e-a185-dee9eadc3502.png",
      alt: "Kegiatan belajar mengajar di kelas",
      caption: "Suasana Belajar Kelas"
    },
    {
      src: "/lovable-uploads/33b5b66a-d821-47ff-afcb-8fc24894922a.png",
      alt: "Kegiatan sekolah dengan guru dan staf",
      caption: "Event Gelar Karya Pancasila"
    },
    {
      src: "/lovable-uploads/df47ce46-843c-4520-a67b-4a0722665958.png",
      alt: "Kegiatan murid SD di acara sekolah",
      caption: "Perayaan Tahun Baru Islam"
    },
  ];

  if (!showCarousel) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <div className="container mx-auto px-4 py-12 flex flex-col items-center">
        <div className="flex items-center mb-8">
          <img
            src="/lovable-uploads/ad41bcbd-cb29-472a-a417-02112b3f8800.png"
            alt="SD Negeri Sukabumi 2"
            className="h-24 w-24 mr-4 school-logo"
          />
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-primary">SD Negeri Sukabumi 2</h1>
            <p className="text-lg text-gray-600">Sistem Informasi Kelas</p>
          </div>
        </div>
        
        <div className="w-full max-w-5xl mb-12 rounded-xl overflow-hidden shadow-2xl">
          <Carousel className="w-full">
            <CarouselContent>
              {carouselImages.map((image, index) => (
                <CarouselItem key={index}>
                  <Card className="border-0 rounded-xl overflow-hidden">
                    <CardContent className="p-0 relative">
                      <img 
                        src={image.src} 
                        alt={image.alt} 
                        className="w-full h-[70vh] object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-4">
                        <p className="text-xl font-medium">{image.caption}</p>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
        </div>
        
        <div className="text-center">
          <Button 
            onClick={handleLoginClick}
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-white text-lg font-medium px-10 py-6 rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            Masuk ke Sistem
          </Button>
          
          <p className="mt-8 text-gray-600 max-w-xl mx-auto text-center">
            Selamat datang di Sistem Informasi Kelas SD Negeri Sukabumi 2. 
            Platform ini menyediakan informasi kelas, nilai, kehadiran, dan pengumuman 
            untuk guru dan siswa.
          </p>
        </div>
        
        <footer className="mt-16 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} SD Negeri Sukabumi 2. Hak Cipta Dilindungi.</p>
          <p className="mt-1">Dibuat oleh Samsul Badrus Saleh</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
