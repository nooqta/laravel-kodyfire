export declare const concept: {
    type: string;
    properties: {
        name: {
            type: string;
        };
        template: {
            type: string;
            enum: string[];
            default: string;
        };
        outputDir: {
            type: string;
            default: string;
        };
    };
};
export declare const model: {
    type: string;
    properties: {
        name: {
            type: string;
        };
        template: {
            type: string;
            enum: string[];
            default: string;
        };
        outputDir: {
            type: string;
            default: string;
        };
    };
    required: string[];
};
export declare const conceptArray: {
    type: string;
    items: {
        type: string;
        properties: {
            name: {
                type: string;
            };
            template: {
                type: string;
                enum: string[];
                default: string;
            };
            outputDir: {
                type: string;
                default: string;
            };
        };
    };
};
export declare const modelArray: {
    type: string;
    items: {
        type: string;
        properties: {
            name: {
                type: string;
            };
            template: {
                type: string;
                enum: string[];
                default: string;
            };
            outputDir: {
                type: string;
                default: string;
            };
        };
        required: string[];
    };
};
declare let schema: any;
export { schema };
