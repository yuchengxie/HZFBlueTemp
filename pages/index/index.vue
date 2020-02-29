<template>
	<view class="content">
		<button type="primary" @click="initBle">初始化</button>
		<button type="primary" @click="getBles">读取</button>
		<button type="primary" @click="connectBle">bleconnect</button>
		<button type="primary" @click="send">电量1</button>
		<button type="primary" @click="cewen">采集温度</button>
		<button type="primary" @click="close">关闭连接</button>

	<!-- 	<button type="primary" @click="testinit">封装测试初始化</button>
		<button type="primary" @click="test1">test1</button> -->

	</view>
</template>

<script>
	import tm from '../../utils/ble/service_tm.js';
	export default {
		data() {
			return {
				title: 'Hello',
				arr: []
			}
		},
		onLoad() {
			
		},
		methods: {

			async test1() {
				// let adapterState = await tm.openBluetoothAdapter();
				// let adapterState = await tm.getBluetoothAdapterState();
				// console.log('>>> adapterState:', adapterState);
				// if (adapterState.errCode != 0) {
				// 	uni.showModal({
				// 		content: '蓝牙适配器关闭' + adapterState.errCode,
				// 		showCancel: false
				// 	});
				// } else {
				// 	uni.showModal({
				// 		content: '蓝牙适配器已打开-正常' + adapterState.errCode,
				// 		showCancel: false
				// 	});
				// }
				let openAdapterState = await tm.openBluetoothAdapter();
				console.log('>>> errCode:', openAdapterState.errCode);
				if (openAdapterState.errCode) {
					uni.showModal({
						content: '蓝牙初始化失败，请检查蓝牙是否打开:' + openAdapterState.errCode,
						showCancel: false
					});
				} else {
					uni.showModal({
						content: '蓝牙初始化成功',
						showCancel: false
					});
				}

				// bbb.t2().then(r=>{
				// 	console.log('>>r:',r);
				// }).catch(e=>{
				// 	console.log('>>e:',e);
				// })

				// console.log('>>> a:',a['errCode']);
			},

			async testinit() {
				let t = await ble_tm.methods.initBle('TM_04D');
				// console.log(ble_tm.methods.initBle('TM_04D'))
				// let special=await ble_tm.initBle('TM_0D4');
				console.log('special:', t);
			},

			close() {
				uni.closeBLEConnection({
					deviceId: '10:7A:93:70:00:4D',
					complete(r) {
						console.log('断开连接:', r);
					}
				})
				this.arr = [];
			},
			cewen() {
				console.log('cewen....');
				uni.getBLEDeviceServices({ //获取蓝牙设备所有服务(service)
					deviceId: '10:7A:93:70:00:4D',
					success(s) {
						console.log('services:', JSON.stringify(s.services));
					},
					complete(c) {
						// console.log('c:',c.services);
					}
				})

				uni.getBLEDeviceCharacteristics({ //获取蓝牙设备某个服务中所有特征值(characteristic)。
					deviceId: '10:7A:93:70:00:4D',
					serviceId: '0000FFF0-0000-1000-8000-00805F9B34FB',

					// serviceId: '0x180f',
					// serviceId: '180F',
					complete(c) {
						console.log('characteristic:', c);
						uni.readBLECharacteristicValue({
							deviceId: '10:7A:93:70:00:4D',
							serviceId: '0000FFF0-0000-1000-8000-00805F9B34FB',
							// serviceId: '180F',
							characteristicId: '0000FFF1-0000-1000-8000-00805F9B34FB',
							success(res) {
								console.log('readBLECharacteristicValue:', res)
							}
						})
						uni.onBLECharacteristicValueChange(function(res) {
							console.log('characteristic value comed:', res);
						})

						uni.notifyBLECharacteristicValueChange({
							deviceId: '10:7A:93:70:00:4D',
							serviceId: '0000FFF0-0000-1000-8000-00805F9B34FB',
							// serviceId: '180F',
							characteristicId: '0000FFF1-0000-1000-8000-00805F9B34FB',
							state: true,
							complete(notify) {
								console.log('notify:', notify);
							}
						})
					}
				})
			},
			send() {
				console.log('send');
				uni.getBLEDeviceServices({ //获取蓝牙设备所有服务(service)
					deviceId: '10:7A:93:70:00:4D',
					success(s) {
						console.log('services:', JSON.stringify(s.services));
					},
					complete(c) {
						// console.log('c:',c.services);
					}
				})

				uni.getBLEDeviceCharacteristics({ //获取蓝牙设备某个服务中所有特征值(characteristic)。
					deviceId: '10:7A:93:70:00:4D',
					serviceId: '0000180F-0000-1000-8000-00805F9B34FB',

					// serviceId: '0x180f',
					// serviceId: '180F',
					complete(c) {
						console.log('characteristic:', c);
						uni.readBLECharacteristicValue({
							deviceId: '10:7A:93:70:00:4D',
							serviceId: '0000180F-0000-1000-8000-00805F9B34FB',
							// serviceId: '180F',
							characteristicId: '00002A19-0000-1000-8000-00805F9B34FB',
							success(res) {
								console.log('readBLECharacteristicValue:', res)
							}
						})

						uni.onBLECharacteristicValueChange(function(res) {
							console.log('characteristic value comed:', res);
						})

						uni.notifyBLECharacteristicValueChange({
							deviceId: '10:7A:93:70:00:4D',
							serviceId: '0000180F-0000-1000-8000-00805F9B34FB',
							characteristicId: '00002A19-0000-1000-8000-00805F9B34FB',
							state: true,
							complete(notify) {
								console.log('notify:', notify);
							}
						})
					}
				})

			},
			connectBle() {
				let d = this.arr.filter((item, index) => {
					return item.name === 'TM_004D';
				})
				let currentDevice = d[0];
				console.log('ready connect device:', JSON.stringify(currentDevice));
				if (!currentDevice) return;
				uni.createBLEConnection({
					// deviceId: 'C6:F2:C8:98:81:59',
					// deviceId: '10:7A:93:70:00:4D',
					deviceId: currentDevice.deviceId,
					complete(c) {
						console.log('>>> 连接蓝牙:', c);
					}
				})
			},
			initBle() {
				this.arr = [];
				var _that = this;
				uni.openBluetoothAdapter({
					success(res) {
						console.log(res);
						uni.getBluetoothAdapterState({
							success(r) {
								console.log('r:', r);
								uni.startBluetoothDevicesDiscovery();
								uni.onBluetoothDeviceFound(function(device) {
									let d = device['devices'][0];
									let name = d['name'];
									_that.arr.push(d);
									console.log('新发现蓝牙设备:', d);
									if (name.startsWith('TM_')) {
										uni.stopBluetoothDevicesDiscovery({
											success(st) {
												console.log('目标蓝牙设备:', d);
												console.log('停止扫描:', st);
											}
										})
									}
								});
							},
							fail(err) {
								console.log('getBluetoothAdapter err:',err);
							}
						})
					},
					fail(err) {
						console.log('openBluetoothAdapter err:',err);
						uni.showModal({
							content: '请检查蓝牙',
							showCancel: false
						});
						// gotoAppPermissionSetting
						// uni.gotoAppPermissionSetting();
						// permission.gotoAppSetting();
					}
				})
			},
			getBles() {
				console.log(JSON.stringify(this.arr));
			},
		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>
