import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Registro do Service Worker para funcionalidades offline e melhor performance
const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js', {
        scope: '/',
      });
      
      console.log('Service Worker registrado com sucesso:', registration.scope);
      
      // Verificar atualizações do Service Worker a cada hora
      setInterval(async () => {
        try {
          await registration.update();
          console.log('Service Worker verificou atualizações');
        } catch (error) {
          console.error('Erro ao atualizar Service Worker:', error);
        }
      }, 60 * 60 * 1000); // 1 hora
      
    } catch (error) {
      console.error('Erro ao registrar Service Worker:', error);
    }
  }
};

// Registrar o Service Worker após o carregamento da página
window.addEventListener('load', () => {
  registerServiceWorker();
  
  // Iniciar carregamento de componentes não críticos
  import('./utils/prefetch-components').then(module => {
    module.prefetchComponents();
  }).catch(error => {
    // Ignorar erros de prefetch
    console.debug('Erro ao pré-carregar componentes:', error);
  });
});

// Renderização do React com prioridade para o conteúdo principal
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// Em ambientes de desenvolvimento, adicione monitoramento básico de performance
if (import.meta.env.DEV) {
  // Versão simplificada de monitoramento sem depender de tipos específicos
  console.log('Monitoramento de performance ativado em desenvolvimento');
  
  // Monitorar tempo de carregamento inicial
  window.addEventListener('load', () => {
    const navigationTiming = performance.getEntriesByType('navigation')[0];
    console.log('Tempo de carregamento:', navigationTiming);
    
    // Métricas de recursos
    const resourceEntries = performance.getEntriesByType('resource');
    console.log(`${resourceEntries.length} recursos carregados`);
    
    // Capturar tempo total de carregamento
    setTimeout(() => {
      if (window.performance && window.performance.timing) {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log('Tempo total de carregamento da página:', pageLoadTime, 'ms');
      }
    }, 0);
  });
}
