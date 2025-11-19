import { ImageGenerator } from './components/ImageGenerator';
import { ModeToggle } from './components/mode-toggle';
import { Bot } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="py-4 px-4 sm:px-6 border-b">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Bot className="h-6 w-6" />
            <h1 className="text-xl font-semibold">Codeland Resim Üretme AI</h1>
          </div>
          <ModeToggle />
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 sm:px-6 py-8">
        <ImageGenerator />
      </main>

      <footer className="py-4 px-4 sm:px-6 border-t">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          Codeland tarafından yapıldı.
        </div>
      </footer>
    </div>
  );
}

export default App;
