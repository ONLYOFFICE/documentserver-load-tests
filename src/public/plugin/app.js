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
        await write();
        if (socket.readyState === 1) {
            socket.send(sessionData);
        } else if (socket.readyState === 3) {
            socket = new WebSocket('ws://' + window.location.host + '/message');
        }
    }, 1000);

    function write() {
        j += 1;
        return new Promise(resolve => {
            window.Asc.plugin.callCommand(function () {
                var oDocument = Api.GetDocument();
                var oParagraph, oParaPr;
                var oParaStyle = oDocument.GetDefaultStyle("paragraph");
                oParagraph = oDocument.GetElement(Math.floor(Math.random() * 1320));
                oParagraph.SetStyle(oParaStyle);
                oParaPr = oParagraph.GetParaPr();
                oParaPr.SetBetweenBorder("single", 24, 0, Asc.scope.r, Asc.scope.g, Asc.scope.b);
            }, false, '', resolve());
        })
    }
};
