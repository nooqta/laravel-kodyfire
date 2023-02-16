"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonParser = void 0;
class JsonParser {
    parse(data) {
        try {
            const { currentImport } = data;
            return Object.assign(Object.assign({}, data), currentImport);
        }
        catch (e) {
            throw e;
        }
    }
}
exports.JsonParser = JsonParser;
//# sourceMappingURL=jsonParser.js.map