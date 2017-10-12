/**
 * Created by Pointless on 27/07/17.
 */
import {Command, Arguments, Authorization} from 'discordthingy';
import {Message} from 'discord.js';
import {VM} from 'vm2';
import * as vm from 'vm';

const secure = false;

export default class EvalCommand {
  @Command({
    authorization: Authorization.OWNER,
    name: 'eval'
  })
  public eval(message: Message, args: Arguments) {
    const code = args.contentFrom(1);
    const script = new vm.Script(code);
    const start = process.hrtime();
    let desc;
    let success = false;
    try {
      let returned = script.runInNewContext({
        message: message
      });
      success = true;
      if(returned instanceof Object) desc = JSON.stringify(returned, null, 2);
      else if(typeof returned === 'string') desc = `"${returned}"`;
      else desc = returned ? returned.toString() : returned;
    } catch(e) {
      desc = e;
    }
    const [seconds, ns] = process.hrtime(start);
    const ms = ns / 1000;
    message.channel.send({embed : {
      description: `:inbox_tray: Input:\`\`\`js\n${code}\`\`\`:outbox_tray: Output: \`\`\`${desc}\`\`\``,
      footer: {
        text: `${seconds ? seconds + 's, ' : ''}${ms}µs`
      },
      title: success ? '✅ Executed Successfully' : '❌ Execution Failed.'
    }});
  }
}
