/**
 * Created by Pointless on 1/08/17.
 */
import {DiscordThingy, CommandClass, Command} from 'discordthingy';
import {Message} from 'discord.js';
import * as process from 'process';
import {version as discordVersion} from 'discord.js';
import {hostname} from 'os';

export default class StatusCommand {
  constructor(private thingy: DiscordThingy) {}
  @Command()
  public async ping(message: Message): Promise<void> {
    const latency = Date.now() - message.createdAt.getTime();

    message.channel.send({embed: {
      color: 0x4CAF50,
      description: 'Pong!',
      fields: [
        {
          inline: true,
          name: 'Ping',
          value: message.client.ping + 'ms'
        },
        {
          inline: true,
          name: 'Latency',
          value: latency < 0 ? ':shrug:' : latency + 'ms'
        }
      ],
      footer: {
        icon_url: message.client.users.get(this.thingy.owner).displayAvatarURL,
        text: `Pointless Bot v${require('../../package.json').version}`
      }
    }});
  }
  @Command()
  public async uptime(message: Message): Promise<void> {
    const uptime = process.uptime();

    message.channel.send({embed: {
      color: 0x4CAF50,
      description: `This Pointless Bot™ has been online for \
${Math.floor(uptime / 60 / 60)}hrs, ${Math.floor((uptime / 60) % 60)}mins, ${Math.floor(uptime % 60)}secs`,
      footer: {
        icon_url: message.client.users.get(this.thingy.owner).displayAvatarURL,
        text: `Pointless Bot v${require('../../package.json').version}`
      }
    }});
  }
  @Command()
  public async status(message: Message): Promise<void> {
    const uptime = process.uptime();
    const latency = Date.now() - message.createdAt.getTime();

    message.channel.send({embed: {
      color: 0x4CAF50,
      description: 'Pointless bots are online!',
      fields: [
        {
          name: 'Bot Uptime:',
          value: `${Math.floor(uptime / 60 / 60)}hrs, ${Math.floor((uptime / 60) % 60)}mins, ${Math.floor(uptime % 60)}secs`
        },
        {
          name: 'Machine:',
          value: `\`${process.env.ENV || process.env.ENVIRONMENT || 'Unknown'}\` build on \`${hostname() || 'no hostname, wtf?'}\``
        },
        {
          inline: true,
          name: 'Discord.js Ver:',
          value: discordVersion
        },
        {
          inline: true,
          name: 'Node.js Ver:',
          value: process.version
        },
        {
          inline: true,
          name: 'Ping',
          value: message.client.ping + 'ms'
        },
        {
          inline: true,
          name: 'Latency',
          value: latency < 0 ? 'System Time Incorrect' : latency + 'ms'
        }
      ],
      footer: {
        icon_url: message.client.users.get(this.thingy.owner).displayAvatarURL,
        text: `Pointless Bot v${require('../../package.json').version}`
      }
    }});
  }
}
