/**
 * Created by Pointless on 27/07/17.
 */
import {Command, Arguments} from 'discordthingy';
import {Message} from 'discord.js';
import {VM} from 'vm2';

export default class EvalCommand {
  @Command('eval')
  public eval(message: Message, args: Arguments) {
    const code = args.contentFrom(1);
    const vm = new VM({
      sandbox: {
        message
      },
      timeout: 1000
    });
    const start = process.hrtime();
    let returned;
    try {
      returned = vm.run(code);
    } catch(e) {
      returned = e;
    }
    const end = process.hrtime();

    console.log(start);
    message.reply(returned);
  }
}
