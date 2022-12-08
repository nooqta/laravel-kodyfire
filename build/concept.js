"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Concept = void 0;
const path_1 = require("path");
const core_1 = require("@angular-devkit/core");
const parsers = __importStar(require("./parsers"));
const pluralize = require('pluralize');
const basic_kodyfire_1 = require("basic-kodyfire");
const engine_1 = require("./engine");
class Concept extends basic_kodyfire_1.Concept {
    constructor(concept, technology) {
        super(concept, technology);
        this.extension = '.php';
        this.engine = new engine_1.Engine();
        // Register functions you want to use in your templates with the engine builder registerHelper method.
        this.engine.builder.registerHelper('uppercase', (value) => {
            return value.toUpperCase();
        });
        this.engine.builder.registerHelper('pluralize', (value) => {
            return pluralize(value);
        });
        this.engine.builder.registerHelper('lowercase', (value) => {
            return value === null || value === void 0 ? void 0 : value.toLowerCase();
        });
        this.engine.builder.registerHelper('hasId', (value) => {
            return value.includes('_id');
        });
        for (const key in core_1.strings) {
            this.engine.builder.registerHelper(key, (value) => {
                /* @ts-ignore */
                return core_1.strings[key](value);
            });
        }
    }
    generate(_data) {
        return __awaiter(this, void 0, void 0, function* () {
            const template = yield this.engine.read((0, path_1.join)(this.getTemplatesPath(), this.template.path), _data.template);
            _data.class = core_1.strings.classify(_data.name);
            if (_data.import) {
                _data = this.prepareData(_data);
            }
            const compiled = this.engine.compile(template, _data);
            yield this.engine.createOrOverwrite(this.technology.rootDir, this.outputDir, this.getFilename(_data), compiled);
        });
    }
    // resolve template name if it does not have template extension
    resolveTemplateName(templateName, name) {
        if (templateName.includes('.template'))
            return templateName;
        return `${name.toLowerCase()}.${templateName}${this.extension}.template`;
    }
    getFilename(data) {
        if (data.filename)
            return data.filename;
        return (0, path_1.join)(data.outputDir, `${data.name}.${data.extension || this.getExtension(data.template)}`);
    }
    getExtension(templateName, defaultExtension = '.php') {
        return templateName.replace('.template', defaultExtension).split('.').pop();
    }
    getTemplatesPath() {
        return this.technology.params.templatesPath
            ? this.technology.params.templatesPath
            : (0, path_1.relative)(process.cwd(), __dirname);
    }
    prepareData(_data) {
        const { parser } = _data;
        // @ts-ignore
        // We dynamically instantiate the parser class
        const currentParser = new parsers[core_1.strings.capitalize(`${parser}Parser`)]();
        return currentParser.parse(_data);
    }
}
exports.Concept = Concept;
//# sourceMappingURL=concept.js.map