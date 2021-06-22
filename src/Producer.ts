import { Kafka } from 'kafkajs'
import { KafkaConfig } from '@ioc:halcyon-agile/adonis-kafka'

class Producer {
  public config: KafkaConfig
  public producer

  constructor(config) {
    this.config = config

    const kafka = new Kafka({
      clientId: this.config.clientId,
      brokers: this.config.brokers,
      connectionTimeout: this.config.connectionTimeout || 3000,
      requestTimeout: this.config.requestTimeout || 60000,
    })

    this.producer = kafka.producer()
  }

  public async start() {
    await this.producer.connect()
  }

  public async send(topic, data) {
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
