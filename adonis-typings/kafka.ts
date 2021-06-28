declare module '@ioc:halcyon-agile/adonis-kafka' {
  /**
   * Define the config properties on this interface and they will appear
   * everywhere.
   */
  export interface KafkaConfig {
    enabled: string
    clientId: string
    groupId: string
    url: string
    port: number
    urls?: string
    fromBeginning: boolean
    autoCommit: boolean
    connectionTimeout?: number
    requestTimeout?: number
    partitionsConcurrently?: number
    logLevel: any
  }

  export interface KafkaContract {
    start?: (...args: any[]) => void
    on?: (...args: any[]) => void
    send?: (topic: string, data: object) => void
    disconnect?: () => void
  }

  const Kafka: KafkaContract

  export * from 'kafkajs'

  export default Kafka
}
