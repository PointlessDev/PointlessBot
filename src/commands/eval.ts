/**
 * Created by Pointless on 27/07/17.
 */
import {Command, Arguments} from 'discordthingy';
import {Message} from 'discord.js';
// import {VM} from 'vm2';

export default class EvalCommand {
  @Command('eval')
  public eval(message: Message, args: Arguments) {
    let code = args.contentFrom(1);

  }
}
