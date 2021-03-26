const simpleGit = require('simple-git');
const git = simpleGit();

module.exports =  async function (localPath, branchName) {
    await git.silent(true)
        .cwd(localPath)
        .checkoutLocalBranch(branchName)
        .then( () =>
            console.log("Checked out a new local branch...")
        )
        .catch( (err) => {
            console.log(err);
            throw err
        });
}