function open_and_wait(key, userName, exampleUrl) {
    const config = {
        documentType: 'text',
        document: {
            fileType: "docx",
            url: exampleUrl + "/public/documents/Document1.docx",
        },
        editorConfig: {
            mode: 'edit',
            callbackUrl: exampleUrl + '/callback',
            user: {
                name: userName
            },
            plugins: {
                autostart: [
                    "asc.{9616f139-6386-4e50-83bb-3dad84938ddd}"
                ],
                pluginsData: [
                    exampleUrl + "/public/plugin/config.json"
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
        documentType: 'text',
        document: {
            fileType: "docx",
            url: exampleUrl + "/public/documents/Document1.docx",
        },
        editorConfig: {
            mode: 'edit',
            callbackUrl: exampleUrl + '/callback',
            user: {
                name: userName
            },
            plugins: {
                pluginsData: [
                    exampleUrl + "/public/plugin/config.json"
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