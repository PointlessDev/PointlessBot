/**
 * Created by Pointless on 22/07/17.
 */
import {Message, Client} from 'discord.js';
import {DiscordThingy, Command, Responder} from 'discordthingy';

export default class DiscrimFinderCommand {
  constructor(private thingy: DiscordThingy) {
    this.responder = thingy.responder;
  }

  @Command('findDiscrim')
  public async findDiscrim(message: Message): Promise<void> {
    let matches = message.client.users.filter(user => user.discriminator === message.author.discriminator);

    if(!matches.size) return void this.responder.fail(message, 'Found nothing, try again later?');

    let response = `Found the following people with the discriminator '${message.author.discriminator}':
` + matches.map(match => ` - ${match.tag === message.author.tag ? '**[YOU]**' : ''} ${match.tag}`).join("\n");

    message.reply(response).catch(this.responder.rejection(message, 'Replying in discrim command'));
  }

  private responder: Responder;
}
