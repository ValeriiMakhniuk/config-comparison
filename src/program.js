import { Command } from 'commander';
import genDiff from './gendiff';

const program = new Command();

program.version('0.0.1');
program
  .description('Compares two configuration files and shows a difference.')
  .arguments('<firstConfig> <secondConfig>')
  .option('-f, --format [type]', 'output format')
  .action((filePath1, filePath2) => {
    console.log(genDiff(filePath1, filePath2));
  });

export default program;
