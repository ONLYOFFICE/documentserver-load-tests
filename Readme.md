# documentserver-load-tests

This repo is contain some tests and utilits for testing performance and load of documentserver

## Easy start steps

1. Change settings in `src/settings.json`
```json
{
  "hostUrl": "http://127.0.0.1",
  "hostPort": "80",
  "documentServer": "http://127.0.0.1",
  "userGroupCount": 4
}
```

**hostUrl** - url for this app start (without port and last slash). Do not use `localhost` if you plan to use docker

**hostPort** - port you want to start this app

**documentServer** - full url to worked documentserver

**userGroupCount** - max count of user for one document open

2. Build docker image and run it

```bash 
docker build . --tag load
docker run -itd -p 80:80 load

```

## How it work

After start app, you can use 2 special path: `http://ip/`and `http://ip/activity`

`http://ip/` - open example file (`src/public/documents/Document1.docx`).

Just open this path in many browsers for check load of documentserver coediting subsystem.

Every new browser (or browser tab) will be opened with editors, and autostarted plugin (`src/public/plugin`)

Max count of users in one coediting session is defines by `userGroupCount` option in `settigs.json`

Please, see onlyoffice-webdriver-page-opener for use selenium webdriver for opening browsers automaticly
