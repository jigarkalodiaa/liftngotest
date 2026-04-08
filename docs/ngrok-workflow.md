# Ngrok Workflow (Backend + Driver + Customer)

This runbook standardizes local + real-device testing for Liftngo apps using one backend tunnel.

## 1) Backend requirements (NestJS)

Use these settings in your backend before testing on phones:

```ts
// main.ts
app.enableCors({
  origin: true, // use allowlist in production
  credentials: true,
});
```

```ts
// gateway
@WebSocketGateway({
  cors: { origin: true },
  transports: ['websocket', 'polling'],
})
```

Start backend on all interfaces:

```bash
npm run start -- --host 0.0.0.0
```

## 2) Start ngrok tunnel

Install + auth once:

```bash
ngrok config add-authtoken YOUR_TOKEN
```

Expose backend port:

```bash
ngrok http 3001
```

Copy the HTTPS forwarding URL, for example:

`https://abc123.ngrok-free.app`

## 3) Update frontend env automatically

In each frontend repo (customer app, driver app), run:

```bash
npm run env:ngrok -- --url https://abc123.ngrok-free.app
```

This writes `.env.local` from `.env.ngrok` template and replaces `YOUR_NGROK_URL`.

If ngrok is already running locally, use auto-detect (no manual copy):

```bash
npm run env:ngrok:auto -- --force
```

Or one command to auto-sync and start Next.js:

```bash
npm run dev:ngrok:auto
```

Then restart Next.js:

```bash
npm run dev:ngrok
```

## 4) Env contract

`.env.ngrok` template:

```env
NEXT_PUBLIC_API_URL=https://YOUR_NGROK_URL/api/v1
NEXT_PUBLIC_WS_URL=https://YOUR_NGROK_URL
NEXT_PUBLIC_WS_DEBUG=true
```

`.env.local` for local-only:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_WS_URL=http://localhost:3001
NEXT_PUBLIC_WS_DEBUG=true
```

## 5) Socket requirements

- Use HTTPS ngrok URL when frontend is opened over HTTPS.
- Keep `transports: ['websocket', 'polling']`.
- Keep exactly one socket singleton instance per app.
- Log `connect`, `disconnect`, `connect_error`, and `onAny` in debug mode.

## 6) Real-device test checklist

1. Start backend
2. Start ngrok (`ngrok http 3001`)
3. Run `npm run env:ngrok -- --url <HTTPS_URL>` in customer app
4. Run `npm run env:ngrok -- --url <HTTPS_URL>` in driver app
5. Restart both Next dev servers
6. Open both apps on real devices
7. Validate full lifecycle:
   - customer creates trip
   - driver receives trip
   - driver accepts
   - customer receives `trip:accepted`
   - live `trip:status` + `location:update` stream

## 7) Common pitfalls

- Mixed content: HTTPS frontend + HTTP backend URL (blocked by browser)
- Forgot to restart Next.js after env change
- Old ngrok URL after tunnel restart
- Multiple tabs fighting for socket ownership
- `env:ngrok` overwrite blocked by safety check (use `--force`)
