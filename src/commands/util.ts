/**
 * Created by Pointless on 15/07/17.
 */
import {Category, Command, Authorization, Arguments, CommandConstructionData, Responder} from "discordthingy";
import {Message} from "discord.js";

@Category('Utilities')
class UtilCommands {
  constructor({responder}: CommandConstructionData) {
    this.responder = responder;
  }
  @Command({
    name: 'eval',
    aliases: ['run', 'sudo'],
    authorization: Authorization.OWNER
  })
  async eval(message: Message, args: Arguments) {
    message.reply(`:${args[1]}:`);
    console.log('evalCommand!');
  }

  @Command({
    name: 'testError',
    authorization: Authorization.OWNER
  })
  async other(message: Message) {
    message.reply('Throwing internal error...');
    this.responder.internalError(message, new Error('Testing Error'), 'Debug Info');
  }
  responder: Responder;
}

export default UtilCommands;
