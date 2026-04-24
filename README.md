# Oracle

Operational Reasoning & Command Logic Engine. A decision-support tool for tactical, strategic, intelligence, political, legal, and security analysis.

---

## Setup

### 1. Get a free Groq API key

Go to [console.groq.com](https://console.groq.com), sign up, and create an API key. Free tier gives you 14,400 requests/day.

### 2. Deploy the Cloudflare Worker

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com) and sign up for a free account
2. Go to **Workers & Pages → Create → Create Worker**
3. Paste the contents of `worker.js` into the editor
4. Edit line 4 — replace `https://YOUR_GITHUB_USERNAME.github.io` with your actual Github Pages URL
5. Click **Deploy**
6. Go to **Settings → Variables and Secrets**
7. Click **Add** → type `GROQ_API_KEY` → paste your Groq key → set as **Secret** → Save
8. Note your Worker URL — it looks like `https://oracle-proxy.yourname.workers.dev`

### 3. Deploy to Github Pages

1. Fork or clone this repository
2. Go to **Settings → Pages**
3. Set source to **Deploy from a branch** → `main` → `/ (root)`
4. Save — your site will be live at `https://YOUR_USERNAME.github.io/REPO_NAME`

### 4. First visit

Open your Github Pages URL. Oracle will prompt you for the Worker URL from step 2. Paste it in and click Connect. The URL is stored in your browser's localStorage — you only need to enter it once per device.

---

## Files

| File | Purpose |
|---|---|
| `index.html` | Oracle frontend — deploy this to Github Pages |
| `worker.js` | Cloudflare Worker proxy — deploy this to Cloudflare |
| `README.md` | This file |

---

## How it works

```
Browser (Github Pages)
  → POST /  →  Cloudflare Worker  →  POST /openai/v1/chat/completions  →  Groq API
                (adds API key)                                              (Llama 3.3 70B)
  ←  JSON   ←  Cloudflare Worker  ←  JSON response  ←─────────────────────────────────
```

The Worker validates that requests come from your Github Pages domain (CORS), appends your Groq API key, and forwards to Groq. Your key never appears in the client code.

---

## Resetting the proxy URL

Open your browser console and run:
```js
localStorage.removeItem('oracle_proxy_url')
```
Then reload the page.
