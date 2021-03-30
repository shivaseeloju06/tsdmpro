const simpleGit = require('simple-git');
const git = simpleGit();
const privateKey = "expleo_azure";

module.exports =  async function (remotePath, localPath, user, password, useSSH) {
    let URL;
    if (useSSH === false) {
        URL = `https://${user}:${password}@${remotePath}`;
        await git.clone(URL, localPath)
        .then( () =>
            console.log("Cloned Repo...")
        )
        .catch( (err) => {
            console.log(err);
            throw err
        });
    } else {
        let domain = remotePath.slice(0, remotePath.indexOf('/'));
        const GIT_SSH_COMMAND = "ssh -o 'IdentitiesOnly=yes' -i ./.ssh/" + privateKey + " " + user + "@" + domain;
        URL = "https://" + remotePath;
        await git.env('GIT_SSH_COMMAND', GIT_SSH_COMMAND)
        .clone(URL, localPath)
        .then( () =>
            console.log("Cloned Repo...")
        )
        .catch( (err) => {
            console.log(err);
            throw err
        });
    }

    await git.cwd(localPath)
        .then( () =>
            console.log("Set working directory for Repo...")
        )
        .catch( (err) => {
            console.log(err);
            throw err
        });
        
        let allRemotes = await git.getRemotes(); 
        if (allRemotes.length !== 0) {
            console.log(allRemotes);
            await git.removeRemote('origin')
            .then( () =>
                console.log("Remove remotes...")
            )
            .catch( (err) => {
                console.log(err);
                throw err
            });
        }

        await git.addRemote('origin', URL)
        .then( () =>
            console.log("Added Remote...")
        )
        .catch( (err) => {
            console.log(err);
            throw err
        });
}