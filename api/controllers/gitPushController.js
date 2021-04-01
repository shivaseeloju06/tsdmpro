const simpleGit = require('simple-git');
const git = simpleGit();
const privateKey = "expleo_azure";

module.exports =  async function (remotePath, localPath, thisBranch, filesToAdd, user, password, useSSH) {
    let URL;
    if (useSSH === false) {
        URL = `https://${user}:${password}@${remotePath}`;
    } else {
        let domain = remotePath.slice(0, remotePath.indexOf('/'));
        const GIT_SSH_COMMAND = "ssh -o 'IdentitiesOnly=yes' -i ./.ssh/" + privateKey + " " + user + "@" + domain;
        URL = "https://" + remotePath;
        await git.env('GIT_SSH_COMMAND', GIT_SSH_COMMAND)
    }

    await git.cwd(localPath)
        .add(filesToAdd)
        .then( () =>
            console.log("Files added to local branch...")
        )
        .catch( (err) => {
            console.log(err);
            throw err
        });

        await git.cwd(localPath)
        .commit("files published for this transaction")
        .then( () =>
            console.log("Files commited on local branch...")
        )
        .catch( (err) => {
            console.log(err);
            throw err
        });

        await git.cwd(localPath)
        .push('origin', thisBranch, ['-u'])
        .then( () =>
            console.log("Pushed a new local branch to remote...")
        )
        .catch( (err) => {
            console.log(err);
            throw err
        });

        await git.cwd(localPath)
        .checkout('main')
        .then( () =>
            console.log("Checked out main branch...")
        )
        .catch( (err) => {
            console.log(err);
            throw err
        });

        await git.cwd(localPath)
        .deleteLocalBranch(thisBranch)
        .then( () =>
            console.log("Delete session working branch...")
        )
        .catch( (err) => {
            console.log(err);
            throw err
        });

        await git.removeRemote('origin')
        .then( () =>
            console.log("Remove remotes...")
        )
        .catch( (err) => {
            console.log(err);
            throw err
        });
}