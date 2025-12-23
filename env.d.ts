// TypeScript'in 'process' nesnesini tanıması için global tanımlama.
// Bu, hem tarayıcı tarafında (Vite tarafından değiştirilen process.env)
// hem de genel tip kontrolü için gereklidir.

declare namespace NodeJS {
  interface ProcessEnv {
    API_KEY: string;
    [key: string]: string | undefined;
  }
}
