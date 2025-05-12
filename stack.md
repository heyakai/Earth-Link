# Tech Stack for Earth Link Project

## Frontend
- **Framework**: 
  - [Next.js](https://nextjs.org/) - A React framework for server-side rendering and static site generation.
  
- **Library**: 
  - [React](https://reactjs.org/) - A JavaScript library for building user interfaces.
  - [React DOM](https://reactjs.org/docs/react-dom.html) - Provides DOM-specific methods for React.

- **Styling**: 
  - [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework for rapid UI development.
  
- **Fonts**: 
  - Google Fonts integration via Next.js.

## Backend
- **Database**: 
  - [Better SQLite3](https://github.com/JoshuaWise/better-sqlite3) - A fast and simple SQLite3 library for Node.js.

## Build Tools
- **TypeScript**: 
  - A superset of JavaScript that adds static types, enhancing code quality and maintainability.
  
- **Linting**: 
  - [ESLint](https://eslint.org/) - A tool for identifying and fixing problems in JavaScript code.

- **PostCSS**: 
  - A tool for transforming CSS with JavaScript plugins, used here with Tailwind CSS.

## Mapping
- **Mapbox GL JS**: 
  - A JavaScript library for interactive, customizable maps.

## Environment Management
- **Node.js**: 
  - JavaScript runtime built on Chrome's V8 JavaScript engine, used for server-side development.

## Development Tools
- **Version Control**: 
  - Git, with a `.gitignore` file to manage dependencies and environment files.

## Additional Notes
- Ensure to manage environment variables securely, especially for sensitive information like API keys (e.g., Mapbox token).
- Follow best practices for TypeScript and React to maintain code quality and readability.