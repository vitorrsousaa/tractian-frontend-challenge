# Tractian Front-end Challenge

This project was created for the Front End Software Engineer Challenge.

## Demonstration:

Check the deployed app: (Application)[https://tractian-frontend-challenge-mu.vercel.app/]

Check this video with all funcionalities:

[!Video](.github/assets/tractian-frontend-challenge.gif)


## Technologies

This template includes the following packages and technologies:

- `ViteJS`: A [Vite](https://vitejs.dev/) single page app.
- `Tanstack - React Query`: A library for fetching, caching, and updating server state in React applications. [Link](https://react-query.tanstack.com/)
- `Tailwind CSS`: A utility-first CSS framework for rapidly building custom designs. [Link](https://tailwindcss.com/)
- `PostCSS`: A tool for transforming CSS with JavaScript plugins. [Link](https://postcss.org/)
- `Axios`: A promise-based HTTP client for making XMLHttpRequests in the browser and Node.js. [Link](https://axios-http.com/)
- `React Hot Toast`: A toast notification library for React applications with hot reloading support. [Link](https://react-hot-toast.com/)
- `React Hook Form`: A library for building flexible and composable forms with React hooks. [Link](https://react-hook-form.com/)
- `zod`: A TypeScript-first schema declaration and validation library. [Link](https://github.com/colinhacks/zod)


This template includes the following packages and technologies as dev dependencies:

- `biome`: A tool for linting, format and check files. [Link](https://biomejs.dev/pt-br/)
- `commitlint`: Linting tool for enforcing conventional commit messages. [Link](https://commitlint.js.org/)
- `lint-staged`: Run linters on git staged files. [Link](https://github.com/okonet/lint-staged)
- `vitest`: A framework of test runner for all things JavaScript. [Link](https://vitest.dev/)
- `husky`: Git hooks made easy. [Link](https://typicode.github.io/husky/#/)


This template and packages is 100% [TypeScript](https://www.typescriptlang.org/).

## 🚀 How to run the project

### Prerequisites

Before you begin, you will need to have the following tools installed on your machine:<br />
→ [Git](https://git-scm.com);<br />
→ [Node.js](https://nodejs.org/en/);<br />

It is also good to have an editor to work with the code like [VSCode](https://code.visualstudio.com/);

---

### 🧭 Running the web application

```bash
# Clone this repository
$ git clone https://github.com/vitorrsousaa/tractian-frontend-challenge.git


# Install the dependencies
yarn install

# Run the application
yarn start
# The application will open at port:5173 - visit http://localhost:5173
```
## Project Structure

### Folder Structure
The repository has the following folder structure:

```
├── src
│   ├── app
│   │   ├── config
│   │   ├── contexts
│   │   ├── hooks
│   │   ├── libs
│   │   ├── services
│   │   ├── storage
│   │   ├── utils
│   ├── view
│   │   ├── assets
│   │   ├── components
│   │   ├── layouts
│   │   ├── pages
│   │   ├── router
│   │   ├── ui
├── public
│   ├── vite.svg
├── dist or build
├── node_modules
├── package-lock.json
└── .gitignore
```

### File Structure

The repository has the following file structure:

```
├── .commitlintrc
├── .env.example
├── .gitignore
├── biome.json
├── index.html
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── vitest.config.ts
├── yarn.lock
└── .gitignore
```

## Linting and format code

We use Biome, EditorConfig, and an integrated StyleGuide with automatic formatting. Please download these extensions in your code editor.

1. [Biome](https://marketplace.visualstudio.com/items?itemName=biomejs.biome)
2. [EditorConfig](https://github.com/editorconfig/editorconfig-vscode)

> To ensure that Biome formats on save, add `"editor.formatOnSave": true` to your VSCode personal settings.

### Using Biome Linting

You can format files and directories using the format command with the `--write` parameter:

```bash
yarn biome format --write <files>
```
Or using default script to run format defined on `package.json`:

```bash
yarn format
```

You can analyze and apply safe fixes to files and directories using the lint command with the `--apply` parameter:

```bash
yarn biome lint --apply <files>
```
Or using default script to run lint defined on `package.json`:

```bash
yarn lint
```

You can apply both with the check command:

```bash
yarn biome check --apply <files>
```
Or using default script to run check defined on `package.json`:

```bash
yarn check
```
The check command runs multiple tools at once. So far, it:
