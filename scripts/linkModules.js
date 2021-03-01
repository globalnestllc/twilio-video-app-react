const glob = require('glob');
var childProcess = require('child_process');
const path = require('path');
const {promisify} = require('util');
const yargs = require('yargs');

const exec = promisify(childProcess.exec);

const rootPath = process.cwd();
const modulesPath = path.join(rootPath, './node_modules/@eventdex');

function getModuleFolders(path) {
    const modules = glob.sync('*', {cwd: path})
    return modules
}


async function run(argv) {
    const modules = getModuleFolders(modulesPath);
    console.log('Modules:', modules, modulesPath)
    let operation = argv.unlink ? 'unlink' : "link";


    modules.map(async (module) => {
        console.log(operation, ':', module, process.cwd())
        await exec(`yarn ${operation} @eventdex/${module}`);

        if (argv.unlink) {
            //We have to install them after unlinking.
            await exec('yarn install --force');
        }
        console.log('finished', operation, module)
    })
}

yargs
    .command({
        command: '$0',
        description: 'link/unlink @eventdex modules',
        builder: (command) => {
            return command
                .option('unlink', {alias: 'u', type: "boolean", description: 'unlink packages', default: false})
        },
        handler: run,
    })
    .help()
    .strict(true)
    .version(false)
    .parse();
