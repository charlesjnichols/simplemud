const path = require('path');
const fs = require('fs');
const Fuse = require('fuse.js');
const { is_direction, get_command_function } = require('./movement-alias');
const { send } = require('../functions/player');

const commandCache = new Map();

const getCommandContexts = () => {
  const base = path.join(process.cwd(), 'src/core/commands');
  return fs.readdirSync(base).filter((f) => fs.statSync(path.join(base, f)).isDirectory());
};

const getAllCommands = (contexts, { reload = false } = {}) => {
  const activeContexts = contexts?.length ? contexts : getCommandContexts();
  const cacheKey = activeContexts.sort().join(',');

  if (!reload && commandCache.has(cacheKey)) {
    return commandCache.get(cacheKey);
  }

  const allCommands = activeContexts.flatMap((ctx) => {
    const dir = path.join(process.cwd(), 'src/core/commands', ctx);
    console.log(`[getAllCommands] Searching directory: ${dir}`);

    if (!fs.existsSync(dir)) {
      console.warn(`[getAllCommands] Directory does not exist: ${dir}`);
      return [];
    }

    const files = fs.readdirSync(dir).filter((file) => file.endsWith('.js'));

    console.log(`[getAllCommands] Found ${files.length} command(s) in '${ctx}':`, files);

    return files.map((file) => ({
      verb: path.basename(file, '.js'),
      ctx,
      file: path.join(dir, file),
    }));
  });

  commandCache.set(cacheKey, allCommands);
  return allCommands;
};

const dispatchCommand = (contexts, verb, args, player, options = {}) => {
  const commands = getAllCommands(contexts, options);

  if (options.reload) return;

  if (is_direction(verb)) {
    const file = get_command_function(verb);
    if (file) {
      delete require.cache[require.resolve(file)];
      const fn = require(file);
      return fn(player, args);
    }
  }

  const command = commands.find((c) => c.verb === verb || c.verb.startsWith(verb));

  if (command) {
    delete require.cache[require.resolve(command.file)];
    const fn = require(command.file);
    return fn(player, args, { dispatchCommand });
  }

  // @ts-ignore
  const fuse = new Fuse(commands, { keys: ['verb'], threshold: 0.4 });
  const result = fuse.search(verb);
  const suggestion = result[0]?.item?.verb;

  if (suggestion) {
    return send(player, `Unknown command: '${verb}'. Did you mean '${suggestion}'?`);
  }

  send(player, `Unknown command: '${verb}'`);
};

module.exports = dispatchCommand;
