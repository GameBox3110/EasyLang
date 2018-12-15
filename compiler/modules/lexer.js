let LEXER = function (content, dictionary) {
	let text = content.replace(/\s\s+/gm, " ");
	let strings = text.split(";");
	
	let lexems = [];

	for (let i = 0; i < strings.length; i++) {
		let currentString = strings[i].trim();

		if (currentString !== "") {
			let words = currentString.split(" ");
			let copyString = currentString;
			let stringObject = {};

			let command = words[0];

			if (dictionary["function"][command.toLowerCase()]) {
				Object.assign(stringObject, { "function" : command });
			}
			else {
				Object.assign(stringObject, { "undefined_function" : command });
			}

			let value = copyString.replace(new RegExp(command + " : ", "g"), "");

			if (/\"(.*)\"/gim.test(value)) {
				if (value.length === 1) {
					Object.assign(stringObject, { 
						"value" : {
							"type" : "char",
							"value" : value
						}  
					});
				}
				else {
					Object.assign(stringObject, { 
						"value" : {
							"type" : "string",
							"value" : value
						}  
					});
				}
			}
			else {
				if (Number(value)) {
					//number 

					if (Number(value) % 1 === 0) {
						// int
						if (Number(value) > -2147483648 && Number(value) < 2147483647) {
							Object.assign(stringObject, { 
								"value" : {
									"type" : "integer",
									"value" : Number(value)
								}  
							});
						}
						else {
							if (Number(value) > -9223372036854775808 && Number(value) < 9223372036854775807) {
								Object.assign(stringObject, { 
									"value" : {
										"type" : "integer",
										"subtype" : "longint",
										"value" : Number(value)
									}  
								});
							}
							else {
								// Мы не можем работать с такими большими числами
								Object.assign(stringObject, { 
									"value" : {
										"type" : "integer",
										"subtype" : "infinity",
										"value" : Number(value)
									}  
								});
							}
						}
					}
					else {
						//float
						Object.assign(stringObject, { 
							"value" : {
								"type" : "float",
								"value" : Number(value)
							}  
						});
					}
				}
				else {
					//anything else
					Object.assign(stringObject, { 
						"value" : {
							"type" : "undefined",
							"value" : value
						}  
					});
				}
			}

			lexems.push(stringObject);
		}
	}

	return lexems;	
};

module.exports.LEXER = LEXER;