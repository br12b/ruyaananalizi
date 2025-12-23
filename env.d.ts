// TypeScript'in 'process' nesnesini tanıması için global tanımlama.
// Bu, hem tarayıcı tarafında (Vite tarafından değiştirilen process.env)
// hem de build sırasında (vite.config.ts içinde process.cwd) gereklidir.

declare namespace NodeJS {
  interface ProcessEnv {
    API_KEY: string;
  }
}
