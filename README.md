# cors

Simple CORS proxy

## Usage

```
https://cors.ryanking13.workers.dev/?u=https://www.google.com
```

__WARNING:__

You can use this demo site for testing.

However, DO NOT abuse the demo site for production.

See [Making your own CORS proxy](#making-your-own-cors-proxy).


## Making your own CORS proxy

1. [Learn about Cloudflare Workers](https://workers.cloudflare.com/)
2. Fork this repository
3. Change `accound_id` in [wrangler.toml](./wrangler.toml) to your Account ID
4. (Optional) Set `APP_NAME`, `HOSTNAME`, `APP_KEY` (Ingestion key) for [LogDNA](https://logdna.com/) logging
  - If logging is not needed, set `APP_KEY` to empty string `""`. 
5. `wrangler publish` ✨
