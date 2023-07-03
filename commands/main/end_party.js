const { SlashCommandBuilder } = require("discord.js");
const { Party } = require("../../party.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("end_party")
        .setDescription("End an IQ battle party (host only)."),
    async execute(interaction) {
        let party = interaction.client.parties.get(interaction.channelId);
        if (!party) {
            await interaction.reply("There is no party currently running in this channel!");
            return;
        }
        if (interaction.user.id != party.getHost()) {
            await interaction.reply("Only the host of a party can end a party!");
            return;
        }
        interaction.client.parties.delete(interaction.channelId);
        await interaction.reply("The party is successfully no more.");
    }
}


