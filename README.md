## Config-Merger-V2

Allows for merging of multiple json files into a single json file.

This is a fork form the original config-merger by David Moody (https://github.com/dlmoody/config-merger)


[![Build Status](https://travis-ci.org/dillonjason/config-merger-v2.svg?branch=master)](https://travis-ci.org/dillonjason/config-merger-v2)
[![Code Climate](https://codeclimate.com/github/dillonjason/config-merger-v2/badges/gpa.svg)](https://codeclimate.com/github/dillonjason/config-merger-v2)
[![Test Coverage](https://codeclimate.com/github/dillonjason/config-merger-v2/badges/coverage.svg)](https://codeclimate.com/github/dillonjason/config-merger-v2)
[![Issue Count](https://codeclimate.com/github/dillonjason/config-merger-v2/badges/issue_count.svg)](https://codeclimate.com/github/dillonjason/config-merger-v2)
## Install

```npm install config-merger-v2```

## Required Options

* source - Path to config files
* environment - Config environment
* output - File name for output

## How do I do?

In a source file you will need one or more "Base Config" file.  They should follow the naming convention:
```{YourLabel}.config.json```

Config merger will grab all these files and merge them into a single base config, so you can break this up to help you
organize things if you'd like or keep it as one massive file.

Then for each of your environments you will need a file with the following naming convention:
```{YourLabel}.config.{environment}.json```

Config merger will then merge all of your environment configs into a single environment config.  It will then merge
the base config with the environment config where the environment config takes priority and write it to your source
location.

### From Command Line

Simply run the following:
```config-merger-v2 --source=path/to/your/source --environment=dev --output=app.config.json```

### From package.json

In your package.json have a property config merger:
```
configmerger: {
    HelloWorld_Dev : {
        source: 'path/to/your/source',
        environment: 'dev',
        output: 'app.config.json'
    }
}
```

configName should be a unique name

Then you will want to run the following command:
```config-merger-v2 --configName=HelloWorld_Dev```

Profit !!!
