import { Technology as BaseTechnology } from 'basic-kodyfire';
export declare class Technology extends BaseTechnology {
    constructor(params: any, _assets?: {
        name: string;
        version: string;
        rootDir: string;
        concepts: ({
            name: string;
            source: string;
            outputDir: string;
            template: {
                path: string;
                options: never[];
                placeholders: never[];
            };
        } | {
            name: string;
            source: string;
            outputDir: string;
            template: {
                path: string;
                options: string[];
                placeholders?: undefined;
            };
        })[];
    });
    initConcepts(): void;
    updateTemplatesPath(params: any): void;
}
