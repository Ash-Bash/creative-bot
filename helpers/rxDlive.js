const DLive = require('dlive-js');
const rxConfig = require('./rxConfig');
const { BehaviorSubject } = require('rxjs');
const { filter, first } = require('rxjs/operators');

let rxDlive = new BehaviorSubject(null).pipe(filter(x => !!x));

module.exports.rxDlive = rxDlive;

let newDlive = config => {
  rxDlive.next(
    new DLive(
      Object.assign(
        {},
        { authKey: config.authKey },
        config.blockchainPrivKey
          ? { blockchainPrivKey: config.blockchainPrivKey }
          : {}
      )
    )
  );
};

let firstRun = true;

rxConfig.pipe(filter(x => !!x.authKey)).subscribe(config => {
  if (firstRun) {
    firstRun = false;
    return newDlive(config);
  }
  rxDlive.pipe(first()).subscribe(dlive => {
    if (dlive) {
      dlive = null;
    }
    newDlive(config);
  });
});
