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

**jwt_key** - is a `jwt` key. Set it if your documentserver is use jwt

**plugin** - is a part of configuration of `editor` object.

example:
```
{
        autostart: [
          'asc.{9616f139-6386-4e50-83bb-3dad84938cdd}',
        ],
        pluginsData: [
          'https://onlyoffice-plugins.s3.us-east-2.amazonaws.com/load_tests_plugin/config.json'
        ],
}
```

2. Build docker image and run it

```bash 
docker build . --tag load
docker run -itd -p 3000:3000

```

After it, pp will work on `http://ip/`