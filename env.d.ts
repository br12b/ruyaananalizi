// TypeScript derleyicisi için global 'process' tanımı.
// Bu dosya, projenin derleme aşamasında 'process is not defined' hatası almasını engeller.

declare namespace NodeJS {
  interface ProcessEnv {
    API_KEY: string;
    [key: string]: string | undefined;
  }
}
