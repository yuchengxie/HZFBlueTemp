export default {
	//初始化蓝牙模块
	openBluetoothAdapter() {
		return new Promise((resolve, reject) => {
			uni.openBluetoothAdapter({
				complete(res) {
					resolve(res);
				}
			})
		})
	},

}
