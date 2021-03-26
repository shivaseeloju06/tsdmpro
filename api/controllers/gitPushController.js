const simpleGit = require('simple-git');
const git = simpleGit();

module.exports =  async function (localPath, thisBranch, filesToAdd) {
    await git.silent(true)
        .cwd(localPath)
        .add(filesToAdd)
        .then( () =>
            console.log("Files added to local branch...")
        )
        .catch( (err) => {
            console.log(err);
            throw err
        });

        await git.silent(true)
        .cwd(localPath)
        .commit("files published for this transaction")
        .then( () =>
            console.log("Files commited on local branch...")
        )
        .catch( (err) => {
            console.log(err);
            throw err
        });

        await git.silent(true)
        .cwd(localPath)
        .push('origin', thisBranch, ['-u'])
        .then( () =>
            console.log("Pushed a new local branch to remote...")
        )
        .catch( (err) => {
            console.log(err);
            throw err
        });

        await git.silent(true)
        .cwd(localPath)
        .checkout('main')
        .then( () =>
            console.log("Checked out main branch...")
        )
        .catch( (err) => {
            console.log(err);
            throw err
        });

        await git.silent(true)
        .cwd(localPath)
        .deleteLocalBranch(thisBranch)
        .then( () =>
            console.log("Delete session working branch...")
        )
        .catch( (err) => {
            console.log(err);
            throw err
        });
}