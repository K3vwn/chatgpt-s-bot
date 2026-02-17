const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder
} = require('discord.js');

const choices8Ball = [
  'Sí, totalmente.',
  'Sin duda.',
  'Todo apunta a que sí.',
  'Probablemente.',
  'Mejor no contar con ello.',
  'No lo creo.',
  'Mis fuentes dicen que no.',
  'Pregunta otra vez más tarde.'
];

const commandHandlers = [
  {
    data: new SlashCommandBuilder()
      .setName('ping')
      .setDescription('Comprueba la latencia del bot'),
    async execute(interaction) {
      const sent = await interaction.reply({ content: '🏓 Calculando...', fetchReply: true });
      const latency = sent.createdTimestamp - interaction.createdTimestamp;
      await interaction.editReply(`🏓 Pong! Latencia: **${latency}ms**`);
    }
  },
  {
    data: new SlashCommandBuilder()
      .setName('help')
      .setDescription('Muestra las categorías y comandos disponibles'),
    async execute(interaction) {
      const embed = new EmbedBuilder()
        .setTitle('📚 Bot Multifuncional: comandos')
        .setDescription('Aquí tienes varias categorías para usar el bot:')
        .setColor(0x5865F2)
        .addFields(
          { name: '⚙️ Utilidad', value: '`/ping`, `/help`, `/server`, `/user`, `/avatar`' },
          { name: '🎉 Diversión', value: '`/dice`, `/coin`, `/8ball`, `/choose`' },
          { name: '🛡️ Moderación', value: '`/clear`, `/kick`, `/ban`' }
        )
        .setFooter({ text: 'Tip: usa /help cuando agregues nuevos comandos.' });

      await interaction.reply({ embeds: [embed], ephemeral: true });
    }
  },
  {
    data: new SlashCommandBuilder()
      .setName('server')
      .setDescription('Muestra información del servidor actual'),
    async execute(interaction) {
      const guild = interaction.guild;
      const embed = new EmbedBuilder()
        .setTitle(`🏠 ${guild.name}`)
        .setColor(0x2ecc71)
        .addFields(
          { name: 'Miembros', value: `${guild.memberCount}`, inline: true },
          { name: 'Canales', value: `${guild.channels.cache.size}`, inline: true },
          { name: 'Creado', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:D>`, inline: true }
        );

      await interaction.reply({ embeds: [embed] });
    }
  },
  {
    data: new SlashCommandBuilder()
      .setName('user')
      .setDescription('Muestra información de un usuario')
      .addUserOption(option =>
        option.setName('usuario').setDescription('Usuario objetivo').setRequired(false)
      ),
    async execute(interaction) {
      const user = interaction.options.getUser('usuario') || interaction.user;
      await interaction.reply([
        `👤 **${user.tag}**`,
        `ID: \`${user.id}\``,
        `Creó su cuenta: <t:${Math.floor(user.createdTimestamp / 1000)}:R>`
      ].join('\n'));
    }
  },
  {
    data: new SlashCommandBuilder()
      .setName('avatar')
      .setDescription('Muestra el avatar de un usuario')
      .addUserOption(option =>
        option.setName('usuario').setDescription('Usuario objetivo').setRequired(false)
      ),
    async execute(interaction) {
      const user = interaction.options.getUser('usuario') || interaction.user;
      const embed = new EmbedBuilder()
        .setTitle(`🖼️ Avatar de ${user.tag}`)
        .setImage(user.displayAvatarURL({ size: 1024 }))
        .setColor(0x3498db);

      await interaction.reply({ embeds: [embed] });
    }
  },
  {
    data: new SlashCommandBuilder()
      .setName('dice')
      .setDescription('Lanza un dado de N caras')
      .addIntegerOption(option =>
        option
          .setName('caras')
          .setDescription('Número de caras (ej: 6, 20, 100)')
          .setMinValue(2)
          .setMaxValue(1000)
          .setRequired(false)
      ),
    async execute(interaction) {
      const sides = interaction.options.getInteger('caras') || 6;
      const value = Math.floor(Math.random() * sides) + 1;
      await interaction.reply(`🎲 Salió **${value}** en un dado de **${sides}** caras.`);
    }
  },
  {
    data: new SlashCommandBuilder()
      .setName('coin')
      .setDescription('Lanza una moneda'),
    async execute(interaction) {
      const result = Math.random() < 0.5 ? 'Cara 🪙' : 'Cruz 🪙';
      await interaction.reply(`Resultado: **${result}**`);
    }
  },
  {
    data: new SlashCommandBuilder()
      .setName('8ball')
      .setDescription('Haz una pregunta a la bola mágica')
      .addStringOption(option =>
        option.setName('pregunta').setDescription('Tu pregunta').setRequired(true)
      ),
    async execute(interaction) {
      const question = interaction.options.getString('pregunta');
      const answer = choices8Ball[Math.floor(Math.random() * choices8Ball.length)];
      await interaction.reply(`🎱 **Pregunta:** ${question}\n**Respuesta:** ${answer}`);
    }
  },
  {
    data: new SlashCommandBuilder()
      .setName('choose')
      .setDescription('Elige una opción de una lista')
      .addStringOption(option =>
        option
          .setName('opciones')
          .setDescription('Separa opciones por coma. Ej: pizza, sushi, tacos')
          .setRequired(true)
      ),
    async execute(interaction) {
      const raw = interaction.options.getString('opciones');
      const options = raw
        .split(',')
        .map(item => item.trim())
        .filter(Boolean);

      if (options.length < 2) {
        await interaction.reply({
          content: 'Necesitas al menos 2 opciones separadas por comas.',
          ephemeral: true
        });
        return;
      }

      const pick = options[Math.floor(Math.random() * options.length)];
      await interaction.reply(`🤔 Yo elijo: **${pick}**`);
    }
  },
  {
    data: new SlashCommandBuilder()
      .setName('clear')
      .setDescription('Elimina mensajes recientes del canal')
      .addIntegerOption(option =>
        option
          .setName('cantidad')
          .setDescription('Cantidad de mensajes (1-100)')
          .setRequired(true)
          .setMinValue(1)
          .setMaxValue(100)
      )
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async execute(interaction) {
      const amount = interaction.options.getInteger('cantidad');
      await interaction.channel.bulkDelete(amount, true);
      await interaction.reply({
        content: `🧹 Se eliminaron hasta **${amount}** mensajes recientes.`,
        ephemeral: true
      });
    }
  },
  {
    data: new SlashCommandBuilder()
      .setName('kick')
      .setDescription('Expulsa a un usuario')
      .addUserOption(option =>
        option.setName('usuario').setDescription('Usuario a expulsar').setRequired(true)
      )
      .addStringOption(option =>
        option.setName('razon').setDescription('Razón').setRequired(false)
      )
      .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
    async execute(interaction) {
      const user = interaction.options.getUser('usuario');
      const reason = interaction.options.getString('razon') || 'Sin razón especificada';
      const member = await interaction.guild.members.fetch(user.id).catch(() => null);

      if (!member) {
        await interaction.reply({ content: 'No encontré a ese usuario en este servidor.', ephemeral: true });
        return;
      }

      await member.kick(reason);
      await interaction.reply(`👢 ${user.tag} fue expulsado. Razón: ${reason}`);
    }
  },
  {
    data: new SlashCommandBuilder()
      .setName('ban')
      .setDescription('Banea a un usuario')
      .addUserOption(option =>
        option.setName('usuario').setDescription('Usuario a banear').setRequired(true)
      )
      .addStringOption(option =>
        option.setName('razon').setDescription('Razón').setRequired(false)
      )
      .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    async execute(interaction) {
      const user = interaction.options.getUser('usuario');
      const reason = interaction.options.getString('razon') || 'Sin razón especificada';
      await interaction.guild.members.ban(user.id, { reason });
      await interaction.reply(`🔨 ${user.tag} fue baneado. Razón: ${reason}`);
    }
  }
];

module.exports = { commandHandlers };
