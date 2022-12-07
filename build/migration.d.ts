import { IConcept, ITechnology } from 'kodyfire-core';
import { Concept as BaseConcept } from './concept';
export declare class Migration extends BaseConcept {
    constructor(concept: Partial<IConcept>, technology: ITechnology);
    generate(_data: any): Promise<void>;
    wait(ms: number): Promise<void>;
    getFilename(data: any): Promise<any>;
    getExtension(templateName: string, defaultExtension?: string): string | undefined;
    getTemplatesPath(): string;
}
