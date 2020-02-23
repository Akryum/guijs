# Contributing guidelines

> Those guidelines are work in progress

## Local development

Clone the repository.

Install the dependencies by running yarn (only tested with yarn v1) in the root directory:

```bash
yarn
```

Then build the packages:

```bash
lerna run build
```

Then serve the ui web app:

```bash
cd packages/@guijs/frontend-core
yarn run serve
```

And then in another terminal start the ui server (based on Apollo):

```bash
cd packages/@guijs/server-core
yarn run dev
```

You can also import the project into guijs and run the corresponding scripts! 😸
