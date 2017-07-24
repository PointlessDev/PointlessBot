/**
 * Created by Pointless on 22/07/17.
 */
import {Message, Client} from 'discord.js';
import {Command, Responder, CommandConstructionData} from 'discordthingy';

export default class DiscrimFinderCommand {
  constructor({client, responder}: CommandConstructionData) {
    this.client = client;
    this.responder = responder;
  }

  @Command('findDiscrim')
  async findDiscrim(message: Message) {
    let matches = message.client.users.filter(user => user.discriminator === message.author.discriminator);

    if(!matches.size) return this.responder.fail(message, 'Found nothing, try again later?');

    let response = `Found the following people with the discriminator '${message.author.discriminator}':
` + matches.map(match => ` - ${match.tag === message.author.tag ? '**[YOU]**' : ''} ${match.tag}`).join("\n");

    message.reply(response).catch(this.responder.rejection(message, 'Replying in discrim command'));
  }

  client: Client;
  responder: Responder;
}