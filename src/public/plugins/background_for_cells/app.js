window.Asc.plugin.init = async function () {
    let j = 0;
    Asc.scope.r = Math.floor(Math.random() * 254);
    Asc.scope.g = Math.floor(Math.random() * 254);
    Asc.scope.b = Math.floor(Math.random() * 254);
    console.log(Asc.scope.r);
    console.log(Asc.scope.g);
    console.log(Asc.scope.b);

    let socket = new WebSocket('ws://' + window.location.host + '/message');
    const sessionData = JSON.stringify({
        username: window.Asc.plugin.info.userName,
        key: window.Asc.plugin.info.documentId
    });

    setInterval(async function () {
        console.time('write');
        await write();
        console.timeEnd('write');
        if (socket.readyState === 1) {
            socket.send(sessionData);
        } else if (socket.readyState === 3) {
            socket = new WebSocket('ws://' + window.location.host + '/message');
        }
    }, 100);

    function write() {
        j += 1;
        return new Promise(resolve => {
            window.Asc.plugin.callCommand(function () {
                const oWorksheet = Api.GetActiveSheet();
                const range = oWorksheet.GetRangeByNumber(Math.floor(Math.random() * 28), Math.floor(Math.random() * 40));
                range.SetFillColor(Api.CreateColorFromRGB(Asc.scope.r, Asc.scope.g, Asc.scope.b));
            }, false, '', resolve);
        })
    }
};
