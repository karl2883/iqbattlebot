const { SlashCommandBuilder } = require("discord.js");
const { Party } = require("../../party.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("leave")
        .setDescription("Leave a party."),
    async execute(interaction) {
        let party = interaction.client.parties.get(interaction.channelId);
        if (!party) {
            await interaction.reply("No party currently exists in this channel.");
            return;
        }
        if (!party.hasParticipant(interaction.user.id)) {
            await interaction.reply("You are not a participant of the currently running party!");
            return;
        }

        if (interaction.user.id == party.getHost()) {
            if (party.selectNewHost()) {
                party.removeParticipant(interaction.user.id);
                await interaction.reply(`Successfully left the party. <@${party.getHost()}> is the new host!`);
                return;
            } else {
                interaction.client.parties.delete(interaction.channelId);
                await interaction.reply("Successfully left the party. Because everyone has left, the party is no more.");
                return;
            }
        }

        party.removeParticipant(interaction.user.id);
        await interaction.reply("Successfully left the party.");
    }
}

