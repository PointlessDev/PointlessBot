/**
 * Created by Pointless on 23/07/17.
 */
import {Arguments, Command, CommandConstructionData, Responder} from 'discordthingy';
import {Message, TextChannel, DMChannel, GroupDMChannel } from 'discord.js';

interface Thing {
  TextChannel|DMChannel
};

export default class EmbedCommands {
  constructor({responder}: CommandConstructionData) {
    this.responder = responder;
  }

  @Command('embed')
  embed(message: Message, args: Arguments) {
    if(!args[1]) return this.responder.fail(message, "Please mention a message");

    this.getMessage(args[1], message.channel).then(m => {
      if(!m){
        return msg.failure("Couldn't find a message");
      }
      message.channel.send(embedForMessage(m)).then(() => message.delete()).catch(e => msg.logError(e, "Sending embed"))
    }).catch(e => msg.logError(e, "Fetching message"))
  }

  async getMessage(id: string, channel: TextChannel|DMChannel|GroupDMChannel){
    if(channel.messages.get(id))
      return channel.messages.get(id);
    else
      return await channel.fetchMessage(id);
  }

  responder: Responder
}