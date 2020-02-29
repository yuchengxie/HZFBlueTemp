<template>
	<view class="page">
		<view style="padding: 16px;" v-show="currentDevice">
			<!-- 	<view class="uni-flex uni-row" style="border-bottom:1px solid #EEEEEE;padding: 5px;justify-contessnt:space-between;"> -->
			<view style="display: flex;flex-direction: row;justify-content: space-between;border-bottom:1px solid #EEEEEE;padding: 3px 0;">
				<!-- <view class="uni-flex uni-column"> -->
				<view style="display: flex;flex-direction: column;justify-content: center;">
					<!-- <text style="font-size: 20px;">{{currentDevice.name}}</text> -->
					<text style="font-size: 20px;color: #F0AD4E;">{{currentDevice.name}}</text>
					<text style="font-size: 13px;color:#888888">{{currentDevice.deviceId}}</text>
				</view>
				<view class="uni-flex uni-column" style="justify-content: center;align-items: flex-end;">
					<button plain="true" style="height: 35px;border-color: #09BB07;line-height: 35px;color:purple" type="primary"
					 @click="connectToBle">连接</button>
				</view>
			</view>
		</view>

		<view style="position: absolute;bottom: 0;width: 100%;bottom: 26px;display: flex;">
			<button type="primary" style="width: calc(100% - 30px);background-color: #67BF7F" @click="findAvilableBle">查找</button>
		</view>
		<!-- <button type="primary" style="position: absolute;bottom: 0;width: 93%;bottom: 26px;background-color: #67BF7F;" @click="findAvilableBle">查找</button> -->
	</view>
</template>

<style>
	.page{
		background-color: #FFFFFF;
	}
</style>

<script>
	export default {
		data() {
			return {
				currentDevice: '',
				arr: [],
			}
		},
		onLoad() {
			console.log('currentDevice:', this.currentDevice);
		},
		methods: {
			connectToBle() {
				uni.navigateBack();
				this.$eventHub.$emit('fire', this.currentDevice);
			},
			findAvilableBle() {
				var _that = this;
				this.arr = [];
				uni.openBluetoothAdapter({
					success(res) {
						console.log(res);
						uni.getBluetoothAdapterState({ //获取本机蓝牙适配器状态。
							success(r) {
								if (r.available) {

									uni.startBluetoothDevicesDiscovery();

									uni.onBluetoothDeviceFound(function(device) {
										var d = device['devices'][0];
										var name = d['name'];
										_that.arr.push(d);

										console.log('>>> d:', d);
										if (name.startsWith('TM_')) {
											_that.currentDevice = d;
											console.log('currentDevice:', _that.currentDevice);
											uni.stopBluetoothDevicesDiscovery({
												success(c) {
													console.log('=========停止扫描==========');
												}
											});
										}
									});
								} else {
									console.log('蓝牙适配器不可用');
								}

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
			},
		}
	}
</script>
