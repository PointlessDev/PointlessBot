/**
 * Created by Pointless on 19/07/17.
 */
import {Message, TextChannel} from 'discord.js';
import {Command, Arguments, Responder, DiscordThingy} from 'discordthingy';
import * as snekfetch from 'snekfetch';
import {GOOGLE_CSE_KEY, GOOGLE_CSE_CX} from '../config';

const WIKIHOW_ENDPOINT = 'https://www.wikihow.com/api.php?action=query&list=search&format=json&srsearch=';
const GOOGLE_ENDPOINT = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_CSE_KEY}&cx=${GOOGLE_CSE_CX}`;
const GOOGLE_IMAGE_ENDPOINT = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_CSE_KEY}&cx=${GOOGLE_CSE_CX}&searchType=image`;
const GOOGLE_SAFESEARCH_SETTING = '&safe=medium';

interface SnekResponse {
  body: any;
}

export default class SearchCommands {
  private responder: Responder;
  constructor(private thingy: DiscordThingy) {
    this.responder = thingy.responder;
  }

  @Command('wikihow')
  public async wikihow(message: Message, args: Arguments): Promise<any> {
    if(!args.contentFrom(1)) return this.responder.fail(message, 'No search provided');
    message.react('🔄').then(loadingReaction => {
      const encodedQuery = encodeURIComponent(args.contentFrom(1));

      snekfetch.get(WIKIHOW_ENDPOINT + encodedQuery).then((res: SnekResponse) => {
        const result = res.body.query.search[0];

        loadingReaction.remove();

        if(!result) {
            return message.channel.send({
              embed: {
                color: 0xf44336,
                description: ':x: *No Results Found*',
                footer: {
                  icon_url: 'http://www.wikihow.com/images/7/71/Wh-logo.jpg',
                  text: `Results for search "${args.contentFrom(1)}"`
                }
              }
            })
                .then(() => message.delete())
                .catch(this.responder.rejection(message, `Adding "no results found" embed for wikihow search`));
        }else {
          const hitCount = parseInt(res.body.query.searchinfo.totalhits);
          message.channel.send({
            embed: {
              color: 0x93b874,
              description: result.snippet.replace(/<(?:.|\n)*?>/gm, ''), // Snippet contains html marking up matching words
              footer: {
                icon_url: 'http://www.wikihow.com/images/7/71/Wh-logo.jpg',
                text: `Result 1 of ${hitCount.toLocaleString()} | Results for search "${args.contentFrom(1)}"`
              },
              title: result.title,
              url: `https://www.wikihow.com/${result.title.replace(/\s/g, '-')}`
            }
          })
              .then(() => message.delete())
              .catch(this.responder.rejection(message, 'Adding embed'));
        }
      });
    });
  }

  @Command({
    aliases: ['search'],
    name: 'google'
  })
  public async google(message: Message, args: Arguments): Promise<void> {
    let query = args.contentFrom(1);
    if(!query) {
      this.responder.fail(message, 'No query provided!');
      return;
    }

    message.react('🔄').then(loadingReaction => {
      let safesearch = (message.channel as any).nsfw ? '' : GOOGLE_SAFESEARCH_SETTING; // `as any` because weird glitches
      snekfetch.get(GOOGLE_ENDPOINT + safesearch + '&q=' + encodeURIComponent(query)).then((res: SnekResponse) => {
        let resultCount = res.body.queries.request[0].totalResults;
        if(!res.body.items || !res.body.items[0]) {
          return this.responder.fail(message, 'No results found');
        }
        let result = res.body.items[0];
        loadingReaction.remove().catch(this.responder.rejection(message, 'Removing Reaction'));
        message.channel.send({embed: {
          color: 0x4CAF50,
          description: result.snippet,
          footer: {
            icon_url: 'https://cdn.pixabay.com/photo/2015/10/31/12/56/google-1015752_960_720.png',
            text: `Result 1 of ${parseInt(resultCount).toLocaleString()}`
          },
          title: result.title,
          url: result.link
        }}).catch(e => this.responder.rejection(message, 'Adding embed'));
      });
    }).catch(this.responder.rejection(message));
  }

  @Command({
    name: 'image'
  })
  public async googleImage(message: Message, args: Arguments): Promise<void> {
    let query = args.contentFrom(1);
    if(!query) {
      this.responder.fail(message, 'No query provided!');
      return;
    }

    message.react('🔄').then(loadingReaction => {
      let safesearch = (message.channel as any).nsfw ? '' : GOOGLE_SAFESEARCH_SETTING;
      snekfetch.get(GOOGLE_IMAGE_ENDPOINT + safesearch + '&q=' + encodeURIComponent(query)).then((res: SnekResponse) => {
        let resultCount = res.body.queries.request[0].totalResults;
        if(!res.body.items || !res.body.items[0]) {
          return this.responder.fail(message, 'No results found');
        }
        let result = res.body.items[0];
        loadingReaction.remove().catch(this.responder.rejection(message, 'Removing Reaction'));
        message.channel.send({embed: {
          color: 0x4CAF50,
          footer: {
            icon_url: 'https://cdn.pixabay.com/photo/2015/10/31/12/56/google-1015752_960_720.png',
            text: `Result 1 of ${parseInt(resultCount).toLocaleString()}`
          },
          image: {
            url: result.link
          },
          title: result.snippet,
          url: result.link
        }}).catch(e => this.responder.rejection(message, 'Adding embed'));
      });
    }).catch(this.responder.rejection(message));
  }
}
