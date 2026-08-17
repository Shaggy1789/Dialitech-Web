const ML_BASE_URL = process.env.ML_API_URL || 'https://dialitechmlservice-production.up.railway.app';
const ML_API_KEY = process.env.ML_API_KEY;

// Orígenes permitidos para CORS. El frontend usa same-origin (/ml/* redirige
// server-side por Netlify), así que en el flujo normal el navegador no necesita
// headers CORS. Este allowlist solo aplica si alguien llama a la función
// cross-origin desde un navegador. Configurable vía ALLOWED_ORIGINS (csv).
const DEFAULT_ALLOWED_ORIGINS = 'https://dialitech.netlify.app';
const allowedOrigins = new Set(
  (process.env.ALLOWED_ORIGINS || DEFAULT_ALLOWED_ORIGINS)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),
);

if (!ML_API_KEY) {
  console.error('[ml-proxy] ML_API_KEY environment variable is not set');
}

const ALLOWED_PATHS = ['/api/v1/analyze', '/health', '/api/v1/model-info'];

// Headers de respuesta del ML Service que SÍ se reenvían al cliente.
// Todo lo demás (server fingerprint, headers internos, cookies, etc.) se descarta.
const RESPONSE_HEADER_ALLOWLIST = ['content-type', 'content-length'];

// Prefijos bajo los cuales Netlify puede invocar esta función. Según cómo llegue
// la petición, event.path puede venir con el prefijo original o el reescrito:
//   - redirect /ml/*            -> event.path = /ml/health (prefijo original)
//   - redirect /api/ml/*        -> event.path = /api/ml/health
//   - llamada directa           -> event.path = /.netlify/functions/ml-proxy/health
// Se recorta el primer prefijo conocido para extraer SOLO la ruta del ML Service.
const PATH_PREFIXES = ['/.netlify/functions/ml-proxy', '/api/ml', '/ml'];

function isOriginAllowed(event) {
  const origin = event.headers && event.headers['origin'];
  if (!origin) return false;
  return allowedOrigins.has(origin);
}

function buildCorsHeaders(event) {
  if (!isOriginAllowed(event)) return {};
  const origin = event.headers['origin'];
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  };
}

function extractServicePath(eventPath) {
  let path = eventPath || '';
  for (const prefix of PATH_PREFIXES) {
    if (path === prefix || path.startsWith(`${prefix}/`)) {
      path = path.slice(prefix.length);
      break;
    }
  }
  if (path === '') return '/';
  if (!path.startsWith('/')) path = `/${path}`;
  return path;
}

function isAllowedPath(path) {
  return ALLOWED_PATHS.some(allowed => path.startsWith(allowed));
}

function buildTargetUrl(path, query) {
  const url = new URL(path, ML_BASE_URL);
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }
  return url.toString();
}

async function proxyRequest(event, path) {
  const method = event.httpMethod;
  const headers = event.headers || {};
  const query = event.queryStringParameters || {};
  const body = event.body;

  const corsHeaders = buildCorsHeaders(event);

  if (!isAllowedPath(path)) {
    return {
      statusCode: 404,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
      body: JSON.stringify({ error: 'Not found' }),
    };
  }

  const targetUrl = buildTargetUrl(path, query);

  // Solo se envían al ML Service los headers estrictamente necesarios.
  // NO se reenvían los headers arbitrarios del request del cliente.
  const requestHeaders = {
    'Accept': 'application/json',
  };

  const contentType = headers['content-type'];
  if (contentType) {
    requestHeaders['Content-Type'] = contentType;
  } else {
    requestHeaders['Content-Type'] = 'application/json';
  }

  // La API key se inyecta SOLO server-side. Si no está configurada en el entorno
  // de Netlify (ML_API_KEY), no se envía el header para que /health siga siendo
  // público; los endpoints protegidos (analyze/model-info) devolverán 401 del
  // ML Service y el error quedará visible para diagnosticar la configuración.
  if (ML_API_KEY) {
    requestHeaders['X-API-Key'] = ML_API_KEY;
  }

  const options = {
    method,
    headers: requestHeaders,
  };

  if (body && ['POST', 'PUT', 'PATCH'].includes(method)) {
    options.body = body;
  }

  try {
    const response = await fetch(targetUrl, options);
    const responseHeaders = {
      ...corsHeaders,
    };
    response.headers.forEach((value, key) => {
      if (RESPONSE_HEADER_ALLOWLIST.includes(key.toLowerCase())) {
        responseHeaders[key] = value;
      }
    });

    const data = await response.text();

    return {
      statusCode: response.status,
      headers: responseHeaders,
      body: data,
    };
  } catch (error) {
    console.error('[ml-proxy] Error:', error);
    return {
      statusCode: 502,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
      body: JSON.stringify({ error: 'Bad gateway', message: 'Unable to reach ML service' }),
    };
  }
}

export async function handler(event, _context) {
  if (event.httpMethod === 'OPTIONS') {
    const corsHeaders = buildCorsHeaders(event);
    if (Object.keys(corsHeaders).length === 0) {
      return {
        statusCode: 403,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Forbidden' }),
      };
    }
    return {
      statusCode: 204,
      headers: corsHeaders,
      body: '',
    };
  }

  const path = extractServicePath(event.path);

  return proxyRequest(event, path);
}
