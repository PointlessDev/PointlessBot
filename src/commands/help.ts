/**
 * Created by Pointless on 1/08/17.
 */
import {Command} from 'discordthingy';
import {Message} from 'discord.js';

export default class HelpCommand {
  @Command('help')
  public async help(message: Message): Promise<Message> {
    return message.reply('Hahahahaha, you actually think I document the commands this can do?!') as Promise<Message>;
  }
}