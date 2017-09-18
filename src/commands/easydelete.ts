/**
 * Created by Pointless on 16/09/17.
 */
import {DiscordThingy, CommandClass} from 'discordthingy';

@CommandClass
export default class EasyDelete {
  constructor(private thingy: DiscordThingy) {
    thingy.client.on('messageReactionAdd', (react, user) => {
      if(
          user.id === thingy.owner && // If the owner reacts...
          react.message.author.id === thingy.client.user.id && // on one of the bot's messages...
          react.emoji.name === '🗑' // with a wastebasket emoji...
      ) react.message.delete(); // Delete the message
    });
  }
}
