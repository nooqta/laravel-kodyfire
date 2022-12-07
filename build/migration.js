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
exports.Migration = void 0;
const path_1 = require("path");
const core_1 = require("@angular-devkit/core");
const concept_1 = require("./concept");
const moment = require('moment');
const pluralize = require('pluralize');
class Migration extends concept_1.Concept {
    constructor(concept, technology) {
        super(concept, technology);
    }
    generate(_data) {
        return __awaiter(this, void 0, void 0, function* () {
            const fieldsTemplate = yield this.engine.read((0, path_1.join)(this.getTemplatesPath(), this.template.path, 'migration'), 'fields.template');
            this.engine.builder.registerPartial('fields', fieldsTemplate);
            if (_data.import) {
                _data = this.prepareData(_data);
            }
            const template = yield this.engine.read((0, path_1.join)(this.getTemplatesPath(), this.template.path), _data.template);
            const filename = yield this.getFilename(_data);
            const compiled = this.engine.compile(template, _data);
            yield this.engine.createOrOverwrite(this.technology.rootDir, this.outputDir, filename, compiled);
        });
    }
    wait(ms) {
        return __awaiter(this, void 0, void 0, function* () {
            const now = moment();
            const afterXms = moment().add(ms, 'ms');
            do {
                now.add(1, 'ms');
            } while (!afterXms.isSame(now));
        });
    }
    getFilename(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (data.filename)
                return data.filename;
            // Check if a file exists in the migration folder
            const files = yield this.engine.getFiles(this.technology.rootDir, this.outputDir);
            const suffix = `_create_${core_1.strings.dasherize(pluralize(data.name))}_table.php`;
            const file = files.find((f) => f.includes(suffix));
            if (file) {
                return file;
            }
            const date = new Date();
            const m = date.getMonth().toString().padStart(2, "0");
            const d = date.getDate().toString().padStart(2, "0");
            const y = date.getFullYear();
            const s = date.getTime();
            // await this.wait(1000);
            const ms = moment(date).add(300, 'milliseconds').toDate().getMilliseconds();
            return (0, path_1.join)(data.outputDir, `${y}_${m}_${d}_${s}${ms}${suffix}.php`);
        });
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
exports.Migration = Migration;
//# sourceMappingURL=migration.js.map