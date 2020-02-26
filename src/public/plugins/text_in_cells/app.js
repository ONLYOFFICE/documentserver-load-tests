window.Asc.plugin.init = async function () {
    let j = 0;
    Asc.scope.rand_text = (Math.random().toString(36).slice(2).repeat(105)+'qq').length;
    console.log(Asc.scope.rand_text);

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
    }, 500);

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
