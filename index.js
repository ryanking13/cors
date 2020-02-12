const APP_NAME = "cors.ryanking13"
const HOSTNAME = "CORS_RYANKING13_WORKERS_DEV"
const APP_KEY = "62492b64742400257938bd440f99a50f"


async function handleRequest(request) {
  const url = new URL(request.url)
  const apiurl = url.searchParams.get('u')
  // Rewrite request to point to API url. This also makes the request mutable
  // so we can add the correct Origin header to make the API server think
  // that this request isn't cross-site.
  if (apiurl === null) {
    return new Response('url not given')
  }

  request = new Request(apiurl, request)
  request.headers.set('Origin', new URL(apiurl).origin)

  // return new Response(JSON.stringify([...request.headers], null, 2))
  const host = url.searchParams.get('host')
  if (host !== null) {
    request.headers.set('Host', host)
  }

  let response = await fetch(request)

  // return new Response(JSON.stringify([...response.headers], null, 2))

  // Recreate the response so we can modify the headers
  response = new Response(response.body, response)
  // Set CORS headers
  response.headers.set('Access-Control-Allow-Origin', "*")
  // Append to/Add Vary header so browser will cache response correctly
  response.headers.append('Vary', 'Origin')
  return response
}

function handleOptions(request) {
  // Make sure the necesssary headers are present
  // for this to be a valid pre-flight request
  if (
    request.headers.get('Origin') !== null &&
    request.headers.get('Access-Control-Request-Method') !== null &&
    request.headers.get('Access-Control-Request-Headers') !== null
  ) {
    // Handle CORS pre-flight request.
    // If you want to check the requested method + headers
    // you can do that here.
    return new Response(null, {
      headers: corsHeaders,
    })
  } else {
    // Handle standard OPTIONS request.
    // If you want to allow other HTTP Methods, you can do that here.
    return new Response(null, {
      headers: {
        Allow: 'GET, HEAD, POST, OPTIONS',
      },
    })
  }
}

// loggin code adapted from: https://github.com/adaptive/cf-logdna-worker
const getLogData = (request) => {
  let data = {
    app: APP_NAME,
    timestamp: Date.now(),
    meta: {
      ua: request.headers.get("user-agent"),
      referer: request.headers.get("Referer") || "empty",
      ip: request.headers.get("CF-Connecting-IP"),
      countryCode: (request.cf || {}).country,
      colo: (request.cf || {}).colo,
      url: request.url,
      method: request.method,
      x_forwarded_for: request.headers.get("x_forwarded_for") || "0.0.0.0",
      asn: (request.cf || {}).asn,
      cfRay: request.headers.get("cf-ray"),
      tlsCipher: (request.cf || {}).tlsCipher,
      tlsVersion: (request.cf || {}).tlsVersion,
      clientTrustScore: (request.cf || {}).clientTrustScore,
    }
  }
  data.line = `${data.meta.countryCode} ${data.meta.ip} ${data.meta.url}`
  return data
}

const postLog = request => {
  let data = JSON.stringify({ lines: [request] })
  let myHeaders = new Headers()
  myHeaders.append("Content-Type", "application/json; charset=UTF-8")
  myHeaders.append(
    "Authorization",
    "Basic " + btoa(APP_KEY + ":"),
  )
  try {
    return fetch(
      "https://logs.logdna.com/logs/ingest?tag=worker&hostname=" + HOSTNAME,
      {
        method: "POST",
        headers: myHeaders,
        body: data
      }
    ).then(r => {
      requests = []
    })
  } catch (err) {
    //console.log(err.stack || err)
  }
}

const log = async event => {
  if (APP_KEY === "") {
    return new Promise()
  }

  return postLog(getLogData(event.request))
}

addEventListener('fetch', event => {
  const request = event.request
  const url = new URL(request.url)
  if (request.method === 'OPTIONS') {
    // Handle CORS preflight requests
    event.respondWith(handleOptions(request))
  } else if (
    request.method === 'GET' ||
    request.method === 'HEAD' ||
    request.method === 'POST'
  ) {
    // Handle requests to the API server
    const loggingEvent = log(event)
    const response = handleRequest(request)
    event.waitUntil(loggingEvent)
    event.respondWith(response)
  } else {
    event.respondWith(async () => {
      return new Response(null, {
        status: 405,
        statusText: 'Method Not Allowed',
      })
    })
  }
})
// We support the GET, POST, HEAD, and OPTIONS methods from any origin,
// and accept the Content-Type header on requests. These headers must be
// present on all responses to all CORS requests. In practice, this means
// all responses to OPTIONS requests.
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, HEAD, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}