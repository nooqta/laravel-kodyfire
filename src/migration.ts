import { IConcept, ITechnology } from 'kodyfire-core';
import { join, relative } from 'path';
import { strings } from '@angular-devkit/core';

import { Concept as BaseConcept } from './concept';
const moment = require('moment');
const pluralize = require('pluralize');

export class Migration extends BaseConcept {
  constructor(concept: Partial<IConcept>, technology: ITechnology) {
    super(concept, technology);
  }

  async generate(_data: any) {
    const fieldsTemplate = await this.engine.read(
      join(this.getTemplatesPath(), this.template.path, 'migration'),
      'fields.template'
    );
    this.engine.builder.registerPartial('fields', fieldsTemplate);

      _data = await this.prepareData(_data);
    const template = await this.engine.read(
      join(this.getTemplatesPath(), this.template.path),
      _data.template
    );
    const filename = await this.getFilename(_data);

    const compiled = this.engine.compile(template, _data);

    await this.engine.createOrOverwrite(
      this.technology.rootDir,
      this.outputDir,
      filename,
      compiled
    );
  }

  async wait(ms: number) {
    const now = moment();
    const afterXms = moment().add(ms, 'ms');
    do {
      now.add(1, 'ms');
    } while (!afterXms.isSame(now));
  }
  async getFilename(data: any) {
    if (data.filename) return data.filename;
    // Check if a file exists in the migration folder
    const files = await this.engine.getFiles(
      this.technology.rootDir,
      this.outputDir
    );
    const suffix = `_create_${strings.dasherize(
      pluralize(data.name)
    )}_table.php`;
    const file = files.find((f: any) => f.includes(suffix));
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
    return join(
      data.outputDir,
      `${y}_${m}_${d}_${s}${ms}${suffix}.php`
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
}
