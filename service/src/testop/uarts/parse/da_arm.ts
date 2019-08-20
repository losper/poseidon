class Parse_Data{
	disposeSendData(send_id:any,msg:any){
		let send_data:any;
		switch(send_id){
			case "start_arm_server":
				send_data = msg+"/passoa "+msg+"/app.js& \n";
				break;
			case "button":
				let arr = msg.ct.split(" ");
				let str_10 = parseInt(arr[1],16).toString();
				let len = arr[1].length - str_10.length;
				for(let k=0;k<len;k++)str_10="0"+str_10;
				arr[1]=str_10;
				send_data = "sendevent "+msg.event+" "+arr.join(" ")+" \n";
				break;
			default:
				break;
		}
		return send_data;
	}
}
export default new Parse_Data();