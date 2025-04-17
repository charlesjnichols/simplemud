const { send_to_everyone } = require('../../functions/world');
const { yellowBold } = require('../../../utils/formatting');

const { playerRepository, connectionRepository } = require('../../datastores').get();

module.exports = (player) => {
  playerRepository.delete(player.id);

  const connection = connectionRepository.getConnection(player.id);
  connection.close();

  send_to_everyone(yellowBold(`${player.name} has left the realm.`));
};
