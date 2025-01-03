require('dotenv').config(); // 環境変数を読み込むための設定
const { server, client, version } = require('discord-mcbe');

if (!discord_token) {
  console.error('Error: Discord token is not defined in environment variables.');
  process.exit(1); // トークンがない場合はエラーで終了
}

console.log('[Script] loaded!');

const PREFIX = '.';
server.events.on('playerChat', async ev => {
  const { message, world } = ev;

  if (message.startsWith(PREFIX)) { // チャットの擬似コマンドのサンプル
    const [command] = message.slice(PREFIX.length).split(' ');

    if (command === 'help') {
      await world.sendMessage([
        `§b[discord-mcbe]§r`,
        `§7-§f version: §e${version}§r`,
        `§7-§f client: §6${world.localPlayer}§r`,
        '§7Made by RetoRuto9900K / tutinoko2048§r'
      ].join('\n'));
    }

    if (command === 'ping') {
      await world.sendMessage([
        '§b[discord-mcbe]§r Pong!',
        `§7-§f WS: ${world.ping}ms`,
        `§7-§f Discord: ${client.ws.ping}ms`
      ].join('\n'));
    }
  }
});

// 必要に応じて追加イベントを設定
/*
client.on('ready', () => {
  console.log('ready:', client.user.tag);
});

server.events.on('serverOpen', () => {
  console.log('open');
});
*/
