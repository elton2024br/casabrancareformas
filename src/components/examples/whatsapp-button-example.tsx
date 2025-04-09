import { WhatsAppButton } from "@/components/ui/whatsapp-button";

export function WhatsAppButtonExample() {
  const phoneNumber = "5511999999999"; // Substitua pelo número de telefone real

  return (
    <div className="flex flex-col gap-4 p-4">
      <h2 className="text-xl font-bold">Exemplos de Botão do WhatsApp</h2>
      
      <div className="flex flex-wrap gap-4">
        {/* Botão padrão (apenas ícone) */}
        <div className="flex flex-col items-center gap-2">
          <WhatsAppButton phoneNumber={phoneNumber} />
          <span className="text-sm text-gray-600">Padrão</span>
        </div>
        
        {/* Botão com texto */}
        <div className="flex flex-col items-center gap-2">
          <WhatsAppButton phoneNumber={phoneNumber} showText />
          <span className="text-sm text-gray-600">Com texto</span>
        </div>
        
        {/* Botão com texto personalizado */}
        <div className="flex flex-col items-center gap-2">
          <WhatsAppButton 
            phoneNumber={phoneNumber} 
            showText 
            text="Solicitar orçamento" 
          />
          <span className="text-sm text-gray-600">Texto personalizado</span>
        </div>
        
        {/* Botão grande */}
        <div className="flex flex-col items-center gap-2">
          <WhatsAppButton 
            phoneNumber={phoneNumber} 
            iconSize={32} 
            className="px-6 py-3"
            showText
          />
          <span className="text-sm text-gray-600">Tamanho grande</span>
        </div>
        
        {/* Botão com mensagem personalizada */}
        <div className="flex flex-col items-center gap-2">
          <WhatsAppButton 
            phoneNumber={phoneNumber}
            message="Olá! Vi seu site e gostaria de falar sobre uma reforma."
            showText
            text="Falar sobre reforma"
          />
          <span className="text-sm text-gray-600">Mensagem personalizada</span>
        </div>
      </div>
    </div>
  );
} 