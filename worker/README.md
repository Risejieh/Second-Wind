# Second Wind AI device check

This small backend powers the **Check with AI** button on the website. A customer types their computer model, and Claude Haiku (the cheapest Claude model) decides which price tier it belongs to: standard laptop, gaming laptop, high-end/hard to open, or desktop. It looks at the exact model and generation, so it doesn't treat every Alienware the same.

It runs free on Cloudflare Workers. The API key lives on Cloudflare, never in the website code. **Never put the API key in `index.html` or commit it to this repo, because the repo is public.**

## Limits built in

| Setting | Default | Where |
| --- | --- | --- |
| AI checks per visitor (IP address) per 24 hours | 2 | `PER_IP_LIMIT` in `wrangler.toml` |
| AI checks for the whole site per day | 200 | `DAILY_LIMIT` in `wrangler.toml` |
| Website allowed to call it | `https://risejieh.github.io` | `ALLOWED_ORIGINS` in `wrangler.toml` |

Visitor and daily counts are kept in Durable Objects, which count exactly, so quick repeated requests can't get past the limit. Answers are cached in KV for 30 days, so a model someone already checked is free and doesn't use up a visitor's checks. IP addresses are only used as salted hashes, and their counts are deleted when the 24 hours are up. When a visitor runs out, or the AI is down, the site falls back to its built-in keyword check.

## Cost

Claude Haiku 5.5 costs $0.10 per million input tokens and $0.50 per million output tokens. One check uses roughly a thousand tokens, so it costs well under a tenth of a cent. Even if the 200-per-day cap were hit every day, that's a few dollars a month. Set a monthly spend limit in the Claude Console anyway.

## Set it up (about 15 minutes)

You need [Node.js](https://nodejs.org) installed.

1. **Get a Claude API key.** Sign in at [platform.claude.com](https://platform.claude.com), add a few dollars of credit, create an API key, and set a low monthly spend limit.
2. **Make a free Cloudflare account** at [cloudflare.com](https://dash.cloudflare.com/sign-up).
3. **Open a terminal in this `worker` folder** and run:

   ```sh
   npx wrangler login
   npx wrangler kv namespace create SECOND_WIND
   ```

   Copy the `id` it prints into `wrangler.toml`, replacing `PASTE_YOUR_KV_NAMESPACE_ID_HERE`.
4. **Store your secrets on Cloudflare.** Paste each value when asked:

   ```sh
   npx wrangler secret put ANTHROPIC_API_KEY
   npx wrangler secret put IP_SALT
   ```

   For `IP_SALT`, type any long random text.
5. **Deploy:**

   ```sh
   npx wrangler deploy
   ```

   It prints your Worker's address, like `https://second-wind.yourname.workers.dev`.
6. **Connect the website.** In `index.html`, find `const AI_ENDPOINT = "";` and paste the address between the quotes. Commit, and the **Check with AI** button appears on the site.

If you later use your own domain, add it to `ALLOWED_ORIGINS` (for example `"https://risejieh.github.io,https://secondwindlaptops.com"`) and run `npx wrangler deploy` again.

## Check that it works

Open the site, type a model such as `Alienware m16 R1`, and tap **Check with AI**. To watch requests and errors live, run `npx wrangler tail` in this folder.
