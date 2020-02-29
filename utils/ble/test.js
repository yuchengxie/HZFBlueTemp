getCharge() {
	console.log('================测试电量==================');
	console.log(this.currentDevice);
	var _that = this;
	// uni.getBLEDeviceServices({ //获取蓝牙设备所有服务(service)
	// 	deviceId: this.currentDevice.deviceId,
	// 	success(s) {
	// 		_that.currentDevice.service=JSON.stringify(s.services);
	// 		console.log('服务:', JSON.stringify(s.services));
	// 		console.log('_that.currentDevice:', _that.currentDevice);
	// 	},
	// })

	uni.getBLEDeviceCharacteristics({ //获取蓝牙设备某个服务中所有特征值(characteristic)。
		deviceId: this.currentDevice.deviceId,
		serviceId: '0000180F-0000-1000-8000-00805F9B34FB', //暂时固定这么写，后面比较是否有标准区别
		complete(characteristic) {
			// 获取蓝牙设备某个服务中所有特征值(characteristic)
			console.log('服务特征uuid:', characteristic);
			uni.readBLECharacteristicValue({
				deviceId: _that.currentDevice.deviceId,
				serviceId: '0000180F-0000-1000-8000-00805F9B34FB',
				characteristicId: '00002A19-0000-1000-8000-00805F9B34FB',
				success(res) {
					console.log('readBLECharacteristicValue:', res)
				}
			})

			uni.onBLECharacteristicValueChange(function(res) {
				console.log('电量:', res.value);
				var t = tools.hex2int(Buffer.from(res.value, 'base64').toString('hex'))
				_that.charge = 'charge:' + t + '%';
				console.log('获取电量:' + t);
			})

			uni.notifyBLECharacteristicValueChange({
				deviceId: _that.currentDevice.deviceId,
				serviceId: '0000180F-0000-1000-8000-00805F9B34FB',
				characteristicId: '00002A19-0000-1000-8000-00805F9B34FB',
				state: false,
				complete(notify) {
					console.log('notify:', notify);
				}
			})
		}
	})

},
