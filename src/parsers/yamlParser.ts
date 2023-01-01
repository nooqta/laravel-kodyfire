// @ts-ignore
import { strings } from "@angular-devkit/core";
import pluralize from "pluralize";

export class YamlParser {
  parse(data: any) {
    try {
      const { currentImport, yaml } = data;
      data.fields = [];
      data.relations = [];
      data.rules = [];

      // Parse the fields section of the model
      for (const [fieldName, fieldData] of Object.entries(
        currentImport.fields
      )) {
        let multipleFields = fieldName.split(",");
        // @ts-ignore
        let [fieldType, ...options] = fieldData.split(" ");
        options = options.map((opt: any) => {
          const [key, value = ""] = opt.split(":").map((e: any) => e.trim());
          return { key, value };
        });
        if (multipleFields.length > 1) {
          multipleFields.forEach((field: any) => {
            data.fields.push({
              name: field.trim(),
              type: fieldType,
              options,
              arguments: [],
            });
          });
          // Parse arguments
        } else {
          let args = [];
          const fieldParts = fieldType.split(":");
          if (fieldParts.length > 1) {
            fieldType = fieldParts[0];
            const argumentString = fieldParts[1];
            if (argumentString.includes("[")) {
              // Array type
              args = argumentString.slice(1, -1).split(",");
            } else if (argumentString.includes(",")) {
              // Tuple type
              args = argumentString.split(",");
            } else if (yaml.config.enum[argumentString]) {
              // Enum type
              args = [
                yaml.config.enum[argumentString]
                  .split(",")
                  .map((e: string) => `'${e.trim()}'`),
              ];
              fieldType = "enum";
            } else {
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
      for (const [relationType, relationData] of Object.entries(
        currentImport.relations
      )) {
        // @ts-ignore
        for (const relation of relationData.split(",")) {
          let [relatedModel, methodName, foreignKey] = relation.split(":");
          foreignKey = foreignKey || `${strings.underscore(relatedModel)}_id`;
          if (["hasMany", "belongsToMany"].includes(relationType)) {
            methodName =
              methodName || `${pluralize(strings.camelize(relatedModel))}`;
          } else {
            methodName = methodName || `${strings.camelize(relatedModel)}`;
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
          .map((e: any) => `'${e.trim()}'`)
          .join(",");
      }
      if (currentImport.rules) {
        for (const [ruleName, ruleData] of Object.entries(
          currentImport.rules
        )) {
          data.rules.push({
            key: ruleName,
            value: ruleData,
          });
        }
      }
      data.fillable = data.fields
        //   .filter((field: any) => currentImport.hidden && !currentImport.hidden.includes(field.name))
        .map((e: any) => `'${strings.underscore(e.name)}'`)
        .join(",");
      data.casts = data.fields
        .filter((field: any) =>
          ["json", "date", "dateTime", "boolean"].includes(field.type)
        )
        .map((e: any) => `'${e.name}' => '${e.type}'`)
        .join(",\n\t\t");
    } catch (error) {
      // console.log(error);
    }
    
    return data;
  }
}
