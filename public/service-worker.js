// Service Worker para Casa Branca Reformas
// Implementa estratégias de caching para melhorar a performance e permitir funcionalidade offline

const CACHE_NAME = 'casabranca-cache-v1';

// Recursos que serão cacheados imediatamente na instalação
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/logo.png',
  '/assets/js/vendor-*.js', // Pacotes de terceiros
  '/assets/js/main-*.js',   // JavaScript principal
  '/assets/css/main-*.css', // CSS principal
  '/offline.html'          // Página offline
];

// Recursos que serão cacheados em segundo plano
const BACKGROUND_CACHE_ASSETS = [
  '/assets/fonts/*',
  '/assets/images/*'
];

// Instalação do Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker instalado');
  
  // Pré-cache de recursos críticos
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cacheando recursos para uso offline');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Ativação do Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker ativado');
  
  // Limpar caches antigos
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Interceptação de requisições
self.addEventListener('fetch', (event) => {
  // Ignorar requisições para o painel de administração
  if (event.request.url.includes('/admin')) {
    return;
  }
  
  // Estratégia para recursos estáticos: Cache First, Network Fallback
  if (isStaticAsset(event.request.url)) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetchAndCache(event.request);
      }).catch(() => {
        // Fallback para página offline se for uma navegação HTML
        if (event.request.headers.get('Accept').includes('text/html')) {
          return caches.match('/offline.html');
        }
        return new Response('Recurso indisponível', { 
          status: 503, 
          statusText: 'Serviço Indisponível' 
        });
      })
    );
  } 
  // Estratégia para API e conteúdo dinâmico: Network First, Cache Fallback
  else {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cache apenas respostas bem-sucedidas
          if (response.ok) {
            const clonedResponse = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, clonedResponse);
            });
          }
          return response;
        })
        .catch(() => {
          // Verificar no cache se não puder buscar na rede
          return caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            
            // Fallback para página offline se for uma navegação HTML
            if (event.request.headers.get('Accept').includes('text/html')) {
              return caches.match('/offline.html');
            }
            
            return new Response('Recurso indisponível', { 
              status: 503, 
              statusText: 'Serviço Indisponível' 
            });
          });
        })
    );
  }
});

// Função para verificar se é um recurso estático
function isStaticAsset(url) {
  const staticExtensions = [
    '.js', '.css', '.jpg', '.jpeg', '.png', '.gif', '.webp', 
    '.svg', '.ico', '.woff', '.woff2', '.ttf', '.eot'
  ];
  
  return staticExtensions.some(ext => url.endsWith(ext));
}

// Função para buscar e cachear um recurso
function fetchAndCache(request) {
  return fetch(request).then((response) => {
    // Cache apenas respostas bem-sucedidas
    if (response.ok) {
      const clonedResponse = response.clone();
      caches.open(CACHE_NAME).then((cache) => {
        cache.put(request, clonedResponse);
      });
    }
    return response;
  });
}

// Background sync para envio de formulários quando offline
self.addEventListener('sync', (event) => {
  if (event.tag === 'form-submission') {
    event.waitUntil(sendPendingForms());
  }
});

// Função para enviar formulários pendentes quando online
async function sendPendingForms() {
  const db = await openDB();
  const pendingForms = await db.getAll('forms');
  
  for (const form of pendingForms) {
    try {
      const response = await fetch(form.url, {
        method: form.method,
        headers: form.headers,
        body: form.body
      });
      
      if (response.ok) {
        await db.delete('forms', form.id);
      }
    } catch (error) {
      console.error('Erro ao enviar formulário pendente:', error);
    }
  }
} 