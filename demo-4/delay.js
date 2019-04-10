const delay = (ms) => new Promise(function (resolve) {
    setTimeout(resolve, ms);
});
module.exports = delay;