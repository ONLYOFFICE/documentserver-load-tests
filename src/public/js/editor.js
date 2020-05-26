/* eslint-disable no-unused-vars */
/**
 * is a method for open document and wait. Plugin will be execute automaticly
 * @param {string} key The first number.
 * @param {string} userName The first number.
 * @param {string} exampleUrl The first number.
 * @param {string} plugin The first number.
 * @param {string} document The first number.
 */
function openAndWait(key, userName, exampleUrl, plugin, document) {
  const config = {
    documentType: document.documentType,
    document: {
      fileType: document.fileType,
      url: exampleUrl + '/public/documents/' + document.name,
    },
    editorConfig: {
      mode: 'edit',
      callbackUrl: exampleUrl + '/callback',
      user: {
        name: userName,
      },
    },
  };
  if (key) {
    config['document']['key'] = key;
  }

  if (userName) {
    config['editorConfig']['user'] = {'name': userName};
  }
  config['editorConfig']['plugins'] = plugin;
  open(config);
}

/**
 * is a method for open document and wait. Plugin will not be execute
 * @param {string} key is a key for this document. Is a unique inside one group.
 * @param {string} userName the username of current user. Created by patterds user_<group_number>.
 * @param {string} exampleUrl is a url for current test example.
 */
function openWithoutPlugin(key, userName, exampleUrl) {
  const config = {
    documentType: document.documentType,
    document: {
      fileType: document.fileType,
      url: exampleUrl + '/public/documents/' + document.name,
    },
    editorConfig: {
      mode: 'edit',
      callbackUrl: exampleUrl + '/callback',
      user: {
        name: userName,
      },
      plugins: {
        pluginsData: [
          exampleUrl + '/public/plugins/' + plugin + '/config.json',
        ],
      },
    },
  };
  if (key) {
    config['document']['key'] = key;
  }

  if (userName) {
    config['editorConfig']['user'] = {'name': userName};
  }
  open(config);
}

/**
 * is a method for open document by params
 * @param {json} config is a full config for this document
 */
function open(config) {
  const xhr = new XMLHttpRequest();
  xhr.open('post', '/jwt_generate', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onreadystatechange = (e) => {
    if (xhr.responseText !== '') {
      config = JSON.parse(xhr.responseText).config;
      window.instance = new DocsAPI.DocEditor('editor_frame', config);
    }
  };
  xhr.send(JSON.stringify(config));
}

/**
 * Getting username from url
 * @return {string} current username
 */
function hashUsername() {
  return window.location.hash.split('#username=')[1]?.split('#')[0];
}

/**
 * Getting key from url
 * @return {string} current document key
 */
function hashKey() {
  return window.location.hash.split('#key=')[1]?.split('#')[0];
}
