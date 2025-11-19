import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Wand2, Download } from 'lucide-react';

const model = "stabilityai/stable-diffusion-xl-base-1.0";
const HUGGINGFACE_API_URL = `https://router.huggingface.co/hf-inference/models/${model}`;

export function ImageGenerator() {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const HUGGINGFACE_TOKEN = import.meta.env.VITE_HUGGINGFACE_TOKEN;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      setError("Lütfen bir şeyler yazın.");
      return;
    }
    if (!HUGGINGFACE_TOKEN) {
      setError("Hugging Face API anahtarı ayarlanmamış. Lütfen .env dosyasına ekleyin.");
      return;
    }

    setLoading(true);
    setError(null);
    setImageUrl('');

    try {
      const response = await fetch(HUGGINGFACE_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${HUGGINGFACE_TOKEN}`,
        },
        body: JSON.stringify({ inputs: prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP hatası! status: ${response.status}`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setImageUrl(url);
    } catch (err: any) {
      setError(err.message || "Bilinmeyen bir hata oluştu.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (imageUrl && imageRef.current) {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = 'generated_image.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">AI Resim Üretici</CardTitle>
        <CardDescription>Oluşturmak istediğiniz resmi tarif edin. Ne kadar detaylı olursa o kadar iyi!</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid w-full gap-2">
            <Textarea
              placeholder="Gün batımında büyük bir taştan atlayan heybetli bir aslan"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
              disabled={loading}
            />
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Hata</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="aspect-square w-full rounded-lg overflow-hidden border flex items-center justify-center bg-muted/50 relative">
            {loading ? (
              <Skeleton className="w-full h-full" />
            ) : imageUrl ? (
              <img src={imageUrl} alt={prompt} className="w-full h-full object-cover" ref={imageRef} />
            ) : (
              <div className="text-center text-muted-foreground p-4">
                <p>Üretilen resim burada görünecek.</p>
              </div>
            )}
            {imageUrl && (
              <Button
                className="absolute top-2 right-2"
                onClick={handleDownload}
              >
                <Download className="mr-2 h-4 w-4" />
                İndir
              </Button>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={loading}>
            <Wand2 className="mr-2 h-4 w-4" />
            {loading ? 'Üretiliyor...' : 'Resim Üret'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
