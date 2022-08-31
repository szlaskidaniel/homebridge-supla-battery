let Service, Characteristic
const packageJson = require('./package.json')
const request = require('request')

const moment = require('moment');

module.exports = function (homebridge) {
  Service = homebridge.hap.Service
  Characteristic = homebridge.hap.Characteristic
  homebridge.registerAccessory('homebridge-supla-battery', 'SuplaBattery', SuplaBattery)
}

function SuplaBattery (log, config) {
  this.log = log

  this.url = config.url;
  this.name = config.name  
  this.pollInterval = config.pollInterval || 120
  this.lowBatteryTreshold = config.lowBatteryTreshold;

  this.maxv = config.maxv || 12.9; // 100%
  this.minv = config.minv || 11.9;  // 0%
  
  
  this.manufacturer = config.manufacturer || packageJson.author
  this.serial = config.serial || '000-000-000-002'
  this.model = config.model || packageJson.name
  this.firmware = config.firmware || packageJson.version

  this.service = new Service.Fan(this.name)
  this.batteryService = new Service.BatteryService("Battery"); 
  
}

SuplaBattery.prototype = {

  identify: function (callback) {
    this.log('Identify requested!')
    callback()
  },

  _httpRequest: function (url, method, headers, callback) {            
    request({
      url: url,      
      method: method,
      headers: headers
    },
    function (error, response, body) {
      callback(error, response, body)
    })
  },


  _getStatus: function (callback) {
    this.log.debug('>> getData...');
  
  
    const headers = {
      'Content-Type': 'application/json',  
    };

    
    
    this._httpRequest(this.url, 'GET',headers, function (error, response, responseBody) {
      this.log.debug('<< response');
      if (error) {
        this.log.warn('Error getting status: %s', error.message)
        this.service.getCharacteristic(Characteristic.On).updateValue(new Error('Polling failed'))        
        callback(error)
      } else {        
        this.log.debug('Device response: %s', responseBody);        
        try {
          if (response?.statusCode !== 200) {
            console.log(response.message);
            this.log.warn(`Error HTTP ${response.statusCode}`);
            callback();
            return;
          }

          const json = JSON.parse(responseBody);                    
          let batteryValue = json.humidity; // humidity == percentage in Volts
          let UPSState = 0;

          if (batteryValue > 13) {            
            UPSState = 0;
            batteryValue = 100;
          } else {
            UPSState = 1;
            batteryValue = mapBetween(batteryValue, 0, 100, this.minv, this.maxv);
          }
                                      
          this.service.getCharacteristic(Characteristic.On).updateValue(UPSState)
          this.log.debug('Updated state to: %s', UPSState)
          
          this.service.getCharacteristic(Characteristic.RotationSpeed).updateValue(batteryValue)
          this.log.debug('Updated batteryPercent to: %s', batteryValue)

          // Update battery service
          this.batteryService.getCharacteristic(Characteristic.BatteryLevel).updateValue(batteryValue);
          
          if (this.lowBatteryTreshold) {             
            this.batteryService.getCharacteristic(Characteristic.StatusLowBattery).updateValue(batteryValue < this.lowBatteryTreshold ? 1 : 0);
            if (batteryValue < this.lowBatteryTreshold) this.log('Low battery warning');
          }
                  
          callback()
        } catch (e) {
          this.log.warn('Error parsing status: %s', e.message)
        }
      }
    }.bind(this))
  },


  getServices: function () {
    this.informationService = new Service.AccessoryInformation()
    this.informationService
      .setCharacteristic(Characteristic.Manufacturer, this.manufacturer)
      .setCharacteristic(Characteristic.Model, this.model)
      .setCharacteristic(Characteristic.SerialNumber, this.serial)
      .setCharacteristic(Characteristic.FirmwareRevision, this.firmware)

    this._getStatus(function () {})
        

    setInterval(function () {
      this._getStatus(function () {})
    }.bind(this), this.pollInterval * 1000)

    return [this.informationService, this.service, this.batteryService]
  }

}

function mapBetween(currentNum, minAllowed, maxAllowed, min, max) {
  return (maxAllowed - minAllowed) * (currentNum- min) / (max - min) + minAllowed;
}
