"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlantumlParser = void 0;
class PlantumlParser {
    parse(data) {
        const { import: imports, currentImport } = data;
        data.relations = imports.filter((e) => e.left && e.left === currentImport.name && e.leftCardinality === '1');
        data.models = imports.filter((e) => e.constructor.name === 'Class');
        data.fields = currentImport.members
            .filter((e) => e.accessor === '+')
            .map((e) => {
            if (data.models.find((m) => {
                return m.name === e.type && m.constructor.name === 'Class';
            })) {
                e.name = `${e.type.toLowerCase()}_id`;
            }
            return Object.assign(Object.assign({}, e), { arguments: [] });
        });
        return data;
    }
}
exports.PlantumlParser = PlantumlParser;
//# sourceMappingURL=plantumlParser.js.map