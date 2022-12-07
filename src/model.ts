import { IConcept, ITechnology } from 'kodyfire-core';
import { join, relative } from 'path';
import { strings } from '@angular-devkit/core';
import * as parsers from './parsers';
const pluralize = require('pluralize');

import { Concept as BaseConcept } from 'basic-kodyfire';
import { Engine } from './engine';
export class Model extends BaseConcept {
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
      return value.toLowerCase();
    });

    this.engine.builder.registerHelper('hasId', (value: any) => {
      return value.includes('_id');
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
    if(_data.import) {
      _data = this.prepareData(_data);
    }
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
    return `${name.toLowerCase()}.${templateName}${this.extension}.template`;
  }

  getFilename(data: any) {
    if (data.filename) return data.filename;
    return join(
      data.outputDir,
      `${strings.classify(data.name)}.${this.getExtension(data.template)}`
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

  prepareData(_data: any): any {
    const { parser } = _data;
    // @ts-ignore
    // We dynamically instantiate the parser class
    const currentParser = new (<any>parsers)[strings.capitalize(`${parser}Parser`)]();
    return currentParser.parse(_data);
  }
}
