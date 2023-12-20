## Developing

Clone the project and run `npm install`, then start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

Everything inside `src/lib` is part of the library, everything inside `src/routes` is for the docs site.

Before committing changes, format the code with Prettier:

```bash
npm run format
```

## Testing

To run the test suite:

```bash
npm test
```

Also check that there are no type errors:

```bash
npm run check
```

## Building

To build the library:

```bash
npm run package
```

To create a production version of the docs site:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

## Deploying docs site

```bash
npm run deploy
```

## Publishing

To publish the library to [npm](https://www.npmjs.com):

```bash
npm publish
```
