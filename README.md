<p align="center">
  <a href="https://github.com/homebridge/homebridge"><img src="https://raw.githubusercontent.com/homebridge/branding/master/logos/homebridge-color-round-stylized.png" height="140"></a>
</p>

<span align="center">

# homebridge-solis5g-battery

[![npm](https://img.shields.io/npm/v/homebridge-supla-battery.svg)](https://www.npmjs.com/package/homebridge-supla-battery) [![npm](https://img.shields.io/npm/dt/homebridge-supla-battery.svg)](https://www.npmjs.com/package/homebridge-supla-battery)

</span>

## Description

This [homebridge](https://github.com/homebridge/homebridge) plugin read UPS Supla Device (Hummidity) and translate it into Battery stats,  exposing it as a Fan Accessory to Apple's [HomeKit](http://www.apple.com/ios/home/). 
Battery % is displayed as rotationSpeed of the Fan.
When Fan is disabled - UPS is not working on backup (just standbay).



## Installation

1. Install [homebridge](https://github.com/homebridge/homebridge#installation)
2. Install this plugin: `npm install -g homebridge-supla-battery`

## Configuration

```json
"accessories": [
     {
        "accessory": "SuplaBattery",
        "name": "SuplaBattery",  
        "url": "
     }
]
```

### Core
| Key | Description | Default |
| --- | --- | --- |
| `accessory` | Must be `SuplaBattery` | N/A |
| `name` | Name to appear in the Home app | N/A |
| `url` | url to your Suppla Account) | N/A |


### Optional fields
| Key | Description | Default |
| --- | --- | --- |
| `lowBatteryTreshold` | If Battery level drop below definded treshold (0-100), notify Apple UI about it | N/A |


### Additional options
| Key | Description | Default |
| --- | --- | --- |
| `pollInterval` | Time (in seconds) between device polls | `120` |
| `model` | Appears under the _Model_ field for the accessory | plugin |
| `serial` | Appears under the _Serial_ field for the accessory | `000-000-000-002` |
| `manufacturer` | Appears under the _Manufacturer_ field for the accessory | author |
| `firmware` | Appears under the _Firmware_ field for the accessory | version |



# Thank you

If you like it, any BTC donation will be great. My BTC Wallet: 3Ma1KEEfvNbvfAEyvRvmGHxNs61qZE7Jew

<img width="244" alt="Zrzut ekranu 2021-10-12 o 11 19 06" src="https://user-images.githubusercontent.com/3016639/136928595-3eef3c29-e3ee-449b-95be-364fd5fbdab9.png">

2022