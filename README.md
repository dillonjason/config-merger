## Configify

Allows for crazy config file setups. merges multiple files into one file.


[![Build Status](https://travis-ci.org/dlmoody/config-merger.svg?branch=master)](https://travis-ci.org/dlmoody/config-merger)


Create a section in your package.json config like this

```
 "config-merger": [
    {
      "company1": {
        "output": "app.config.json",
        "srcFolder": "company1_configs"
      }
    },
    {
      "company2": {
        "output": "app.config.json",
        "srcFolder": "company2_configs"
      }
    }
  ],
  ...
```

Then you could set up a npm script with something like

```
 NODE_ENV=production  config-merger --config=company1
 ```
