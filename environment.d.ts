declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: 'development' | 'production';
            DB_USERNAME: string;
            DB_PASSWORD: string;
            DB_HOST: string;
            DB_PORT: string;
            SERVER_PORT:string;
            DB_DATABASE_NAME: string;
            WS_STREAMLINK: string;
            JWT_SECRET: string;
            DEVICE_SECRET: string;
            EMAIL_FROM_ADDR: string;
            EMAIL_USER: string;
            EMAIL_USER_PASS: string;
            EMAIL_HOST: string;
            EMAIL_VIEWS_PATH: string;
            CONFIRM_EMAIL_LINK: string;
        }
    }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export { }