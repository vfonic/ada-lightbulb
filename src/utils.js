const vscode = require('vscode');

const FS_REGEX = /\\/g;

function abbrevCommit(commitHash) {
  return commitHash.substring(0, 8);
}

exports.abbrevCommit = abbrevCommit;

function copyToClipboard(text) {
  return new Promise(resolve => {
    vscode.env.clipboard.writeText(text).then(() => resolve(true), () => resolve(false));
  });
}

exports.copyToClipboard = copyToClipboard;

function getPathFromUri(uri) {
  return uri.fsPath.replace(FS_REGEX, '/');
}

exports.getPathFromUri = getPathFromUri;

function evalPromises(data, maxParallel, createPromise) {
  return new Promise((resolve, reject) => {
    if (data.length === 1) {
      createPromise(data[0])
        .then(v => resolve([v]))
        .catch(() => reject());
    } else if (data.length === 0) {
      resolve([]);
    } else {
      let results = new Array(data.length),
        nextPromise = 0,
        rejected = false,
        completed = 0;

      function startNext() {
        let cur = nextPromise;
        nextPromise++;
        createPromise(data[cur])
          .then(result => {
            if (!rejected) {
              results[cur] = result;
              completed++;
              if (nextPromise < data.length) {
                startNext();
              } else if (completed === data.length) {
                resolve(results);
              }
            }
          })
          .catch(() => {
            reject();
            rejected = true;
          });
      }

      for (let i = 0; i < maxParallel && i < data.length; i++) {
        startNext();
      }
    }
  });
}

exports.evalPromises = evalPromises;
