const simpleGit = require('simple-git');
const git = simpleGit();

module.exports =  async function (localPath) {
    await git.silent(true)
        .cwd(localPath)
        .pull('origin', 'main')
        .then( () =>
            console.log("Pulled Repo...")
        )
        .catch( (err) => {
            console.log(err);
            throw err
        });
}