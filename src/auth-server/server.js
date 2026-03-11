const http = require('http')
const fs = require('fs')
const path = require('path')
const { URL } = require('url')
const crypto = require('crypto')
const querystring = require('querystring')

const port = Number(process.env.AUTH_PORT || 4170)
const appOrigin = process.env.APP_ORIGIN || 'http://localhost:5173'
const dbPath = path.join(__dirname, 'db.json')

const defaultDb = {
  users: [
    {
      username: 'user',
      password: 'pw',
      name: '',
      email: '',
    },
  ],
  tokens: [],
  coffees: [
    {
      name: 'Espresso',
      price: 10,
      recipe: [
        { name: 'espresso', quantity: 30 }
      ]
    },
    {
      name: 'Espresso Macchiato',
      price: 12,
      recipe: [
        { name: 'espresso', quantity: 30 },
        { name: 'milk foam', quantity: 15 }
      ]
    },
    {
      name: 'Cappuccino',
      price: 19,
      recipe: [
        { name: 'espresso', quantity: 30 },
        { name: 'steamed milk', quantity: 20 },
        { name: 'milk foam', quantity: 50 }
      ]
    },
    {
      name: 'Mocha',
      price: 8,
      recipe: [
        { name: 'espresso', quantity: 30 },
        { name: 'chocolate syrup', quantity: 20 },
        { name: 'steamed milk', quantity: 25 },
        { name: 'whipped cream', quantity: 25 }
      ]
    },
    {
      name: 'Flat White',
      price: 18,
      recipe: [
        { name: 'espresso', quantity: 30 },
        { name: 'steamed milk', quantity: 50 }
      ]
    },
    {
      name: 'Americano',
      price: 7,
      recipe: [
        { name: 'espresso', quantity: 30 },
        { name: 'water', quantity: 70 }
      ]
    },
    {
      name: 'Cafe Latte',
      price: 16,
      recipe: [
        { name: 'espresso', quantity: 30 },
        { name: 'steamed milk', quantity: 50 },
        { name: 'milk foam', quantity: 20 }
      ]
    },
    {
      name: 'Espresso Con Panna',
      price: 14,
      recipe: [
        { name: 'espresso', quantity: 30 },
        { name: 'whipped cream', quantity: 15 }
      ]
    },
    {
      name: 'Cafe Breve',
      price: 15,
      recipe: [
        { name: 'espresso', quantity: 25 },
        { name: 'steamed milk', quantity: 30 },
        { name: 'steamed cream', quantity: 30 },
        { name: 'milk foam', quantity: 15 }
      ]
    },
    {
      name: '(Discounted) Mocha',
      price: 4,
      discounted: true,
      recipe: [
        { name: 'espresso', quantity: 30 },
        { name: 'chocolate syrup', quantity: 20 },
        { name: 'steamed milk', quantity: 25 },
        { name: 'whipped cream', quantity: 25 }
      ]
    }
  ]
}

const ensureDb = () => {
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify(defaultDb, null, 2), 'utf8')
  }
}

const readDb = () => {
  ensureDb()
  const raw = fs.readFileSync(dbPath, 'utf8')
  return JSON.parse(raw)
}

const writeDb = (db) => {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8')
}

const escapeHtml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const renderLoginPage = ({ error = '', returnTo = appOrigin } = {}) => `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Login</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lobster&display=swap" />
    <style>
      *, *::before, *::after { box-sizing: border-box; }
      body { font-family: Times; background: rgba(224, 255, 255, 0.15); }
      .wrap { max-width: 520px; margin: 50px auto; padding: 20px; border: 4px solid #000; background: antiquewhite; text-align: center; }
      h2 { margin-top: 0; }
      form { text-align: left; }
      label { display: block; text-align: left; margin-bottom: 4px; }
      input { width: 100%; padding: 8px; margin: 6px 0 12px; border: 2px solid #000; font-family: inherit; font-size: 20px; }
      button { border: 4px solid #000; background: antiquewhite; padding: 8px 14px; font-family: inherit; font-size: 1rem; cursor: pointer; margin-top: 4px; }
      button:hover { border-color: goldenrod; color: goldenrod; }
      .error { color: #b00020; margin-bottom: 10px; }
      .note { margin-top: 12px; font-size: 1rem; }
      .card { border: 2px solid #000; padding: 12px; margin: 16px auto; background: white; }
      .label { font-weight: bold; }
    </style>
  </head>
  <body>
    <div class="wrap">
      <h2>Login</h2>
      ${error ? `<div class="error">${escapeHtml(error)}</div>` : ''}
      <form method="POST" action="/login">
        <label>Username</label>
        <input name="username" autocomplete="username" />
        <label>Password</label>
        <input name="password" type="password" autocomplete="current-password" />
        <input type="hidden" name="returnTo" value="${escapeHtml(returnTo)}" />
        <button type="submit">Sign in</button>
      </form>
      <div class="card">
        <div class="label">Default credentials</div>
        <div>username: user</div>
        <div>password: pw</div>
      </div>
    </div>
  </body>
</html>
`

const send = (res, status, body, headers = {}) => {
  res.writeHead(status, {
    'Content-Type': 'text/html; charset=utf-8',
    'Access-Control-Allow-Origin': appOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    ...headers,
  })
  res.end(body)
}

const sendJson = (res, status, data, headers = {}) => {
  send(res, status, JSON.stringify(data), {
    'Content-Type': 'application/json; charset=utf-8',
    ...headers,
  })
}

const buildReturnTo = (value) => {
  try {
    const url = new URL(value)
    return url.toString()
  } catch {
    return appOrigin
  }
}

const withAuthParams = (returnTo, token, user) => {
  const url = new URL(returnTo)
  url.searchParams.set('token', token)
  url.searchParams.set('user', JSON.stringify(user))
  url.searchParams.set('auth', '1')
  return url.toString()
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url || '/', `http://${req.headers.host}`)

  if (req.method === 'OPTIONS') {
    return send(res, 204)
  }

  if (req.method === 'GET' && (url.pathname === '/' || url.pathname === '/login')) {
    const returnTo = buildReturnTo(url.searchParams.get('returnTo') || appOrigin)
    return send(res, 200, renderLoginPage({ returnTo }))
  }

  if (req.method === 'GET' && url.pathname === '/coffees') {
    const db = readDb()
    return sendJson(res, 200, db.coffees || [])
  }

  if (req.method === 'POST' && url.pathname === '/login') {
    let body = ''
    req.on('data', (chunk) => {
      body += chunk.toString()
      if (body.length > 1e6) req.socket.destroy()
    })
    req.on('end', () => {
      const data = querystring.parse(body)
      const username = String(data.username || '')
      const password = String(data.password || '')
      const returnTo = buildReturnTo(String(data.returnTo || appOrigin))

      const db = readDb()
      const match = db.users.find(
        (u) => u.username === username && u.password === password
      )

      if (!match) {
        return send(res, 401, renderLoginPage({ error: 'Invalid credentials.', returnTo }))
      }

      const token = crypto.randomUUID()
      db.tokens.push({ username, token })
      writeDb(db)

      const redirectUrl = withAuthParams(returnTo, token, match)
      res.writeHead(302, { Location: redirectUrl })
      return res.end()
    })
    return
  }

  const updateUserMatch = req.method === 'POST' && url.pathname.startsWith('/update-user/')
  if (updateUserMatch) {
    const username = url.pathname.split('/').pop()

    const token = req.headers['authorization']?.split(' ')?.[1]
    const db = readDb()
    const storedToken = db.tokens.find((t) => t.token === token)

    if (!storedToken || storedToken.username !== username) {
      return send(res, 401, 'Unauthorized')
    }

    let body = ''
    req.on('data', (chunk) => {
      body += chunk.toString()
      if (body.length > 1e6) req.socket.destroy()
    })
    req.on('end', () => {
      const data = querystring.parse(body)
      const name = String(data.name || '')
      const email = String(data.email || '')

      const userIndex = db.users.findIndex((u) => u.username === username)

      if (userIndex === -1) {
        return send(res, 404, 'User not found')
      }

      const user = db.users[userIndex]
      user.name = name
      user.email = email
      writeDb(db)

      const userToReturn = {
        username: user.username,
        name: user.name,
        email: user.email,
      }

      // Explicit wait of 10 seconds to highlight Cypress handling of slow responses
      setTimeout(() => {
        send(res, 200, JSON.stringify(userToReturn), {
          'Content-Type': 'application/json',
        })
      }, 10000)
    })
    return
  }

  send(res, 404, '<h1>Not found</h1>')
})

server.listen(port, () => {
  console.log(`Auth server running at http://localhost:${port}`)
})
