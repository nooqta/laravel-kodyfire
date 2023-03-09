import { IConcept, ITechnology } from 'kodyfire-core';
import { join, relative } from 'path';
import { strings } from '@angular-devkit/core';
import * as parsers from './parsers';
const pluralize = require('pluralize');
const util = require('util');
const  exec = util.promisify(require('child_process').exec);
import { Concept as BaseConcept } from 'basic-kodyfire';
import { Engine } from './engine';
export class Concept extends BaseConcept {
  extension = '.php';
  constructor(concept: Partial<IConcept>, technology: ITechnology) {
    super(concept, technology);
    this.engine = new Engine();

    // Register functions you want to use in your templates with the engine builder registerHelper method.
    this.engine.builder.registerHelper('uppercase', (value: any) => {
      return value.toUpperCase();
    });
    this.engine.builder.registerHelper('pluralize', (value: any) => {
      return pluralize(value);
    });
    this.engine.builder.registerHelper('lowercase', (value: any) => {
      return value?.toLowerCase();
    });

    this.engine.builder.registerHelper('hasId', (value: any) => {
      return value.includes('_id');
    });
    this.engine.builder.registerHelper('stringify', (value: any) => {
      return JSON.stringify(value);
    });
    // @ts-ignore
    this.engine.builder.registerHelper('isEqual', (value1: any, value2: any, options: any) => {
      return value1 === value2;
    });
    // @ts-ignore
    this.engine.builder.registerHelper('includes', (value1: any, value2: any, options: any) => {
      return value1.includes(value2);
    });

    this.engine.builder.registerHelper('switch', function(value: any, options: { fn: (arg0: any) => any; }) {
      // @ts-ignore
      this.switch_value = value;
      // @ts-ignore
      return options.fn(this);
    });
    
    this.engine.builder.registerHelper('case', function(value: any, options: { fn: (arg0: any) => any; }) {
      // @ts-ignore
      if (value == this.switch_value) {
        // @ts-ignore
        return options.fn(this);
      }
    });
    // @ts-ignore
    this.engine.builder.registerHelper('default', function(value: any, options: any) {
        return true; ///We can add condition if needs
    });

    for (const key in strings) {
      this.engine.builder.registerHelper(key, (value: any) => {
        /* @ts-ignore */
        return strings[key](value);
      });
    }
  }

  async generate(_data: any) {
    const template = await this.engine.read(
      join(this.getTemplatesPath(), this.template.path),
      _data.template
    );
    _data.class = strings.classify(_data.name);
    _data = this.prepareData(_data);
    const compiled = this.engine.compile(template, _data);

    await this.engine.createOrOverwrite(
      this.technology.rootDir,
      this.outputDir,
      this.getFilename(_data),
      compiled
    );
  }

  // resolve template name if it does not have template extension
  resolveTemplateName(templateName: string, name: string) {
    if (templateName.includes('.template')) return templateName;
    templateName = templateName ? `.${templateName}` : '';
    return `${name.toLowerCase()}${templateName}${this.extension}.template`;
  }

  getFilename(data: any) {
    if (data.filename) return data.filename;
    return join(
      data.outputDir,
      `${data.name}.${data.extension || this.getExtension(data.template)}`
    );
  }

  getExtension(templateName: string, defaultExtension = '.php') {
    return templateName.replace('.template', defaultExtension).split('.').pop();
  }

  getTemplatesPath(): string {
    return this.technology.params.templatesPath
      ? this.technology.params.templatesPath
      : relative(process.cwd(), __dirname);
  }

  async prepareData(_data: any): Promise<any> {
    const { parser } = _data;
    const command = `php ${join(this.technology.rootDir, 'artisan')} model:show ${strings.classify(_data.name)} --json`;
    const { stdout, stderror } = await exec(command);
    if(!stderror) {
      const output = JSON.parse(stdout);
      _data.attributes = output.attributes.filter((attr: any) => attr.name != 'id');
      _data.relations = output.relations;
    }
    // @ts-ignore
    // We dynamically instantiate the parser class
    if(_data.import) {
    const currentParser = new (<any>parsers)[strings.capitalize(`${parser}Parser`)]();
    _data = currentParser.parse(_data);
    }
    return _data;
  }
}
