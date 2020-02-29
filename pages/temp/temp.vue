<template>
	<view class="page">
		<view class="v-temp">
			<text @click="closeBle" style="font-size: 18px;">{{blueState}}</text>
			<view style="flex: 1;flex-direction: column;display: flex;
				font-size: 40px;justify-content: center;align-items: center;width: 100%;">
				<view style="display:flex;flex-direction: row;justify-content: flex-end;width: 100%;font-size: 20px;">
					<text>
						{{ charge }}
					</text>
				</view>
				<view style="flex:1;flex-direction: column;flex-direction: column;display: flex;justify-content: center;">
					<view v-if="temp">
						<text style="font-size: 40px;">
							<text style="font-size: 20px;">溫度:</text> {{ temp }}<text v-show="temp">°C</text>
						</text>
					</view>
					<!-- <view v-if="!temp">
						<text style="font-size: 45px;">
							体温测量
						</text>
					</view> -->
				
				</view>
				<!-- <button type="primary" @click="closeBle">断开连接</button> -->
			</view>
		</view>
		<view style="display: flex;flex-direction: row;justify-content: center;margin-bottom: 40px;">
			<view style="display: flex;flex-direction: row;height: 80px;width: 70%;justify-content: space-around;">	
					<view style="display: flex;flex-direction: column;align-items: center;justify-content: center;width: 80px;height: 80px;">
						<image src="../../static/History.png" style="width: 50px;height: 50px;border-radius: 50px;"></image>
						<text>历史记录</text>
					</view>
					<view style="display: flex;flex-direction: column;align-items: center;justify-content: center;width: 80px;height: 80px" @click="searchBle">
						<image src="../../static/add.png" style="width: 50px;height: 50px;border-radius: 50px;"></image>
						<text>搜索设备</text>
					</view>
					<view style="display: flex;flex-direction: column;align-items: center;justify-content: center;width: 80px;height: 80px">
						<image src="../../static/settings.png" style="width: 50px;height: 50px;border-radius: 50px;"></image>
						<text>设置</text>
					</view>
			</view>
		</view>
	</view>
</template>
<script>
import tools from '../../utils/tools.js';
export default {
	data() {
		return {
			title: 'Hello',
			arr: [],
			currentDevice: '',
			charge: '',
			temp: '',
			blueState:'等待蓝牙连接'
		};
	},
	onLoad() {
	},
	methods: {
		searchBle(){
			var _that=this;
			this.$eventHub.$on('fire',data=>{
				console.log('TODO Connect BLE Data:'+data);
				this.currentDevice=data;
				_that.connectBle();
			})
			uni.navigateTo({
				url:'../blue/blue'
			})
		},
		openNotify() {
			console.log('================开始监听数据(电量,温度)==================');
			console.log('监听设备:'+this.currentDevice.name);
			var _that = this;
			
			//温度
			uni.readBLECharacteristicValue({
				deviceId: _that.currentDevice.deviceId,
				serviceId: '0000FFF0-0000-1000-8000-00805F9B34FB',
				characteristicId: '0000FFF1-0000-1000-8000-00805F9B34FB',
				success(res) {
					console.log('readBLECharacteristicValue:', res);
				}
			});
						
			uni.notifyBLECharacteristicValueChange({
				deviceId: _that.currentDevice.deviceId,
				serviceId: '0000FFF0-0000-1000-8000-00805F9B34FB',
				characteristicId: '0000FFF1-0000-1000-8000-00805F9B34FB',
				state: true,
				complete(notify) {
					console.log('温度 notify:', notify);
				}
			});
			
			//电量
			uni.readBLECharacteristicValue({
				deviceId: _that.currentDevice.deviceId,
				serviceId: '0000180F-0000-1000-8000-00805F9B34FB',
				characteristicId: '00002A19-0000-1000-8000-00805F9B34FB',
				success(res) {
					console.log('readBLECharacteristicValue:', res)
				}
			})
					
			uni.notifyBLECharacteristicValueChange({
				deviceId: _that.currentDevice.deviceId,
				serviceId: '0000180F-0000-1000-8000-00805F9B34FB',
				characteristicId: '00002A19-0000-1000-8000-00805F9B34FB',
				state: true,
				complete(notify) {
					console.log('电量 notify:', notify);
				}
			})
			
			uni.onBLECharacteristicValueChange(function(res) {
				let r=Buffer.from(res.value, 'base64').toString('hex');
				console.log(">>> r:",r);
				if(r.length===2){
					var t = tools.hex2int(r);
					_that.charge ='蓝牙电量:'+ t + '%';
					console.log('当前电量:' + t);
				}else if(r.length===8){
					var t = tools.hex2int(r.slice(2,6)) / 10;
					_that.temp = t.toString();
					console.log('当前温度:' + t);
				}
			})
		},
		
		connectBle() {
			if (!this.currentDevice) {
				console.log('未选择设备');
				return;
			}
			console.log('准备连接目标设备:', this.currentDevice.deviceId);
			var _that=this;
			uni.createBLEConnection({
				deviceId: this.currentDevice.deviceId,
				complete(res) {
					if(res.code===0){
						_that.blueState=_that.currentDevice.name+'连接成功';
						console.log('连接蓝牙成功:', res,res.code,_that.currentDevice.name);
						setTimeout(_that.openNotify,3000);
						
					}
				}
			});
			uni.onBLEConnectionStateChange(function(res){
				console.log(`device ${res.deviceId} state has changed, connected: ${res.connected}`)
			})
		},
		closeBle() {
			if(!this.currentDevice) {
				console.log('未找到连接设备');
				return;	
			}
			var _that=this;
			uni.closeBLEConnection({
				deviceId: this.currentDevice.deviceId,
				complete(r) {
					_that.blueState='等待蓝牙连接';
					console.log('断开连接:', r);
					uni.showToast({
						title:"关闭蓝牙连接",duration:2000
					})
				}
			});
			this.arr = [];
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
								// if (name.startsWith('Pow')) {
									uni.stopBluetoothDevicesDiscovery({
										success(st) {
											_that.currentDevice = d;
											console.log('目标蓝牙设备:', d);
											console.log('停止扫描:', st);

											uni.getBLEDeviceServices({
												//获取蓝牙设备所有服务(service)
												deviceId: _that.currentDevice.deviceId,
												success(s) {
													console.log('目标蓝牙设备所有服务:', JSON.stringify(s.services));
												}
											});
										}
									});
								}
							});
						},
						fail(err) {
							console.log('getBluetoothAdapter err:', err);
						}
					});
				},
				fail(err) {
					console.log('openBluetoothAdapter err:', err);
					uni.showModal({
						content: '请检查蓝牙',
						showCancel: false
					});
				}
			});
		}
	}
};
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
