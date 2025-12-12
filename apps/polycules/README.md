# polycules

A web-based graph editor for [$\pi$ non-monogamous](https://en.wikipedia.org/wiki/Polyamory) relationships of any kinds with support for [<img align="center" height="24" src="https://github.com/deniz-blue/md-emojis/raw/main/emojis/plurality-colors.svg"> plurality](https://morethanone.info/).

You can view/use the application right now [here](https://poly.deniz.blue).
<a href="https://poly.deniz.blue"><img align="center" src="https://img.shields.io/website-up-down-green-red/https/poly.deniz.blue.svg"></a>

This project was inspired by [*Madison Rye Progress*](https://github.com/makyo)' [polycul.es](https://polycul.es/) ([repo](https://github.com/makyo/polycul.es)) website.

Feel free to show [me](https://deniz.blue) your graphs! I like it when people make use of things I make.

## Format

Zod schemas can be found [here](./app/lib/schema)

Links are future-compatible because they are versioned. Valid link formats are:

- `https://poly.deniz.blue/#v1:DATA` where `DATA` Deflate compressed json string encoded in URL-safe Base64 format
- `https://poly.deniz.blue/#v1-fetch:URL` where `URL` is any URL (schema can be omitted) pointing to a json file
  - for example, `URL` can be something like `gist.githubusercontent.com/USERNAME/GIST_ID/raw/FILE.json`

Would it make sense to have a central database? If you are interested in this idea open an issue and we can discuss about it

## WIP

TODO:
- [ ] Relationship customization
- [ ] PluralKit importing
- [ ] Graph Merging

## Contributing

Contributions

Prerequisites:
- [Node.js](https://nodejs.org/en) (20.19+, 22.12+)
- [pnpm](https://pnpm.io/)

Setup:
1. `cd` into this directory
2. `pnpm install`

Development:
- `pnpm dev` - frontend
    - `http://localhost:5173` (vite)
- `pnpm bdev` - backend.
    - `http://localhost:3000` (hono)

## Old Version

This is actually a rewrite! The old version looked like this:

![old](./.readme/image.png)

[Permalink](https://github.com/deniz-blue/polycules/tree/5befe51973fd09860521bef04bdf32576aea8664)
