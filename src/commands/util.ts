/**
 * Created by Pointless on 15/07/17.
 */
import {Command, Authorization, Arguments, DiscordThingy, Responder} from 'discordthingy';
import {Message} from 'discord.js';

export default class UtilCommands {
  private responder: Responder;
  constructor(private thingy: DiscordThingy) {
    this.responder = thingy.responder;
  }
  @Command({
    authorization: Authorization.OWNER,
    name: 'testError'
  })
  public async other(message: Message) {
    message.reply('Throwing internal error...');
    this.responder.internalError(message, new Error('Testing Error'), 'Debug Info');
  }
  @Command()
  public async test(message: Message, args: Arguments) {
    message.reply(':thumbsup: Tested! Arguments:  = ' + args.contentFrom(1));
  }
}
