# next-starter

Simple, customized next-starter template extended by:

- Typescript support with real-time type checking
- Configured absolute imports
- Configured ESLint with Prettier
- Lint-staged with Husky hooks
- Custom API router to handle endpoints nicely
- Some basic folder structure
- Some basic tsconfig options
- Some basic packages

## Clone template

```bash
git clone --depth=1 --branch=main https://github.com/lukaaspl/next-starter.git my-project
rm -rf ./my-project/.git
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.ts`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.
