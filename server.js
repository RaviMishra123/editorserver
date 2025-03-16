const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const { exec } = require('child_process');

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(cors());

app.post('/run-code', (req, res) => {
	const { code, language, input } = req.body;
	let output = '';
	let childProcess;

	const timeout = setTimeout(() => {
		output = 'Error: Code execution timed out.';
		sendResponse(output);
		if (childProcess && !childProcess.killed) {
			childProcess.kill();
		}
	}, 5000);

	function sendResponse(output) {
		clearTimeout(timeout);
		res.json({ output });
	}

	switch (language) {
		case 'java':
			execJava(code, input, sendResponse);
			break;
		case 'c_cpp':
			execCpp(code, input, sendResponse);
			break;
		case 'python':
			execPython(code, input, sendResponse);
			break;
		case 'go':
			execGo(code, input, sendResponse);
			break;
		case 'swift':
			execSwift(code, input, sendResponse);
			break;
		case 'scala':
			execScala(code, input, sendResponse);
			break;
		case 'ruby':
			execRuby(code, input, sendResponse);
			break;
		case 'dart':
			execDart(code, input, sendResponse);
			break;
		default:
			output = 'Unsupported programming language.';
			sendResponse(output);
	}
});

function execJava(code, userInput, callback) {
	const className = extractClassName(code);
	if (!className) {
		callback('Error: Unable to determine class name from Java code.');
		return;
	}

	writeCodeToFile(code, `java/${className}.java`, (err) => {
		if (err) {
			callback(`Error writing code to file: ${err}`);
			return;
		}

		fs.writeFile('java/input.txt', userInput, (err) => {
			if (err) {
				callback(`Error writing input to file: ${err}`);
				return;
			}

			exec(`javac java/${className}.java && java -cp java ${className} < java/input.txt`, (error, stdout, stderr) => {
				if (error) {
					callback(`Error executing Java code: ${error.message}`);
					return;
				}
				callback(stdout);
			});
		});
	});
}

function extractClassName(code) {
	const classRegex = /(?:class|Class)\s+([A-Za-z_$][A-Za-z\d_$]*)\s*\{/;
	const match = code.match(classRegex);
	return match ? match[1] : null;
}

function execCpp(code, userInput, callback) {
	writeCodeToFile(code, 'cpp/main.cpp', (err) => {
		if (err) {
			callback(`Error writing code to file: ${err}`);
			return;
		}

		fs.writeFile('cpp/input.txt', userInput, (err) => {
			if (err) {
				callback(`Error writing input to file: ${err}`);
				return;
			}

			exec('g++ cpp/main.cpp -o cpp/main && ./cpp/main < cpp/input.txt', (error, stdout, stderr) => {
				if (error) {
					callback(`Error executing C++ code: ${error.message}`);
					return;
				}
				callback(stdout);
			});
		});
	});
}

function execPython(code, userInput, callback) {
	writeCodeToFile(code, 'python/main.py', (err) => {
		if (err) {
			callback(`Error writing code to file: ${err}`);
			return;
		}

		fs.writeFile('python/input.txt', userInput, (err) => {
			if (err) {
				callback(`Error writing input to file: ${err}`);
				return;
			}

			exec('python3 python/main.py < python/input.txt', (error, stdout, stderr) => {
				if (error) {
					callback(`Error executing Python code: ${error.message}`);
					return;
				}
				callback(stdout);
			});
		});
	});
}

function execGo(code, userInput, callback) {
	writeCodeToFile(code, 'go/main.go', (err) => {
		if (err) {
			callback(`Error writing code to file: ${err}`);
			return;
		}

		fs.writeFile('go/input.txt', userInput, (err) => {
			if (err) {
				callback(`Error writing input to file: ${err}`);
				return;
			}

			exec('go run go/main.go < go/input.txt', (error, stdout, stderr) => {
				if (error) {
					callback(`Error executing Go code: ${error.message}`);
					return;
				}
				callback(stdout);
			});
		});
	});
}

function execSwift(code, userInput, callback) {
	writeCodeToFile(code, 'swift/main.swift', (err) => {
		if (err) {
			callback(`Error writing code to file: ${err}`);
			return;
		}

		fs.writeFile('swift/input.txt', userInput, (err) => {
			if (err) {
				callback(`Error writing input to file: ${err}`);
				return;
			}

			exec('swift swift/main.swift < swift/input.txt', (error, stdout, stderr) => {
				if (error) {
					callback(`Error executing Swift code: ${error.message}`);
					return;
				}
				callback(stdout);
			});
		});
	});
}

function execScala(code, userInput, callback) {
	writeCodeToFile(code, 'scala/main.scala', (err) => {
		if (err) {
			callback(`Error writing code to file: ${err}`);
			return;
		}

		fs.writeFile('scala/input.txt', userInput, (err) => {
			if (err) {
				callback(`Error writing input to file: ${err}`);
				return;
			}

			exec('scala scala/main.scala < scala/input.txt', (error, stdout, stderr) => {
				if (error) {
					callback(`Error executing Scala code: ${error.message}`);
					return;
				}
				callback(stdout);
			});
		});
	});
}

function execRuby(code, userInput, callback) {
	writeCodeToFile(code, 'ruby/main.rb', (err) => {
		if (err) {
			callback(`Error writing code to file: ${err}`);
			return;
		}

		fs.writeFile('ruby/input.txt', userInput, (err) => {
			if (err) {
				callback(`Error writing input to file: ${err}`);
				return;
			}

			exec('ruby ruby/main.rb < ruby/input.txt', (error, stdout, stderr) => {
				if (error) {
					callback(`Error executing Ruby code: ${error.message}`);
					return;
				}
				callback(stdout);
			});
		});
	});
}

function execDart(code, userInput, callback) {
	writeCodeToFile(code, 'dart/main.dart', (err) => {
		if (err) {
			callback(`Error writing code to file: ${err}`);
			return;
		}

		fs.writeFile('dart/input.txt', userInput, (err) => {
			if (err) {
				callback(`Error writing input to file: ${err}`);
				return;
			}

			exec('dart dart/main.dart < dart/input.txt', (error, stdout, stderr) => {
				if (error) {
					callback(`Error executing Dart code: ${error.message}`);
					return;
				}
				callback(stdout);
			});
		});
	});
}

function writeCodeToFile(code, filename, callback) {
	const dir = filename.split('/')[0];
	fs.mkdir(dir, { recursive: true }, (err) => {
		if (err && err.code !== 'EEXIST') {
			callback(`Error creating directory: ${err}`);
			return;
		}

		fs.writeFile(filename, code, callback);
	});
}

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
