import { IConcept, ITechnology } from 'kodyfire-core';
import { Concept as BaseConcept } from './concept';
export declare class Model extends BaseConcept {
    extension: string;
    constructor(concept: Partial<IConcept>, technology: ITechnology);
    generate(_data: any): Promise<void>;
    getFilename(data: any): any;
    getExtension(templateName: string, defaultExtension?: string): string | undefined;
    getTemplatesPath(): string;
    prepareData(_data: any): any;
}
