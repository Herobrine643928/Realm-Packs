import { world, system } from '@minecraft/server';

const adminTag = 'stafftag'; //The tag that allows players to rename text entities.

const cmdPrefix = '!' //Prefix for custom commands.

world.beforeEvents.chatSend.subscribe(chat => {
	const player = chat.sender;
	const inputs = chat.message.split(/\s+/);
	const cmd = inputs.shift();
	if (cmd.toLowerCase() === `${cmdPrefix}rename`) {
		chat.cancel = true;
		system.run(() => {
			if (player.hasTag(adminTag)) {
				const entity = player.getEntitiesFromViewDirection({ maxDistance: 5 })?.shift();
				if (entity?.entity.typeId === 'floating:text') entity.entity.nameTag = inputs.join(' ').replace(/\\n/g, '\n');
			} else player.sendMessage(`§cYou are not allowed to use this command!`);
			return;
		})
	}
});