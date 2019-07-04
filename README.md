<p align="center">
  <img src="./res/guijs-full-black.svg" alt="gui.js">
</p>

### Local development

You should serve `@guijs/builtin-plugin` by running:

```bash
cd packages/@guijs/builtin-plugin
yarn run serve
```

Then in another terminal, you should serve the ui web app:

```bash
cd packages/@guijs/app-core
yarn run serve
```

And then you start the ui server (based on Apollo):

```bash
cd packages/@guijs/server-core
yarn run dev
```
