const { green, redBold } = require('../../utils/formatting');

module.exports = (player, args, databases, { dispatchCommand }) => {
  try {
    dispatchCommand([], '', [], player, databases, { reload: true });
    player.sendString(green('Command cache reloaded from disk.'));
  } catch (err) {
    console.error('[reload] failed to reload commands:', err);
    player.sendString(redBold('Failed to reload commands.'));
  }
};
