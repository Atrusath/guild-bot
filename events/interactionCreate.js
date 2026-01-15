module.exports = (client, config) => {
  client.on("interactionCreate", async interaction => {
    if (!interaction.isButton()) return;

    //const member = interaction.member;
    const guild = interaction.guild;
    if (!guild) return;

    const member = await guild.members.fetch(interaction.user.id);

    // ✅ Bouton acceptation des règles
    if (interaction.customId === "accept_rules") {
      if (member.roles.cache.has(config.roles.certified)) {
        return interaction.reply({
          content: "✅ Tu es déjà certifié",
          ephemeral: true
        });
      }

      await member.roles.add(config.roles.certified);
      return interaction.reply({
        content: "✅ Accès accordé",
        ephemeral: true
      });
    }

    // ⚔️ Boutons classes Lost Ark
    if (!interaction.customId.startsWith("class_")) return;

    const classKey = interaction.customId.replace("class_", "");
    const roleId = config.roles.classes[classKey];

    if (!roleId) {
      return interaction.reply({
        content: "❌ Classe inconnue",
        ephemeral: true
      });
    }

    const hasRole = member.roles.cache.has(roleId);

    await member.roles[hasRole ? "remove" : "add"](roleId);

    await interaction.reply({
      content: hasRole
        ? "❌ Classe retirée"
        : "✅ Classe ajoutée",
      ephemeral: true
    });
  });
};
