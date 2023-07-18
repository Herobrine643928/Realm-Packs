import { Player, world } from '@minecraft/server';

const defaultDeathMsg = 'DP died'; //The default kill message to use
const defaultKillMsg = 'DP was killed by KP'; //The default death message to use
//DP will be replaced with the dead player's name, and KP will be replaced with the killing player's name.
//If you wish to use DP in your kill tag without it being a name, you can escape it by putting a ! in front- like !DP or !KP.
//The tags added in game must start with Death: for a death message, and Kill: for a kill message.

world.afterEvents.entityDie.subscribe(({ deadEntity, damageSource: { damagingEntity } }) => {
	if (deadEntity instanceof Player) {
		if (damagingEntity instanceof Player) {
			const killMsg = damagingEntity.getTags().find(t => t.startsWith('Kill:'))?.slice(5) ?? defaultKillMsg;
			if (killMsg) return world.sendMessage(killMsg.replace(/(?<!!)KP/g, damagingEntity.name).replace(/(?<!!)DP/g, deadEntity.name).replace(/!(?=KP|DP)/g, ''));
		};
		const deathMsg = deadEntity.getTags().find(t => t.startsWith('Death:'))?.slice(6) ?? defaultDeathMsg;
		if (deathMsg) world.sendMessage(deathMsg.replace(/(?<!!)DP/g, deadEntity.name).replace(/!(?=KP|DP)/g, ''));
	}
});