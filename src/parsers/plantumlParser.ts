// @ts-nocheck
import pluralize from 'pluralize';

export class PlantumlParser {
  
  parse(data: any) {
    const {import: imports, currentImport } = data;
    data.relations = imports.filter((e: any) => e.left && e.left === currentImport.name && e.leftCardinality === '1');
    data.models = imports.filter((e: any) => e.constructor.name === 'Class')
    data.fields = currentImport.members
    .filter((e: any) => e.accessor === '+')
    .map((e: any) => {
      if(data.models.find((m: any) => {
        return m.name === e.type && m.constructor.name === 'Class'
      })) {
        e.name = `${e.type.toLowerCase()}_id`;
      }
      return {
        ...e,
        arguments: []
      }
    });

    return data;
  }
}  