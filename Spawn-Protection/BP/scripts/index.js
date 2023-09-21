import { world } from "@minecraft/server";

const safezoneTag = 'safezone'; //The tag that will stop spawn damage (player damage tag is separate).

world.beforeEvents.playerBreakBlock.subscribe(evd => {
	if (evd.player.hasTag(safezoneTag)) evd.cancel = true;
});
world.beforeEvents.playerPlaceBlock.subscribe(evd => {
	if (evd.player.hasTag(safezoneTag)) evd.cancel = true;
});