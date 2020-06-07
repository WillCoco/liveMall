const randomWord = (randomFlag = true, min = 16, max = 16) => {
	var str = "",
			range = min,
			// arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
			arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

	// 随机产生
	if(randomFlag){
			range = Math.round(Math.random() * (max-min)) + min;
	}
	for(let i=0; i<range; i++){
			var pos = Math.round(Math.random() * (arr.length-1));
			str += arr[pos];
	}
	return str;
}

export default randomWord;