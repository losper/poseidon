import * as net from 'net';
import * as pack from '@passoa/pack';

export class Device {
	private pos: any = new pack.unpackStream();
	private pis: any = new pack.packStream();
	private ints: any;
	constructor() {
		this.pis.on('data', (data: any) => {
			this.ints.write(data);
		});
		this.pos.on('data', (data: any) => {
			switch (data.type) {
				case 'init':
					this.pis.write({ type: 'info', class: 'device', name: 'device' });
					break;
				case 'auth':
					break;
			}
		});
	}
	async start() {
		let c_time = 5;
		while (c_time) {
			if (await this.connectLink()) {
				break;
			}
			c_time--;
		}
	}
	connectLink() {
		return new Promise((resolve) => {
			this.closeOnEvent();
			this.ints = net.connect(6000, '127.0.0.1', () => {
				console.info('device-link connect!!!');
				resolve(1);
			});
			this.ints.on('data', (data: any) => {
				this.pos.write(data);
			});
			this.ints.on('close', () => {
				console.info('close device-link socket!!!');
			});
			this.ints.on('error', () => {
				console.error('error');
				resolve(0);
			});
		});
	}
	private closeOnEvent() {
		if (this.ints) {
			this.ints.removeAllListeners('data');
			this.ints.removeAllListeners('close');
			this.ints.removeAllListeners('error');
		}
	}
	static create() {
		new Device().start();
	}
}
export function start() {
	Device.create();
}
