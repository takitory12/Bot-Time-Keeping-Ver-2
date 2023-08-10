const { Client, Intents, ClientApplication } = require('discord.js');

const intents = new Intents([
  Intents.FLAGS.GUILDS,
  Intents.FLAGS.GUILD_MESSAGES,
  Intents.FLAGS.MESSAGE_REACTIONS
]);

const client = new Client({ intents: intents });

const diemdanhData = {};
let activeChannel = null;
const defaultEmoji = '📌';

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  const args = message.content.slice(1).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'diemdanh') {
    if (activeChannel === null || activeChannel.id !== message.channel.id) {
      return message.channel.send('Vui lòng cài đặt kênh hoạt động trước bằng lệnh `/setchannel` hoặc `t!setchannel`.');
    }

    const user_id = message.author.id;
    const emoji = diemdanhData[user_id] || defaultEmoji;
    try {
      await message.react(emoji);
      diemdanhData[user_id] = emoji;
    } catch (error) {
      console.error('Không thể react emoji:', error);
    }
  } else if (command === 'checkdiemdanh') {
    const user_id = message.author.id;
    const count = Object.values(diemdanhData).filter(e => e === diemdanhData[user_id]).length;
    message.channel.send(`Bạn đã chấm công ${count} lần.`);
  }
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'setchannel') {
    const channel = interaction.options.getChannel('channel');
    if (!channel || channel.type !== 'GUILD_TEXT') {
      return interaction.reply('Kênh không hợp lệ.');
    }
    activeChannel = channel;
    interaction.reply(`Bot sẽ hoạt động trong kênh ${channel}.`);
  } else if (commandName === 'emo') {
    const emoji = interaction.options.getString('emoji');
    diemdanhData[interaction.user.id] = emoji;
    interaction.reply(`Emoji chấm công của bạn đã được đổi thành ${emoji}.`);
  } else if (commandName === 'help') {
    const helpMessage = `Danh sách lệnh:
- \`/diemdanh\` hoặc \`t!diemdanh\`: Chấm công.
- \`/checkdiemdanh\` hoặc \`t!checkdiemdanh\`: Kiểm tra số lần chấm công.
- \`/setchannel\` hoặc \`t!setchannel\`: Cài đặt kênh hoạt động.
- \`/emo\` hoặc \`t!emo\`: Đổi emoji chấm công.`;
    interaction.reply(helpMessage);
  }
});

client.login('MTEzOTE4MzcwMTgxNzgxOTIxNg.G1Dw1H.83wYAnel4BEKSdJ48uNIy80z8VwH-iROK4d614');


