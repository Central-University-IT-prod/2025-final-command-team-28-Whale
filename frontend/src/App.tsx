import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

function App() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[90vh]">
      <div className="flex flex-col items-center gap-y-4 mb-8">
        <div className="inline-flex items-center gap-x-4">
          <span className="text-6xl">+</span>
        </div>
        <a
          href="https://ui.shadcn.com"
          rel="noopener noreferrer nofollow"
          target="_blank"
        >
          <Badge variant="outline">shadcn/ui</Badge>
        </a>
      </div>
      <div className="flex flex-col items-center gap-4">
        <Button variant="secondary">Кнопка emerald 900</Button>
        <div className="flex gap-2 mt-4">
          <Link to="/about">
            <Button variant="outline">О нас</Button>
          </Link>
          <Link to="/contact">
            <Button variant="outline">Контакты</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}

export default App;