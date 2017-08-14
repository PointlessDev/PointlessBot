/**
 * Created by Pointless on 16/07/17.
 */
import {Message} from 'discord.js';
import {Command, Authorization, Arguments} from 'discordthingy';

const NUMBER_NAMES = [
    , 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'why the fuck is this outputting'];
const EMOJI_CONVERSIONS: {[propName: string]: string} = {
  '!': 'exclamation',
  '#': 'hash',
  '*': 'asterisk',
  '?': 'question',
  'b': 'b',
};

export default class MessageModCommands {
  @Command({
    aliases: 'emojifi',
    authorization: Authorization.SELF,
    name: 'emoji'
  })
  public async emoji(message: Message, args: Arguments): Promise<void> {
    message.edit(morphText(args.contentFrom(1), (letter: string) => {
      letter = letter.toLowerCase();

      if(letter === ' ') return '   ';
      if(EMOJI_CONVERSIONS[letter]) return `:${EMOJI_CONVERSIONS[letter]}: `;
      if(/[a-zA-Z]/.test(letter)) return `:regional_indicator_${letter}: `;
      if(/[1-9]/.test(letter)) return `:${NUMBER_NAMES[Number(letter)]}: `;
      else return letter;
    }));
  }

  @Command({
    aliases: ['cancerify', 'autism'],
    authorization: Authorization.SELF,
    name: 'randomcase'
  })
  public async randomCase(message: Message, args: Arguments): Promise<void> {
    message.edit(morphText(args.contentFrom(1), (letter: string) => {
      if(Math.random() > 0.5) return letter.toUpperCase();
      else return letter.toLowerCase();
    }));
  }
}

function morphText(text: string, morpherFunction: (letter: string) => string): string {
  let newText = '';
  for(let i = 0; i < text.length; i++) {
    newText += morpherFunction(text[i]) || text[i];
  }

  return newText;
}
