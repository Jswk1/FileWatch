const chokidar = require("chokidar");
const chalk = require("chalk");
const fs = require("fs-extra");
const path = require("path");
const config = require("./config");

const copyFile = (src, dest) => {
    return new Promise((resolve, reject) => {

        fs.copy(src, dest, (error) => {
            error ? reject(error) : resolve();
        });

    });
}

const changeHandler = (filePath) => {
    copyFile(filePath, path.join(config.dest, filePath.replace(config.src, ""))).then(() => {
        console.log(chalk.green(`Finished copying file:\t\t`) + chalk.yellow(`${filePath}`));
    }, (error) => {
        console.log(chalk.red(error));
    });
}

const removeHandler = (filePath, isDir = false) => {

    if (isDir === false) {

        fs.unlink(filePath).then(() => {
            console.log(chalk.green(`Removed file:\t\t\t`) + chalk.red(`${filePath}`));
        });

    } else {
        fs.rmdir(filePath).then(() => {
            console.log(chalk.green(`Removed directory:\t\t`) + chalk.red(`${filePath}`));
        }, () => {})
    }

}

chokidar.watch(config.src, {
    ignored: [".svn", ".git"],
    usePolling: true,
    interval: 200,
    ignoreInitial: true
})
    .on("add", (path) => { changeHandler(path); })
    .on("change", (path) => { changeHandler(path); })
    .on("addDir", (path) => { changeHandler(path); })
    .on("unlink", (filePath) => { removeHandler(path.join(config.dest, filePath.replace(config.src, ""))); })
    .on("unlinkDir", (filePath) => { removeHandler(path.join(config.dest, filePath.replace(config.src, "")), true); });

console.log(chalk.green(`Watching for changes in:\t`) + chalk.cyan(config.src));