<h2>A Kafka</a> provider for <a href="https://adonisjs.com/">AdonisJS</a>

</br>

<h2>
Adonis Kafka provides an easy way to start using Kafka.
</h2>

<div>

[![npm-image]][npm-url] ![][typescript-image] [![license-image]][license-url] [![synk-image]][synk-url]

</div>

</br>

> API is based on https://github.com/Frubana/adonis-kafka and depends on [kafkajs](https://kafka.js.org/)

</br>

## Getting Started

Let's start by installing the package in our project.

**Yarn**:

```sh
yarn add @halcyon-agile/adonis-kafka
```

**NPM**:

```sh
npm install @halcyon-agile/adonis-kafka
```

### Config

`config/kafka.ts`

```ts
import Env from '@ioc:Adonis/Core/Env'

const kafkaConfig = {
  clientId: Env.get('KAFKA_CLIENT_ID', 'default-client'),
  groupId: Env.get('KAFKA_GROUP_ID', 'default-group'),
  brokers: ['localhost:9092'],
  autoCommit: false,
}

export default kafkaConfig
```

### Manually register the provider :)

.adonisrc.json

```json
"providers": [
  "./providers/AppProvider",
  "@adonisjs/core",
  "@halcyon-agile/adonis-kafka"
]
```

### Adding Topics

```sh
node ace make:prldfile kafka
```

```ts
// start/kafka.ts
import Kafka from '@ioc:Kafka'

// Callback function
Kafka.on('topic_name', async (data, commit) => {
  commit() // For successful transaction
  commit(false) // For failed transaction
})

// Multiple topics
Kafka.on('topic_name_1,topic_name_2,topic_name_3', async (data, commit) => {
  commit() // For successful transaction
  commit(false) // For failed transaction
})
```

[typescript-image]: https://img.shields.io/badge/Typescript-294E80.svg?style=for-the-badge&logo=typescript
[typescript-url]: "typescript"
[npm-image]: https://img.shields.io/npm/v/@halcyon-agile/adonis-kafka.svg?style=for-the-badge&logo=npm
[npm-url]: https://npmjs.org/package/@halcyon-agile/adonis-kafka 'npm'
[license-image]: https://img.shields.io/npm/l/@halcyon-agile/adonis-kafka?color=blueviolet&style=for-the-badge
[license-url]: LICENSE.md 'license'
[synk-image]: https://img.shields.io/snyk/vulnerabilities/github/halcyon-agile/adonis-kafka?label=Synk%20Vulnerabilities&style=for-the-badge
[synk-url]: https://snyk.io/test/github/halcyon-agile/adonis-kafka?targetFile=package.json 'synk'
