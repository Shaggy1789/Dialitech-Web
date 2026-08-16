const ML_BASE_URL = process.env.ML_API_URL || 'https://dialitechmlservice-production.up.railway.app';
const ML_API_KEY = process.env.ML_API_KEY;

if (!ML_API_KEY) {
  console.error('[ml-proxy] ML_API_KEY environment variable is not set');
}

const ALLOWED_PATHS = ['/api/v1/analyze', '/health', '/api/v1/model-info'];

// Prefijos bajo los cuales Netlify puede invocar esta función. Según cómo llegue
// la petición, event.path puede venir con el prefijo original o el reescrito:
//   - redirect /ml/*            -> event.path = /ml/health (prefijo original)
//   - redirect /api/ml/*        -> event.path = /api/ml/health
//   - llamada directa           -> event.path = /.netlify/functions/ml-proxy/health
// Se recorta el primer prefijo conocido para extraer SOLO la ruta del ML Service.
const PATH_PREFIXES = ['/.netlify/functions/ml-proxy', '/api/ml', '/ml'];

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

  if (!isAllowedPath(path)) {
    return {
      statusCode: 404,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Not found' }),
    };
  }

  const targetUrl = buildTargetUrl(path, query);

  const requestHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  // La API key se inyecta SOLO server-side. Si no está configurada en el entorno
  // de Netlify (ML_API_KEY), no se envía el header para que /health siga siendo
  // público; los endpoints protegidos (analyze/model-info) devolverán 401 del
  // ML Service y el error quedará visible para diagnosticar la configuración.
  if (ML_API_KEY) {
    requestHeaders['X-API-Key'] = ML_API_KEY;
  }

  if (headers['content-type']) {
    requestHeaders['Content-Type'] = headers['content-type'];
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
    const responseHeaders = {};
    response.headers.forEach((value, key) => {
      if (!['content-encoding', 'transfer-encoding'].includes(key.toLowerCase())) {
        responseHeaders[key] = value;
      }
    });
    responseHeaders['Access-Control-Allow-Origin'] = '*';
    responseHeaders['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS';
    responseHeaders['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';

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
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Bad gateway', message: 'Unable to reach ML service' }),
    };
  }
}

export async function handler(event, context) {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
      body: '',
    };
  }

  const path = extractServicePath(event.path);

  return proxyRequest(event, path);
}