/**
 * Created by Pointless on 23/07/17.
 */
import {Arguments, Command, CommandConstructionData, Responder, DefaultMessageParser} from 'discordthingy';
import {Client, Message, TextChannel, DMChannel, GroupDMChannel, RichEmbedOptions} from 'discord.js';

const introWords = DefaultMessageParser.INTRO_WORDS;

export type GenericTextchannel = TextChannel | DMChannel | GroupDMChannel;

export default class EmbedCommands {
  constructor({client, responder}: CommandConstructionData) {
    this.responder = responder;
    this.client = client;
  }

  @Command({
    name: 'embed',
    aliases: ['quote']
  })
  async embed(message: Message, args: Arguments) {
    if(!args[1]) return this.responder.fail(message, 'Please mention a message');

    try{
      let m: Message = await this.getMessageWithIds(args[1], args[2], message.channel);

      message.channel.send({embed: embedForMessage(m)})
        .then(() => message.delete())
        .catch(this.responder.rejection(message, 'Sending embed'))
    }catch(e){
      if(e.toString().includes('Message not found'))
        return this.responder.fail(message, 'Couldn\'t find a message');
      else
        return this.responder.internalError(message, e, 'Fetching message');
    }
  }

  @Command('edits')
  async edits(message: Message, args: Arguments) {
    if(!args[1]) return this.responder.fail(message, 'Please mention a message');

    try{
      let m: Message = await this.getMessageWithIds(args[1], args[2], message.channel);

      message.channel.send({embed: embedForEdits(m)})
          .then(() => message.delete())
          .catch(this.responder.rejection(message, 'Sending embed'))
    }catch(e){
      if(e.toString().includes('Message not found'))
        return this.responder.fail(message, 'Couldn\'t find a message');
      else
        return this.responder.internalError(message, e, 'Fetching message');
    }
  }

  async getMessageWithIds(idOne: string, idTwo: string, defaultChannel: GenericTextchannel): Promise<Message> {
    let messageId = idOne;
    let channel = idTwo ? this.client.channels.get(idTwo) as GenericTextchannel : defaultChannel;
    if(!channel){
      channel = this.client.channels.get(idOne) as GenericTextchannel;
      if(!channel)
          throw new Error('Unable to find that channel');
      messageId = idTwo;

    }

    return await this.getMessage(messageId, channel);
  }

  async getMessage(id: string, channel: GenericTextchannel): Promise<Message>{
    if(channel.messages.get(id))
      return channel.messages.get(id);
    else
      return await channel.fetchMessage(id);
  }

  responder: Responder;
  client: Client;
}

function embedForMessage(message: Message): RichEmbedOptions{
  return {
    color: message.member ? message.member.displayColor : 0x4CAF50,
    author: {
      name: message.author.username,
      icon_url: message.author.displayAvatarURL
    },
    description: message.cleanContent + (message.edits.length > 1 ? `\n\nUse *${introWords[Math.floor(Math.random() * introWords.length)]} ${message.client.user} edits ${message.id}*` : ''),
    timestamp: message.createdAt,
    footer: message.channel.type === 'dm'
        ? {
          icon_url: (message.channel as DMChannel).recipient.displayAvatarURL,
          text: `DM to ${(message.channel as DMChannel).recipient.tag}`
        }
        : {
          icon_url: message.guild.iconURL,
          text: `#${(message.channel as TextChannel).name}`
        }
  };
}
function embedForEdits(message: Message): RichEmbedOptions{
  const startupTime = Date.now() - message.client.uptime;
  const allEditsObserved = startupTime < message.createdAt.getTime();

  if(message.edits.length > 1)
    return {
      color: message.member ? message.member.displayColor : 0x4CAF50,
      author: {
        name: message.author.username,
        icon_url: message.author.displayAvatarURL
      },
      title: allEditsObserved ? undefined : `Tracked Edits (At least ${message.edits.length - 1})`,
      fields: message.edits.reverse().map((edit, ind) => ({name: `${ind === message.edits.length - 1 ? 'Current Version' : '#' + (message.edits.length - (ind + 1))}`, value: edit.cleanContent})),
      timestamp: message.createdAt,
      footer: message.channel.type === 'dm'
          ? {
            icon_url: (message.channel as DMChannel).recipient.displayAvatarURL,
            text: `DM to ${(message.channel as DMChannel).recipient.tag}`
          }
          : {
            icon_url: message.guild.iconURL,
            text: `#${(message.channel as TextChannel).name}`
          }
    };
  else return {
    color: message.member ? message.member.displayColor : 0x4CAF50,
    author: {
      name: message.author.username,
      icon_url: message.author.displayAvatarURL
    },
    description: message.cleanContent + '\n\n*' + (message.editedAt ? `Has been edited at least once, most recently ${message.editedAt.toTimeString()}` : `Message has not been edited`) + '*',
    timestamp: message.createdAt,
    footer: message.channel.type === 'dm'
        ? {
          icon_url: (message.channel as DMChannel).recipient.displayAvatarURL,
          text: `DM to ${(message.channel as DMChannel).recipient.tag}`
        }
        : {
          icon_url: message.guild.iconURL,
          text: `#${(message.channel as TextChannel).name}`
        }
  }
}