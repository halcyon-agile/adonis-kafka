import Consumer from './Consumer'
import Producer from './Producer'
import { KafkaContract } from '@ioc:halcyon-agile/adonis-kafka'

class Kafka implements KafkaContract {
  public consumer
  public producer
  public config
  public Logger

  constructor(config, Logger) {
    this.config = config.get('kafka')
    this.Logger = Logger
  }

  public start() {
    const { groupId } = this.config

    if (groupId === null || groupId === undefined || groupId === '') {
      throw new Error('You need define a group')
    }

    this.consumer = new Consumer(this.config)
    this.producer = new Producer(this.config)

    this.consumer.start().catch((e) => this.Logger.error(`[consumer] ${e.message}`, e))

    this.producer.start()
  }

  public on(topic, callback) {
    if (this.config.enabled !== 'true') return callback
    this.consumer.on(topic, callback)
  }

  public send(topic, data) {
    if (this.config.enabled !== 'true') return
    this.producer.send(topic, data)
  }

  public async disconnect() {
    await this.consumer.consumer.disconnect()
  }
}

export default Kafka
