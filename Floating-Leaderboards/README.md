# Floating Leaderboards

This pack allows the user to create floating leaderboards using script API.
The only experimental toggle needed for this pack is Beta APIs.
The default prefix for all commands is `!`, which can be changed in `scripts/index.js` as the `cmdPrefix` constant.
All examples in this file assume a default prefix of `!` being used.

The Resource Pack file IS REQUIRED, as it allows the text entity to be rendered correctly.

# Configuration
The `refreshRate` constant controls how many ticks it will take for the leaderboard entities to refresh.
- A lower number will speed it up, but cause more lag. Beware!
- The default value is 100 ticks, or 5 seconds.

The `topX` constant changes the max number of players visible on each leaderboard. Default is ten.

To switch the colours associated with each leaderboard element:
 
Change the constants located at the top of the `scripts/index.js` file.

`numberColour` will change the colour of the leading player ranking on the scoreboard.
`nameColour` will change the colour of the player's name on the scoreboard.
`scoreColour` will change the colour of the player's score on the provided objective.
- By default, these colours are Lime (§a), Light Blue (§b), and Light Red (§c), respectively.

The constant `adminTag` is simply the staff tag that will allow any player with this tag to edit floating text names.

# Commands
- rename: Renames the text entity the player is currently looking at. 
	Use \n in your command to set a new line on the entity's name.
	This command is only useable for players who have the adminTag config tag (this is `stafftag` by default)

# Setup
To use this pack:
1. Run /summon floating:text (and where you want it spawned, normal summon command stuff)
2. Add the following tags to the entity that just got summoned.

Tag: `Leaderboard:Objective-Header`
- The above tag is added to the text entity so it knows what objective to display, as well as the header for the leaderboard.
- An example tag could be `Leaderboard:money-§l§6TOP COINS`
- The above example would track the top players in the objective `money` with a leaderboard heading of `§l§6TOP COINS`.

Tag: `leaderboard`
- This tag will let the text entity know it is supposed to be displaying a leaderboard.

Example commands to add the tags:
`/tag @e[type=floating:text,c=1] add "Leaderboard:money-§l§6TOP COINS"`
`/tag @e[type=floating:text,c=1] add leaderboard`

!! BOTH TAGS ARE CASE-SENSITIVE !!

# Notes
- The colour codes can only be two characters long. Anything above this limit will not be displayed.
- Multiple leaderboards can exist in the same world! Just add the appropriate tags.
- This pack doubles as a floating text addon- simply don't add the leaderboard tags to the text entity.
- You can use the `!rename` custom command to rename entities that are not leaderboards.
- These leaderboards display offline players as well! Players will need to log on at least once to start being tracked.
- To despawn a text entity, trigger the event `text:despawn` through the /event command (or other means)

If you have questions, please ask me!

Created by Herobrine643928

[GitHub](https://github.com/Herobrine643928)

[Discord](https://discord.com/users/330740982117302283)
