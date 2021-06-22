declare module '@ioc:halcyon-agile/adonis-kafka' {
  import * as kafkajs from 'kafkajs'

  /**
   * Define the config properties on this interface and they will appear
   * everywhere.
   */
  export interface KafkaConfig {
    clientId: string
    groupId: string
    brokers: string[]
    autoCommit: boolean
    connectionTimeout?: number
    requestTimeout?: number
    partitionsConcurrently?: number
  }

  export interface KafkaContract {
    start?: (...args: any[]) => void
    on?: (...args: any[]) => void
    send?: (topic: string, data: object) => void
    disconnect?: () => void
  }

  const Kafka: KafkaContract

  export default Kafka
}
