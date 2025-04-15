import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function ContactPage() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <h1 className="text-3xl font-bold mb-6">Связаться с нами</h1>
      <div className="max-w-md w-full bg-card p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <Badge variant="outline">Контактная информация</Badge>
        </div>
        <p className="mb-4">Email: info@example.com</p>
        <p className="mb-4">Телефон: +7 (123) 456-78-90</p>
        <Button className="w-full">Отправить сообщение</Button>
      </div>
    </div>
  );
}