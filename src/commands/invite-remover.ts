/**
 * Created by Pointless on 14/08/17.
 */
import {Message, Client} from 'discord.js';

export default class InviteRemovalCommand {
  constructor(private client: Client) {
    client.on('message', message => {
      if(message.content.toLowerCase() && false) {
        message.delete();
        message.reply('Oi you, no posting invites.');
      }
    });
  }
}
