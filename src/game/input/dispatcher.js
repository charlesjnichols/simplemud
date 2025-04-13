const path = require('path');
const fs = require('fs');
const Fuse = require('fuse.js');

const getAllCommands = (contexts) => {
  return contexts.flatMap((ctx) => {
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
};

const dispatchCommand = (contexts, verb, args, player, databases) => {
  const commands = getAllCommands(contexts);
  const command = commands.find((c) => c.verb === verb || c.verb.startsWith(verb));

  if (command) {
    const fn = require(command.file);
    return fn(player, args, databases);
  }

  // Fuzzy suggestion
  // @ts-ignore
  const fuse = new Fuse(commands, {
    keys: ['verb'],
    threshold: 0.4,
  });

  const result = fuse.search(verb);
  if (result.length > 0) {
    const suggestion = result[0].item.verb;
    return player.send(`Unknown command: '${verb}'. Did you mean '${suggestion}'?`);
  }

  player.send(`Unknown command: '${verb}'`);
};

module.exports = dispatchCommand;
