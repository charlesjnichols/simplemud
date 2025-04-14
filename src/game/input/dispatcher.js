const path = require('path');
const fs = require('fs');
const Fuse = require('fuse.js');

const commandCache = new Map();

const getCommandContexts = () => {
  const base = path.join(process.cwd(), 'src/commands');
  return fs.readdirSync(base).filter((f) => fs.statSync(path.join(base, f)).isDirectory());
};

const getAllCommands = (contexts, { reload = false } = {}) => {
  const activeContexts = contexts?.length ? contexts : getCommandContexts();
  const cacheKey = activeContexts.sort().join(',');

  if (!reload && commandCache.has(cacheKey)) {
    return commandCache.get(cacheKey);
  }

  const allCommands = activeContexts.flatMap((ctx) => {
    const dir = path.join(process.cwd(), 'src/commands', ctx);
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

const dispatchCommand = (contexts, verb, args, player, databases, options = {}) => {
  const commands = getAllCommands(contexts, options);

  if (options.reload) return;

  const command = commands.find((c) => c.verb === verb);

  if (command) {
    delete require.cache[require.resolve(command.file)];
    const fn = require(command.file);
    return fn(player, args, databases, { dispatchCommand });
  }

  // @ts-ignore
  const fuse = new Fuse(commands, { keys: ['verb'], threshold: 0.4 });
  const result = fuse.search(verb);
  const suggestion = result[0]?.item?.verb;

  if (suggestion) {
    return player.send(`Unknown command: '${verb}'. Did you mean '${suggestion}'?`);
  }

  player.send(`Unknown command: '${verb}'`);
};

module.exports = dispatchCommand;
