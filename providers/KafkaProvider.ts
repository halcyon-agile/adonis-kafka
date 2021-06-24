/*
 * @halcyonjs-kafka
 *
 * (c) Jerico Pulvera <jerico.pulvera@outlook.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ApplicationContract } from '@ioc:Adonis/Core/Application'
import Kafka from '../src'

export default class KafkaProvider {
  constructor(protected application: ApplicationContract) {}

  public register() {
    this.application.container.singleton('halcyon-agile/adonis-kafka', () => {
      const Config = this.application.container.resolveBinding('Adonis/Core/Config')
      const Logger = this.application.container.resolveBinding('Adonis/Core/Logger')

      return new Kafka(Config, Logger)
    })

    this.application.container.alias('halcyon-agile/adonis-kafka', 'Kafka')
  }

  public boot() {
    const Config = this.application.container.resolveBinding('Adonis/Core/Config')
    if (String(Config.get('kafka.enabled')) === 'true') {
      this.application.container.use('halcyon-agile/adonis-kafka').start()
    }
  }

  public async shutdown() {
    const Config = this.application.container.resolveBinding('Adonis/Core/Config')
    if (String(Config.get('kafka.enabled')) === 'true') {
      await this.application.container.use('halcyon-agile/adonis-kafka').disconnect()
    }
  }
}
