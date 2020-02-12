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
1. Fork this repository
1. Change `accound_id` in [wrangler.toml](./wrangler.toml) to your Account ID
1. `wrangler publish` ✨
