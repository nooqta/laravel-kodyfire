import { Parser as BaseParser, Validator } from 'basic-kodyfire';
import { schema } from '.';

export class Parser extends BaseParser {

  constructor(_schema = schema) {
    super(new Validator(_schema));
  }
  reader(source: string) {
    return this.readfile(source);
  }

  parse(data: any) {
    if (!this.validate(data)) {
      return false;
    }
    this.data = data;
    return data;
  }

  validate = (data: any) => {
    return this.validator.validate(data);
  };
}
