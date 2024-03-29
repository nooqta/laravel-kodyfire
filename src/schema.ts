export const concept = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    template: {
      type: 'string',
      enum: ['sample.html.template'],
      default: 'sample.html.template',
    },
    outputDir: { type: 'string', default: '' },
  },
};
export const model = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    template: {
      type: 'string',
      enum: ['model.php.template', 'model.pivot.php.template'],
      default: 'model.php.template',
    },
    outputDir: { type: 'string', default: '' },
  },
  required: ['name'],
};

const concepts = [{name: 'migration', namespace: 'Database\\Migrations', arguments: [
  { name: 'table', type: 'string' },
  { name: 'type', type: 'string', enum: ['create', 'update'], default: false },

], required: ['table', 'type']},
 {name: 'controller',  namespace: 'App\\Http\\Controllers\\API\\V1'},
 {name: 'model',  namespace: 'App\\Models'}, 
 {name: 'request',  namespace: 'App\\Http\\Requests'},
  {name: 'resource',  namespace: 'App\\Http\\Resources'},
  {name: 'collection',  namespace: 'App\\Http\\Resources'},
  { name: 'event',  namespace: 'App\\Events'},
  { name: 'listener',  namespace: 'App\\Listeners'},
  { name: 'subscriber',  namespace: 'App\\Listeners'},
  { name: 'observer',  namespace: 'App\\Observers'},
  { name: 'policy',  namespace: 'App\\Policies'},
  {name: 'factory',  namespace: 'Database\\Factories'},
  {name: 'seeder',  namespace: 'Database\\Seeders'},
  {name: 'test',  namespace: 'Tests\\Feature'},
  {name: 'testUnit',  namespace: 'Tests\\Unit'},
  {name: 'middleware',  namespace: 'App\\Http\\Middleware'},
  {name: 'repository',  namespace: 'App\\Repositories'},
]

const generateConceptSchema = (concept:any) => {
  let schema: any =  {
      type: 'object',
      properties: {
          name: { type: 'string' },
          namespace: { type: 'string', default: concept.namespace },
          template: {
              type: 'string',
              enum: [`${concept.name}.php.template`],
              default: `${concept.name}.php.template`,
          },
          outputDir: { type: 'string', default: '' },
      },
      required: ['name'],
  };
  if (concept.arguments) {
      concept.arguments.forEach((arg:any) => {
          schema.properties[arg.name] = {
          type: arg.type,
      ...(arg.enum && {enum: arg.enum}),
      ...(arg.default && {default: arg.default})
          }
      })
  }
  if(concept.required) {
      schema.required = [...schema.required, ...concept.required];
  }

  return schema;
};

  const generateConceptArray = (concept: any) => {
    return {
      type: 'array',
      items: generateConceptSchema(concept)
    }
  }
export const conceptArray = {
  type: 'array',
  items: concept,
};

export const modelArray = {
  type: 'array',
  items: model,
};

let schema: any = {
  type: 'object',
  properties: {
    project: { type: 'string' },
    name: { type: 'string' },
    rootDir: { type: 'string' },
    concept: conceptArray,
  }
};

concepts.forEach((concept) => {
  schema.properties[concept.name] = generateConceptArray(concept);
});

export {
  schema
};
