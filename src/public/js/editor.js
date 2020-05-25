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
    open(config)
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
    open(config)
}

function open(config) {
    var xhr = new XMLHttpRequest();
    xhr.open("post", "/jwt_generate", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = (e) => {
        if (xhr.responseText !== "") {
            console.log('123123123')
            config = JSON.parse(xhr.responseText).config
            window.instance = new DocsAPI.DocEditor("editor_frame", config);
        }
      }
      xhr.send(JSON.stringify(config));
}

function hash_username() {
    return window.location.hash.split('#username=')[1]?.split("#")[0];
}

function hash_key() {
    return window.location.hash.split('#key=')[1]?.split("#")[0];
}