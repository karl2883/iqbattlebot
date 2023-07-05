const { SlashCommandBuilder } = require("discord.js");
const { Party } = require("../../party.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("punch")
        .setDescription("Punch someone else when it's your turn.")
        .addUserOption( option => option
            .setName("target_user")
            .setDescription("The user you want to punch.")
            .setRequired(true)),
    
    async execute(interaction) {
        let party = interaction.client.parties.get(interaction.channelId);
        if (!party) {
            await interaction.reply("No party currently exists in this channel.");
            return;
        }

        if (!party.isRunning()) {
            await interaction.reply("The party has not been actually started yet! Do so with /begin.");
            return;
        }

        let target_user_id = interaction.options.getUser("target_user").id;


        if (!party.hasParticipant(interaction.user.id)) {
            await interaction.reply("You are not a participant of this party.");
            return;
        }
        if (party.getCurrentTurnPlayer() != interaction.user.id) {
            await interaction.reply("It's not your turn! Have some patience.");
        }
        if (!party.hasParticipant(target_user_id)) {
            await interaction.reply("The user you want to target with your question is not a participant of this party!");
            return;
        }

        if (party.isInTriviaQuestion()) {
            await interaction.reply("There is a already trivia question going on! Have some patience.");
            return;
        }

        if (party.getIQ(target_user_id) <= party.getIQ(interaction.user.id)) {
            await interaction.reply("You can only punch those with a higher IQ than you. It's too primitive to use it against someone dumber than you.");
            return;
        }
        
        if (Math.random() < 0.8) {
            party.addIQ(target_user_id, -10);
            await interaction.reply(`The punch was effective! **-10IQ** for <@${target_user_id}> because of brain damage. Their IQ is now **${party.getIQ(target_user_id)}**.`);
        } else {
            party.addIQ(interaction.user.id, -15);
            await interaction.reply(`Due to you being dumber than your opponent, you miss the punch and accidentally punch yourself with full force. **-15IQ** for <@${interaction.user.id}> because of brain damage. Your IQ is now **${party.getIQ(interaction.user.id)}**.`);
        }

        let p = party.gameEnded();
        if (p) {
            await interaction.followUp(`The punch made <@${p}>'s IQ fall below 0. The game is over!\nFinal leaderboard:'`);
            party.showLeaderboard(interaction, true);
            party.end();
        } else {
            await party.announceNewTurn(interaction, false);
        }

    }
}

