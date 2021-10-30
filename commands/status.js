const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const constants = require('../lib/constants');
const printers = require('../lib/printers');
const farm = require('../lib/farm');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('status')
		.setDescription('Gives the status of 3D printers.')
		.addIntegerOption((option) =>
			option
				.setName('printer')
				.setDescription('3D printer to check the status of')
				.addChoices(constants.printerChoices)
		),
	ephemeral: true,
	async execute(interaction) {
        const printerID = interaction.options.getInteger('printer');

        let msg;
        
		if (printerID !== null) {
            msg = await printers.getMessage(printerID, false);
            const viewButton = new Discord.MessageButton({
                customId: `${constants.status.showButtonId}${printerID}`,
                label: constants.status.showButtonText,
                style: 'SECONDARY',
            });
            const cancelButton = new Discord.MessageButton({
                customId: `${constants.status.cancelButtonId}${printerID}`,
                label: constants.status.cancelButtonText,
                style: 'DANGER',
                disabled: true,
            });
            const buttonRow = new Discord.MessageActionRow().addComponents(viewButton, cancelButton,);
            msg.components = [buttonRow];
        } else {
            msg = await farm.getFarmEmbed();
        }

        msg.ephemeral = true;
        interaction.editReply(msg);
	}
};
