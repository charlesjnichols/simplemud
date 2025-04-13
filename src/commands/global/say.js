const youSay = (msg) => `You say: "${msg}"`;
const othersSay = (name, msg) => `${name} says: "${msg}"`;
const sayUsage = () => `Usage: say <message>`;

module.exports = (player, args) => {
  const message = args.join(' ').trim();
  if (!message) {
    return player.send(sayUsage());
  }

  const room = player.getCurrentRoom();
  room.players.forEach((p) => {
    const msg = p.id === player.id ? youSay(message) : othersSay(player.name, message);
    p.send(msg);
  });
};
