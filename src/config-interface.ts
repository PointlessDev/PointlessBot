/**
 * Created by Pointless on 23/07/17.
 */
interface Config {
  owner: string,
  logChannel: string,
  bots: {
    token: string,
    owner?: string,
    logChannel?: string
  }[]
}

export default Config;