import { Kafka, logLevel } from 'kafkajs'
import { KafkaConfig } from '@ioc:halcyon-agile/adonis-kafka'

class Producer {
  public config: KafkaConfig
  public producer

  constructor(config) {
    this.config = config

    const brokers = this.config.urls ? this.config.urls.split(',') : null

    const kafka = new Kafka({
      clientId: this.config.clientId,
      brokers: brokers || [`${this.config.url}:${this.config.port}`],
      connectionTimeout: this.config.connectionTimeout || 3000,
      requestTimeout: this.config.requestTimeout || 60000,
      logLevel: this.config.logLevel || logLevel.ERROR,
    })

    this.producer = kafka.producer()
  }

  public async start() {
    await this.producer.connect()
  }

  public async send(topic, data) {
    if (this.config.enabled !== 'true') {
      return
    }

    if (typeof data !== 'object') {
      throw new Error('You need send a json object in data argument')
    }

    let messages = Array.isArray(data) ? data : [data]
    messages = messages.map((message) => {
      if (!message.value) {
        message = {
          value: JSON.stringify(message),
        }
      }

      if (typeof message.value !== 'string') {
        message.value = JSON.stringify(message.value)
      }

      return message
    })

    await this.producer.send({
      topic,
      messages,
    })
  }
}

export default Producer
