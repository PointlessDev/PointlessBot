/**
 * Created by Pointless on 14/08/17.
 */
import {Command, Authorization} from 'discordthingy';
import {Message} from 'discord.js';

export default class ShutdownCommand {
  @Command({
    authorization: Authorization.OWNER
  })
  public async shutdown(message: Message): Promise<void> {
    message.reply(`Rebooting/Shutting down :shrug:`).then(() => {
      message.client.destroy();
      process.exit(0);
    }).catch(() => {
      message.client.destroy();
      console.log('Failed to send the shutdown warning, shutting down anyway');
      process.exit(1);
    });
  }
}