
interface ProjectDescriptionProps {
  description?: string;
  details?: {
    materials?: string[];
    techniques?: string[];
    duration?: string;
    challenges?: string;
    outcome?: string;
  }
}

export function ProjectDescription({ 
  description, 
  details 
}: ProjectDescriptionProps = {}) {
  // Default description if none is provided
  const defaultDescription = `Este projeto foi concebido para transformar um apartamento convencional em um espaço moderno e funcional, 
    atendendo às necessidades específicas dos moradores. O conceito aberto foi adotado para criar uma sensação 
    de amplitude, integrando os ambientes sociais.
    
    Utilizamos uma paleta de cores neutras como base, complementada por toques de cores em elementos decorativos 
    estratégicos. A iluminação foi cuidadosamente planejada para criar diferentes atmosferas, dependendo da 
    ocasião e do horário.
    
    Os materiais foram selecionados priorizando durabilidade, sustentabilidade e estética contemporânea. 
    O mobiliário foi escolhido e, em alguns casos, desenhado especificamente para o projeto, garantindo 
    aproveitamento máximo do espaço e harmonia com o conceito geral.`;

  return (
    <div className="mb-16 max-w-4xl">
      <h2 className="text-2xl font-medium mb-6">Sobre o Projeto</h2>
      <div className="prose prose-stone max-w-none">
        {description ? (
          <div className="whitespace-pre-line">{description}</div>
        ) : (
          <>
            <p>
              Este projeto foi concebido para transformar um apartamento convencional em um espaço moderno e funcional, 
              atendendo às necessidades específicas dos moradores. O conceito aberto foi adotado para criar uma sensação 
              de amplitude, integrando os ambientes sociais.
            </p>
            <p>
              Utilizamos uma paleta de cores neutras como base, complementada por toques de cores em elementos decorativos 
              estratégicos. A iluminação foi cuidadosamente planejada para criar diferentes atmosferas, dependendo da 
              ocasião e do horário.
            </p>
            <p>
              Os materiais foram selecionados priorizando durabilidade, sustentabilidade e estética contemporânea. 
              O mobiliário foi escolhido e, em alguns casos, desenhado especificamente para o projeto, garantindo 
              aproveitamento máximo do espaço e harmonia com o conceito geral.
            </p>
          </>
        )}
        
        {details && Object.keys(details).length > 0 && (
          <div className="mt-8 space-y-6">
            {details.materials && details.materials.length > 0 && (
              <div>
                <h3 className="text-xl font-medium mb-3">Materiais Utilizados</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {details.materials.map((material, index) => (
                    <li key={index}>{material}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {details.techniques && details.techniques.length > 0 && (
              <div>
                <h3 className="text-xl font-medium mb-3">Técnicas Aplicadas</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {details.techniques.map((technique, index) => (
                    <li key={index}>{technique}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {details.duration && (
              <div>
                <h3 className="text-xl font-medium mb-3">Duração do Projeto</h3>
                <p>{details.duration}</p>
              </div>
            )}
            
            {details.challenges && (
              <div>
                <h3 className="text-xl font-medium mb-3">Desafios Superados</h3>
                <p>{details.challenges}</p>
              </div>
            )}
            
            {details.outcome && (
              <div>
                <h3 className="text-xl font-medium mb-3">Resultado Final</h3>
                <p>{details.outcome}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
