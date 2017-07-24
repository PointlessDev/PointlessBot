/**
 * Created by Pointless on 19/07/17.
 */
import {Message} from 'discord.js';
import {Command, Arguments, Responder, CommandConstructionData} from 'discordthingy';
import * as snekfetch from 'snekfetch';
import {GOOGLE_CSE_KEY} from '../config';

const WIKIHOW_ENDPOINT = 'https://www.wikihow.com/api.php?action=query&list=search&format=json&srsearch=';
const GOOGLE_ENDPOINT = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_CSE_KEY}&q=`;

interface SnekResponse {
  body: any;
}

export default class SearchCommands {
  constructor({responder}: CommandConstructionData){
    this.responder = responder;
  }

  @Command('wikihow')
  async wikihow(message: Message, args: Arguments) {
    if(!args.contentFrom(1)) return this.responder.fail(message, 'No search provided');
    message.react('🔄').then(loadingReaction => {
      const encodedQuery = encodeURIComponent(args.contentFrom(1));

      snekfetch.get(WIKIHOW_ENDPOINT + encodedQuery).then((res: SnekResponse) => {
        const result = res.body.query.search[0];

        loadingReaction.remove();

        if (!result)
          return message.channel.send({
            embed: {
              description: ':x: *No Results Found*',
              color: 0xf44336,
              footer: {
                icon_url: 'http://www.wikihow.com/images/7/71/Wh-logo.jpg',
                text: `Results for search "${args.contentFrom(1)}"`
              }
            }
          }).then(() => message.delete());

        message.channel.send({
          embed: {
            color: 0x93b874,
            title: result.title,
            description: result.snippet.replace(/<(?:.|\n)*?>/gm, ''), // Snippet contains html marking up matching words
            url: `https://www.wikihow.com/${result.title.replace(/\s/g, '-')}`,
            footer: {
              icon_url: 'http://www.wikihow.com/images/7/71/Wh-logo.jpg',
              text: `Result 1 of ${parseInt(res.body.query.searchinfo.totalhits).toLocaleString()} | Results for search "${args.contentFrom(1)}"`
            }
          }
        })
            .then(() => message.delete())
            .catch(e => this.responder.rejection(message, 'Adding embed'));
      });
    });
  }

  @Command({
    name: 'google',
    aliases: ['search']
  })
  async google(message: Message, args: Arguments): Promise<void> {
    let query = args.contentFrom(1);
    if(!query){
      this.responder.fail(message, 'No query provided!');
      return;
    }

    message.react("🔄").then(loadingReaction => {
      snekfetch.get(GOOGLE_ENDPOINT + encodeURIComponent(query)).then((res: SnekResponse) => {
        let resultCount = res.body.queries.request[0].totalResults;
        let result = res.body.items[0];
        loadingReaction.remove().catch(this.responder.rejection(message, 'Removing Reaction'));
        message.channel.send({embed: {
          color: 0x4CAF50,
          title: result.title,
          description: result.snippet,
          url: result.link,
          footer: {
            icon_url: "https://cdn.pixabay.com/photo/2015/10/31/12/56/google-1015752_960_720.png",
            text: `Result 1 of ${parseInt(resultCount).toLocaleString()}`
          }
        }}).catch(e => this.responder.rejection(message, 'Adding embed'));
      });
    }).catch(this.responder.rejection(message));
  }

  private responder: Responder;
}
