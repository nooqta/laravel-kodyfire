import { IConcept, ITechnology } from 'kodyfire-core';
import { join, relative } from 'path';
import { strings } from '@angular-devkit/core';

import { Concept as BaseConcept } from './concept';

export class Listener extends BaseConcept {
  constructor(concept: Partial<IConcept>, technology: ITechnology) {
    super(concept, technology);

  }

  async generate(_data: any) {
    _data.template = this.resolveTemplateName(_data.template, this.name);
    _data.outputDir = _data.outputDir || '';
    const template = await this.engine.read(
      join(this.getTemplatesPath(), this.template.path),
      _data.template
    );
    _data.class = `${strings.classify(_data.name)}Listener`;
    const compiled = this.engine.compile(template, _data);

    await this.engine.createOrOverwrite(
      this.technology.rootDir,
      this.outputDir,
      this.getFilename(_data),
      compiled
    );
  }

  getFilename(data: any) {
    if (data.filename) return data.filename;
    return join(
      data.outputDir,
      `${strings.classify(data.class)}.php`
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
