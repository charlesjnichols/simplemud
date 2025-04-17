const { green, redBold } = require('../../utils/formatting');
const { send } = require('../../functions/player');

module.exports = (player, args, { dispatchCommand }) => {
  try {
    dispatchCommand([], '', [], player, { reload: true });
    send(player, green('Command cache reloaded from disk.'));
  } catch (err) {
    console.error('[reload] failed to reload commands:', err);
    send(player, redBold('Failed to reload commands.'));
  }
};
