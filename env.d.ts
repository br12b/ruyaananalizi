// TypeScript'in 'process' nesnesini tanıması ve API_KEY'i tiplemesi için global tanımlama.
// Mevcut NodeJS namespace'ini genişleterek çakışmayı önlüyoruz.

declare namespace NodeJS {
  interface ProcessEnv {
    API_KEY: string;
    [key: string]: string | undefined;
  }
}
