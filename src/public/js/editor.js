function open_and_wait(key, userName, exampleUrl, plugin, document) {
    const config = {
        documentType: document.documentType,
        document: {
            fileType: document.fileType,
            url: exampleUrl + "/public/documents/" + document.name,
        },
        editorConfig: {
            mode: 'edit',
            callbackUrl: exampleUrl + '/callback',
            user: {
                name: userName
            },
            plugins: {
                autostart: [
                    "asc.{9616f139-6386-4e50-83bb-3dad84938cdd}"
                ],
                pluginsData: [
                    exampleUrl + "/public/plugins/" + plugin + "/config.json"
                ]
            },
        },
    };
    if (key) {
        config['document']['key'] = key
    }

    if (this.userName) {
        config['editorConfig']['user'] = {"name": this.userName}
    }
    window.instance = new DocsAPI.DocEditor("editor_frame", config);
}

function open_without_plugin(key, userName, exampleUrl) {
    const config = {
        documentType: document.documentType,
        document: {
            fileType: document.fileType,
            url: exampleUrl + "/public/documents/" + document.name,
        },
        editorConfig: {
            mode: 'edit',
            callbackUrl: exampleUrl + '/callback',
            user: {
                name: userName
            },
            plugins: {
                pluginsData: [
                    exampleUrl + "/public/plugins/" + plugin + "/config.json"
                ]
            },
        },
    };
    if (key) {
        config['document']['key'] = key
    }

    if (this.userName) {
        config['editorConfig']['user'] = {"name": this.userName}
    }
    window.instance = new DocsAPI.DocEditor("editor_frame", config);
}

function hash_username() {
    return window.location.hash.split('#username=')[1]?.split("#")[0];
}

function hash_key() {
    return window.location.hash.split('#key=')[1]?.split("#")[0];
}