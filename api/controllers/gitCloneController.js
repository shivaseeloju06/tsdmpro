const simpleGit = require('simple-git');
const git = simpleGit();

module.exports =  async function (remotePath, localPath, user, password) {
    let URL = `https://${user}:${password}@${remotePath}`

    await git.silent(true)
        .clone(URL, localPath)
        .then( () =>
            console.log("Cloned Repo...")
        )
        .catch( (err) => {
            console.log(err);
            throw err
        });

    await git.silent(true)
        .addRemote('origin', URL)
        .then( () =>
            console.log("Added Remote...")
        )
        .catch( (err) => {
            console.log(err);
            throw err
        });
}