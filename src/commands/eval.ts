/**
 * Created by Pointless on 27/07/17.
 */
import {Command, Arguments} from 'discordthingy';
import {Message} from 'discord.js';
import {VM} from 'vm2';

export default class EvalCommand {
  @Command('testeval')
  public eval(message: Message, args: Arguments) {
    console.log('evaled');
    const code = args.contentFrom(1);
    const vm = new VM({
      sandbox: {
        message
      },
      timeout: 1000
    });
    const start = process.hrtime();
    let ret = vm.run(code);
    const end = process.hrtime();
    console.log(start);
  }
}
