# Laravel-kodyfire
![Version](https://img.shields.io/badge/version-0.0.18-blue.svg?cacheSeconds=2592000)
[![Documentation](https://img.shields.io/badge/documentation-yes-brightgreen.svg)](https://github.com/nooqta/kodyfire#install-a-kody)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/nooqta/kodyfire/blob/main/LICENSE)

> Generate Laravel models, migrations and more using [Kodyfire](https://github.com/nooqta/kodyfire).

### 🏠 [Homepage](https://github.com/nooqta/kodyfire)

## Requirements

laravel-kodyfire requires the [kodyfire-cli](https://github.com/nooqta/kodyfire) to be installed

```sh
npm install -g kodyfire-cli
```
## Install

```sh
npm i laravel-kodyfire
```

## Usage

### Method 1: As a generator
In order to generate your artifacts, run the `generate` command. The syntax is `kody generate|g [kody] [concept]`. If you ommit `kody` and `concept` the assistant will prompt you to select them. As an example, run the following command from your terminal:
```sh
kody generate laravel model
```

### Method 2: As an importer
You can use a source containing the definition of the artifacts you want to create at once. Available sources: yaml, plantuml(class diagram).  As an example, A declaration for the yaml laravel source import file might look like the following
```yaml
models:
  user:
    fields:
      name: string
      email: string nullable unique
      status: enum:active,inactive default:active
      password,phone,role: string nullable
      email_verified_at: timestamp nullable
    hidden: password
    relations:
      belongsTo: Company
	  ...
```

After adding your definitions, run the following command to import your assets.

```sh
kody import laravel migration,model -s import.yaml
```

### Available concepts 

#### `concept` (default)
> Generates a generic concept

##### Usage
```bash
kody g laravel yourConcept
```
##### Arguments

- `kody` _string_ - The name of the kody. Laravel in our case. You can have multiple kodies installed. To list your installed kodies with your project run `kody list`
- `concept` _string_ - The name of the concept you want to execute. To list the concepts of your installed kody (laravel), run `kody list laravel` 
- `name` _string_ - The name that will be used to generate your artifact.

##### Options
 - `-i,--include <includes>`      Comma separated list of concepts to include. (e.g. -i concept1,concept2).
                                  To list available concepts use the list command (e.g. kody list kodyname)
- `-o,--overwrites <overwrites>`  Overwrite some default schema like the template name you want to use
- `-m,--multiple`                Generate multiple artifacts
- `-p,--persist`                 Persist the generated artifact
- `-h, --help`                    Display help for command



## 📅 Future Features
- ~~Incorporate Laravel default stubs as base templates~~
- ~~Generate migration: allow adding fields and relations~~
- ~~Import and generate models from a plantuml class diagram~~

## Author
Anis Marrouchi
* Website: https://noqta.tn
* Twitter: [@anis\_marrouchi](https://twitter.com/anis\_marrouchi)
* GitHub: [@anis-marrouchi](https://github.com/anis-marrouchi)
* LinkedIn: [@marrouchi](https://linkedin.com/in/marrouchi)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!

Feel free to check [issues page](https://github.com/nooqta/laravel-kodyfire/issues). 

## Show your support

Give a ⭐️ if this project helped you!

## Credits

- [kodyfire](https://github.com/nooqta/kodyfire) by [nooqta](https://github.com/nooqta) The kodyfire generator.

## 📝 License

Copyright © 2022 [Anis Marrouchi](https://github.com/anis-marrouchi).

This project is [MIT](https://github.com/nooqta/kodyfire/blob/main/LICENSE) licensed.

***
_This README was generated with ❤️ by [readme-kodyfire](https://github.com/nooqta/readme-kodyfire)_
