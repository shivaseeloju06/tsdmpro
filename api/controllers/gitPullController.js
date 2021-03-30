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

        await git.pull('origin', 'main')
        .then( () =>
            console.log("Pulled Repo...")
        )
        .catch( (err) => {
            console.log(err);
            throw err
        });
}