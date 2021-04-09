# Le'mon
Exporting your Cardano node metrics and stripping sensitive information

## Features
- single file bundle

## Usage

### Build
``` sh
git clone git@github.com:rizome-io/lemon.git && cd lemon
npm i
npm run build
chmod +x dist/lemon.js
./dist/lemon.js
```

### Run
```
Usage: lemon.js <command> [options]

Commands:
  lemon.js serve    listen for http requests

Options:
      --help        Show help                                          [boolean]
      --version     Show version number                                [boolean]
  -p, --port        api port to listen                  [number] [default: 8000]
  -h, --host        ip address to bind                    [default: "localhost"]
  -r, --prometheus  prometheus endpoint              [default: "localhost:9090"]
  -o, --prom-path   prometheus API path                     [default: "/api/v1"]
```

## TODO
- [ ] cache
- [ ] tests
- [ ] nix bundle
- [ ] endpoint configuration
