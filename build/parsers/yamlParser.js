"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.YamlParser = void 0;
// @ts-ignore
const core_1 = require("@angular-devkit/core");
const pluralize_1 = __importDefault(require("pluralize"));
class YamlParser {
    parse(data) {
        try {
            const { currentImport, yaml } = data;
            data.fields = [];
            data.relations = [];
            data.rules = [];
            // Parse the fields section of the model
            for (const [fieldName, fieldData] of Object.entries(currentImport.fields)) {
                let multipleFields = fieldName.split(",");
                // @ts-ignore
                let [fieldType, ...options] = fieldData.split(" ");
                options = options.map((opt) => {
                    const [key, value = ""] = opt.split(":").map((e) => e.trim());
                    return { key, value };
                });
                if (multipleFields.length > 1) {
                    multipleFields.forEach((field) => {
                        data.fields.push({
                            name: field.trim(),
                            type: fieldType,
                            options,
                            arguments: [],
                        });
                    });
                    // Parse arguments
                }
                else {
                    let args = [];
                    const fieldParts = fieldType.split(":");
                    if (fieldParts.length > 1) {
                        fieldType = fieldParts[0];
                        const argumentString = fieldParts[1];
                        if (argumentString.includes("[")) {
                            // Array type
                            args = argumentString.slice(1, -1).split(",");
                        }
                        else if (argumentString.includes(",")) {
                            // Tuple type
                            args = argumentString.split(",");
                        }
                        else if (yaml.config.enum[argumentString]) {
                            // Enum type
                            args = [
                                yaml.config.enum[argumentString]
                                    .split(",")
                                    .map((e) => `'${e.trim()}'`),
                            ];
                            fieldType = "enum";
                        }
                        else {
                            // Other scalar type
                            args = [argumentString];
                        }
                    }
                    data.fields.push({
                        name: fieldName,
                        type: fieldType,
                        options,
                        arguments: args,
                    });
                }
            }
            // Parse the relations section of the model
            for (const [relationType, relationData] of Object.entries(currentImport.relations)) {
                // @ts-ignore
                for (const relation of relationData.split(",")) {
                    let [relatedModel, methodName, foreignKey] = relation.split(":");
                    foreignKey = foreignKey || `${core_1.strings.underscore(relatedModel)}_id`;
                    if (["hasMany", "belongsToMany"].includes(relationType)) {
                        methodName =
                            methodName || `${(0, pluralize_1.default)(core_1.strings.camelize(relatedModel))}`;
                    }
                    else {
                        methodName = methodName || `${core_1.strings.camelize(relatedModel)}`;
                    }
                    data.relations.push({
                        type: relationType,
                        model: relatedModel,
                        methodName,
                        foreignKey,
                    });
                }
            }
            if (currentImport.hidden) {
                data.hidden = currentImport.hidden
                    .split(",")
                    .map((e) => `'${e.trim()}'`)
                    .join(",");
            }
            if (currentImport.rules) {
                for (const [ruleName, ruleData] of Object.entries(currentImport.rules)) {
                    data.rules.push({
                        key: ruleName,
                        value: ruleData,
                    });
                }
            }
            data.fillable = data.fields
                //   .filter((field: any) => currentImport.hidden && !currentImport.hidden.includes(field.name))
                .map((e) => `'${core_1.strings.underscore(e.name)}'`)
                .join(",");
            data.casts = data.fields
                .filter((field) => ["json", "date", "dateTime", "boolean"].includes(field.type))
                .map((e) => `'${e.name}' => '${e.type}'`)
                .join(",\n\t\t");
        }
        catch (error) {
            // console.log(error);
        }
        return data;
    }
}
exports.YamlParser = YamlParser;
//# sourceMappingURL=yamlParser.js.map