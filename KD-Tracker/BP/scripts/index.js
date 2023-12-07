import { Player, world } from '@minecraft/server';

const deathObjective = 'deaths'; //The objective to increase when a player dies.
const killObjective = 'kills'; //The objective to increase when a player kills another player.

world.getDimension('overworld').runCommandAsync(`scoreboard objectives add ${JSON.stringify(deathObjective)} dummy`);
world.getDimension('overworld').runCommandAsync(`scoreboard objectives add ${JSON.stringify(killObjective)} dummy`);
world.afterEvents.entityDie.subscribe(({ deadEntity, damageSource: { damagingEntity } }) => {
	if (!(deadEntity instanceof Player)) return;
	deadEntity.runCommandAsync(`scoreboard players add @s ${JSON.stringify(deathObjective)} 1`);
	if (!(damagingEntity instanceof Player)) return;
	damagingEntity.runCommandAsync(`scoreboard players add @s ${JSON.stringify(killObjective)} 1`);
});