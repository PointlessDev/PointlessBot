/**
 * Created by Pointless on 15/07/17.
 */
import {DiscordThingy} from 'discordthingy';
import config from "./config";


config.bots.forEach(bot => {
  const thing = new DiscordThingy();
  thing
      .login(bot.token)
      .setOwner(bot.owner || config.owner)
      .setLogChannel(bot.logChannel || config.logChannel)
      .addCommandDirectory('./commands')
});

process.on('unhandledRejection', err => {
  console.error(err.stack || err);
});