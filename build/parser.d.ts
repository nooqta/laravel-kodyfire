import { Parser as BaseParser } from 'basic-kodyfire';
export declare class Parser extends BaseParser {
    constructor(_schema?: any);
    reader(source: string): any;
    parse(data: any): any;
    validate: (data: any) => boolean;
}
