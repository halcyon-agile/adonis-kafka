import { Kafka, logLevel } from 'kafkajs'
import { KafkaConfig } from '@ioc:halcyon-agile/adonis-kafka'

class Consumer {
  public config: KafkaConfig
  public topics: string[]
  public events: object
  public killContainer: boolean
  public timeout: any = 0
  public consumer

  constructor(config) {
    this.config = config
    this.topics = []
    this.events = {}
    this.killContainer = false
    this.timeout = null
    this.consumer = null

    const brokers = this.config.urls ? this.config.urls.split(',') : null

    const kafka = new Kafka({
      clientId: this.config.clientId || 'local',
      brokers: brokers || [`${this.config.url}:${this.config.port}`],
      connectionTimeout: this.config.connectionTimeout || 3000,
      requestTimeout: this.config.requestTimeout || 60000,
      logLevel: this.config.logLevel || logLevel.ERROR,
    })

    this.consumer = kafka.consumer({ groupId: this.config.groupId })
  }

  public async execute({ topic, partition, message }) {
    const result = JSON.parse(message.value.toString())

    const events = this.events[topic] || []

    const promises = events.map((callback) => {
      return new Promise<void>((resolve) => {
        callback(result, async (commit = true) => {
          if (this.config.autoCommit) {
            return
          }

          if (commit) {
            const offset = String(Number(message.offset))

            await this.consumer.commitOffsets([{ topic, partition, offset }])
          }

          resolve()
        })
      })
    })

    await Promise.all(promises)
  }

  public async start() {
    await this.consumer.connect()

    await this.consumer.run({
      partitionsConsumedConcurrently: this.config.partitionsConcurrently || 1,
      autoCommit: this.config.autoCommit || false,
      eachMessage: async ({ topic, partition, message }) =>
        this.execute({ topic, partition, message }),
    })
  }

  public async on(topic, callback) {
    let topicArray = topic

    if (typeof topic === 'string') {
      topicArray = topic.split(',')
    }

    topicArray.forEach(async (item) => {
      if (!item) {
        return
      }

      const events = this.events[item] || []

      events.push(callback)

      this.events[item] = events

      this.topics.push(item)

      await this.consumer.subscribe({
        topic: item,
        fromBeginning: true,
      })
    })
  }
}

export default Consumer
