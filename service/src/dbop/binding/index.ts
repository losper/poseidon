import { getModel } from './model';
import { getEnabledCategories } from 'trace_events';

function getList(data: any, pis: any, BindingModel: any) {
	BindingModel.aggregate(
		[
			{
				$project: {
					_id: 0,
					__v: 0
				}
			}
		],
		function(err: any, docs: any) {
			if (!err) {
				data.route = 'binding';
				data.info.data = JSON.stringify(docs);
				pis.write(data);
			}
		}
	);
}

function add(data: any, pis: any, BindingModel: any) {
	let info: any = data.info.msg;
	BindingModel.findOne({ id: info.id }, (err: any, msg: any) => {
		if (!err) {
			if (msg) {
				BindingModel.updateOne(
					{ id: info.id },
					{
						$set: {
							content: info.content,
							date: Date.now()
						}
					},
					function(err: any) {
						if (!err) {
							data.info = true;
							pis.write(data);
						}
					}
				);
			} else {
				let model = new BindingModel({
					id: info.id,
					pid: info.pid,
					content: info.content
				});
				model.save(function(err: any, msg: any) {
					if (!err) {
						data.info = true;
						pis.write(data);
					}
				});
			}
		}
	});
}

function modify(data: any, pis: any, BindingModel: any) {
	let info: any = data.info.msg;
	BindingModel.updateOne(
		{ id: info.id },
		{
			$set: {}
		},
		function(err: any) {
			if (!err) {
				data.info = true;
				pis.write(data);
			}
		}
	);
}

function removeID(data: any, pis: any, BindingModel: any) {
	let info: any = data.info.msg;
	switch (info.type) {
		case 0:
			BindingModel.deleteOne({ id: info.id }, function(err: any) {
				if (!err) {
					data.info.status = true;
					pis.write(data);
				}
			});
			break;
		case 1:
			BindingModel.deleteMany({ pid: info.id }, (err: any, msg: any) => {
				if (!err) {
					data.info.status = true;
					pis.write(data);
				}
			});
			break;
	}
}

function copyPrj(data: any, pis: any, BindingModel: any) {
	BindingModel.aggregate([ { $out: data.info.msg.name + '_binding' } ], function(err: any) {
		if (!err) {
			data.info = true;
			pis.write(data);
		}
	});
}

function getDoc(data: any, pis: any, BindingModel: any) {
	BindingModel.findOne({ id: data.info.id }, { _id: 0, __v: 0, date: 0 }, (err: any, msg: any) => {
		if (!err) {
			data.data = JSON.parse(JSON.stringify(msg)).content;
			pis.write(data);
		}
	});
}

function disposeData(data: any, pis: any) {
	let BindingModel = getModel(data.info.prjname + '_binding');
	switch (data.job) {
		case 'list':
			getList(data, pis, BindingModel);
			break;
		case 'add':
			add(data, pis, BindingModel);
			break;
		case 'modify':
			modify(data, pis, BindingModel);
			break;
		case 'remove_id':
			removeID(data, pis, BindingModel);
			break;
		case 'copy':
			copyPrj(data, pis, BindingModel);
			break;
		case 'getDoc':
			getDoc(data, pis, BindingModel);
			break;
		default:
			break;
	}
}

export default { disposeData };
