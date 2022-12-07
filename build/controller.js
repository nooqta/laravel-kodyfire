"use strict";
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
exports.Controller = void 0;
const path_1 = require("path");
const core_1 = require("@angular-devkit/core");
const concept_1 = require("./concept");
class Controller extends concept_1.Concept {
    constructor(concept, technology) {
        super(concept, technology);
    }
    generate(_data) {
        return __awaiter(this, void 0, void 0, function* () {
            _data.template = this.resolveTemplateName(_data.template, this.name);
            const template = yield this.engine.read((0, path_1.join)(this.getTemplatesPath(), this.template.path), _data.template);
            _data.class = `${core_1.strings.classify(_data.name)}Controller`;
            const compiled = this.engine.compile(template, _data);
            yield this.engine.createOrOverwrite(this.technology.rootDir, this.outputDir, this.getFilename(_data), compiled);
        });
    }
    getFilename(data) {
        if (data.filename)
            return data.filename;
        return (0, path_1.join)(data.outputDir, `${core_1.strings.classify(data.class)}.php`);
    }
    getExtension(templateName, defaultExtension = '.php') {
        return templateName.replace('.template', defaultExtension).split('.').pop();
    }
    getTemplatesPath() {
        return this.technology.params.templatesPath
            ? this.technology.params.templatesPath
            : (0, path_1.relative)(process.cwd(), __dirname);
    }
}
exports.Controller = Controller;
//# sourceMappingURL=controller.js.map