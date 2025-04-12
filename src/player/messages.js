const { Attribute, PlayerRank } = require('../attributes');
const { tostring } = require('../utils/strings');
const {
  padRight,
  printSection,
  printTwoCol,
  redBold,
  whiteBold,
  cyanBold,
  divider,
  green,
  cyan,
  red,
  yellow,
  white,
  padLeft,
} = require('../utils/formatting');

const createPlayerMessages = (player) => {
  function printExperience(options = {}) {
    const nextXP = player.needForLevel(player.level + 1);
    const percent = Math.round((100 * player.experience) / nextXP);

    const experience = [
      printTwoCol('Level:', player.level),
      printTwoCol('Experience:', `${player.experience}/${nextXP} (${percent}%)`),
    ];
    return printSection('Your Experience', experience, options);
  }

  function printInventory(options = {}) {
    const items = player.inventory.map((item) => item.name).join(', ') || 'None';
    const weapon = player.getWeapon() ? player.getWeapon().name : 'NONE!';
    const armor = player.getArmor() ? player.getArmor().name : 'NONE!';
    const money = `$${player.money}`;

    const lines = [
      printTwoCol('Items:', items),
      printTwoCol('Weapon:', weapon),
      printTwoCol('Armor:', armor),
      printTwoCol('Money:', money),
    ];

    return printSection('Your Inventory', lines, options);
  }

  function printStats() {
    const attr = player.GetAttr.bind(player);

    const identity = [
      printTwoCol('Name:', player.name),
      printTwoCol('Rank:', player.rank.toString()),
      printTwoCol(
        'HP/Max:',
        `${player.hitPoints}/${attr(Attribute.get('Attribute.MAXHITPOINTS'))} (${Math.round((100 * player.hitPoints) / attr(Attribute.get('Attribute.MAXHITPOINTS')) || 1)}%)`,
      ),
    ];

    const experience = [
      printTwoCol('Level:', player.level),
      printTwoCol(
        'Experience:',
        `${player.experience}/${player.needForLevel(player.level + 1)} (${Math.round((100 * player.experience) / (player.needForLevel(player.level + 1) || 1))}%)`,
      ),
    ];

    const attributes = [
      printTwoCol('Strength:', tostring(attr(Attribute.get('STRENGTH')))),
      printTwoCol('Accuracy:', tostring(attr(Attribute.get('ACCURACY')))),
      printTwoCol('Health:', tostring(attr(Attribute.get('HEALTH')))),
      printTwoCol('Dodging:', tostring(attr(Attribute.get('DODGING')))),
      printTwoCol('Agility:', tostring(attr(Attribute.get('AGILITY')))),
      printTwoCol('Strike Damage:', tostring(attr(Attribute.get('STRIKEDAMAGE')))),
      printTwoCol('StatPoints:', tostring(player.statPoints)),
      printTwoCol('Damage Absorb:', tostring(attr(Attribute.get('DAMAGEABSORB')))),
    ];

    return (
      printSection('Your Stats', identity, { bottom: false }) +
      printSection('Your Experience', experience, { bottom: false }) +
      printSection('Your Attributes', attributes)
    );
  }

  const printHelp = () => {
    const commands = [
      cyan(padRight(' /, /repeat', 28)) + '  ' + padLeft('Repeat your last command exactly.', 48),
      cyan(padRight(' chat "msg"', 28)) + '  ' + padLeft('Broadcast a message to all players.', 48),
      cyan(padRight(' experience', 28)) + '  ' + padLeft('Show experience and level progress.', 48),
      cyan(padRight(' help', 28)) + '  ' + padLeft('Show this command reference.', 48),
      cyan(padRight(' inventory', 28)) + '  ' + padLeft('List your inventory items.', 48),
      cyan(padRight(' quit', 28)) + '  ' + padLeft('Exit the game session.', 48),
      cyan(padRight(' remove "slot"', 28)) + '  ' + padLeft('Unequip weapon or armor.', 48),
      cyan(padRight(' stats', 28)) + '  ' + padLeft('Display character stats.', 48),
      cyan(padRight(' time', 28)) + '  ' + padLeft('Display system time and uptime.', 48),
      cyan(padRight(' use "item"', 28)) + '  ' + padLeft('Use an item from your inventory.', 48),
      cyan(padRight(' whisper "who" "msg"', 28)) + '  ' + padLeft('Send a private message.', 48),
      cyan(padRight(' who', 28)) + '  ' + padLeft('List currently online players.', 48),
      cyan(padRight(' who all', 28)) + '  ' + padLeft('List all players.', 48),
      cyan(padRight(' look', 28)) + '  ' + padLeft('Display current room details.', 48),
      cyan(padRight(' north|east|south|west', 28)) + '  ' + padLeft('Move in a direction.', 48),
      cyan(padRight(' get "item"', 28)) + '  ' + padLeft('Pick up an item from the ground.', 48),
      cyan(padRight(' drop "item"', 28)) + '  ' + padLeft('Drop an item on the ground.', 48),
      green(padRight(' train', 28)) + '  ' + padLeft('Level up (training room only).', 48),
      green(padRight(' editstats', 28)) + '  ' + padLeft('Allocate stat points (training room only).', 48),
      yellow(padRight(' list', 28)) + '  ' + padLeft('List items for sale (store).', 48),
      yellow(padRight(' buy "item"', 28)) + '  ' + padLeft('Purchase an item from the store.', 48),
      yellow(padRight(' sell "item"', 28)) + '  ' + padLeft('Sell an item to the store.', 48),
      cyan(padRight(' attack "enemy"', 28)) + '  ' + padLeft('Initiate an attack on an enemy.', 48),
    ];

    const god =
      player.rank >= PlayerRank.GOD
        ? [
            '',
            whiteBold('GOD COMMANDS'),
            yellow(padRight(' kick', 28)) + '  ' + padLeft('Remove a player from the realm', 48),
          ]
        : [];

    const admin =
      player.rank >= PlayerRank.ADMIN
        ? [
            '',
            whiteBold('ADMIN COMMANDS'),
            green(padRight(' announce ', 28)) + '  ' + padLeft('Broadcast a system-wide message', 48),
            green(padRight(' changerank', 28)) + '  ' + padLeft(" Update a player's rank", 48),
            green(padRight(' reload   ', 28)) + '  ' + padLeft('Reload game databases (items, rooms, etc.)', 48),
            green(padRight(' shutdown ', 28)) + '  ' + padLeft('Shutdown the game server', 48),
          ]
        : [];

    const full = [...commands, ...god, ...admin];

    return printSection('Help', full);
  };

  const printWhoList = (mode, playerDb) => {
    const filterFn = mode === 'all' ? () => true : (p) => p.loggedIn;

    const header = whiteBold('NAME              | LEVEL     | STATUS    | RANK');
    const rows = playerDb
      .values()
      .filter(filterFn)
      .map((p) => {
        const name = padRight(p.name, 18);
        const level = padRight(p.level.toString(), 10);
        const status = p.active ? green('Online   ') : p.loggedIn ? yellow('Inactive ') : red('Offline  ');

        const rankColor = p.rank === PlayerRank.ADMIN ? green : p.rank === PlayerRank.GOD ? yellow : white;

        const rank = rankColor(p.rank.toString());

        return `${name}| ${level}| ${status}| ${rank}`;
      });

    return printSection('WHO', [header, divider(), ...rows]);
  };

  return {
    death: () => redBold('You have died!'),
    resurrect: (roomName) => whiteBold(`You have died, but have been resurrected in ${roomName}`),
    xpLoss: (amount) => redBold(`You have lost ${amount} experience!`),
    xpGain: (amount) => cyanBold(`You gain ${amount} experience.`),
    reappear: (name) => whiteBold(`${name} appears out of nowhere!!`),
    whisperTo: (to, msg) => yellow(`You whisper to ${to}: `) + `${msg}`,
    whisperFrom: (from, msg) => yellow(`${from} whispers to you: `) + `${msg}`,
    printExperience,
    printInventory,
    printStats,
    printHelp,
    printWhoList,
  };
};

module.exports = {
  createPlayerMessages,
};
