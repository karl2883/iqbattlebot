const { SlashCommandBuilder } = require("discord.js");
const { Party } = require("../../party.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("start_party")
        .setDescription("Start an IQ battle party."),
    async execute(interaction) {
        if (interaction.client.parties.get(interaction.channelId)) {
            await interaction.reply("There is already a party running in this channel!");
            return;
        }
        interaction.client.parties.set(interaction.channelId, new Party(interaction.user.id));
        await interaction.reply("Party created successfully. Other people can now join this party with /join!");
    }
}


