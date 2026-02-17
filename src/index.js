require('dotenv').config();
const { Client, Collection, GatewayIntentBits, Partials, Events } = require('discord.js');
const { commandHandlers } = require('./commands');

const token = process.env.DISCORD_TOKEN;

if (!token) {
  throw new Error('Falta DISCORD_TOKEN en el archivo .env');
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ],
  partials: [Partials.Channel]
});

client.commands = new Collection();

for (const command of commandHandlers) {
  client.commands.set(command.data.name, command);
}

client.once(Events.ClientReady, async readyClient => {
  console.log(`✅ Bot conectado como ${readyClient.user.tag}`);

  const commandData = commandHandlers.map(cmd => cmd.data.toJSON());
  const guildId = process.env.GUILD_ID;

  try {
    if (guildId) {
      const guild = await readyClient.guilds.fetch(guildId);
      await guild.commands.set(commandData);
      console.log(`📌 Comandos registrados en el servidor: ${guild.name}`);
    } else {
      await readyClient.application.commands.set(commandData);
      console.log('🌍 Comandos globales registrados. Puede tardar unos minutos en reflejarse.');
    }
  } catch (error) {
    console.error('Error registrando comandos:', error);
  }
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(`Error ejecutando /${interaction.commandName}:`, error);

    const errorReply = {
      content: '❌ Hubo un error al ejecutar este comando.',
      ephemeral: true
    };

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(errorReply);
    } else {
      await interaction.reply(errorReply);
    }
  }
});

client.login(token);
