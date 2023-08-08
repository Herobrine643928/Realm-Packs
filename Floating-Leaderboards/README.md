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

The constant `adminTag` is simply the staff tag that will allow any player with this tag to edit floating text names & set up leaderboards.

The constant `configItem` is simply the staff tag that will allow any player who right-clicks with this item (and has the above tag) to edit & set up leaderboards.

# Commands
- rename: Renames the text entity the player is currently looking at. 
	Use \n in your command to set a new line on the entity's name.
	This command is only useable for players who have the `adminTag` config tag (this is `stafftag` by default)

# Setup
To use this pack:
1. Right-click a block with the config item while you have the admin tag (these are `'minecraft:nether_star'` & `'stafftag'` by default)
2. Configure the menu to your liking! If an objective you enter does not exist, it will be created.
3. To edit a leaderboard, just click the block underneath it, allowing you to edit the objective, display, colours, and even despawn the leaderboard if you want.

# Notes
- The colour codes can only be two characters long. Anything above this limit will throw an error.
- Multiple leaderboards can exist in the same world!
- This pack doubles as a floating text addon- simply use a text spawn egg.
- You can use the `!rename` custom command to rename entities that are not leaderboards.
- These leaderboards display offline players as well! Players will need to log on at least once to start being tracked.

If you have questions, please ask me!

Created by Herobrine643928

[GitHub](https://github.com/Herobrine643928)

[Discord](https://discord.com/users/330740982117302283)
