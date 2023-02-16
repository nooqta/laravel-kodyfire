// @ts-ignore
import { strings } from "@angular-devkit/core";

export class JsonParser {
  parse(data: any) {
    try {
      const { currentImport } = data;
      return { ...data, ...currentImport };
  } catch (e) {
    throw e;
    
  }
}
}
