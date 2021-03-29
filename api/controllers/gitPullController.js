const simpleGit = require('simple-git');
const git = simpleGit();

module.exports =  async function (remotePath, localPath, user, password) {
    let URL = `https://${user}:${password}@${remotePath}`

    await git.cwd(localPath)
        .then( () =>
            console.log("Set working directory for Repo...")
        )
        .catch( (err) => {
            console.log(err);
            throw err
        });

        await git.addRemote('origin', URL)
        .then( () =>
            console.log("Added Remote...")
        )
        .catch( (err) => {
            console.log(err);
            throw err
        });

        await git.pull('origin', 'main')
        .then( () =>
            console.log("Pulled Repo...")
        )
        .catch( (err) => {
            console.log(err);
            throw err
        });
}