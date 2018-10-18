import * as createError from 'http-errors';
import * as express from 'express';
import { join } from 'path';
import { EOL } from 'os';
import { existsSync, readFileSync, mkdirSync, appendFile } from 'fs';
import rfs from 'rotating-file-stream';
import * as cookieParser from 'cookie-parser';
import * as logger from 'morgan';
import * as compression from 'compression';
import * as helmet from 'helmet';
import * as favicon from 'serve-favicon';

import indexRouter from './routes/index';
import middleware from './routes/middlewares';

var app = express();

// view engine setup
app.set('views', join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// @if NODE_ENV!='production'
import * as sass from 'node-sass';
import { transpileModule } from 'typescript';

app.locals.pretty = true;
app.use(logger('dev'));
app.set('json spaces', 4);

app.use((req, res, next) => {
	// Dynamically compile SCSS/SASS to CSS
	// Do stuff Synchronously since it doesn't make too much of a difference for development
	if (req.url.endsWith('.css')) {
		let cssLocation = join(__dirname, 'public', req.url);
		if (existsSync(cssLocation)) {
			res.writeHead(200, { 'Content-Type': 'text/css' });
			res.write(readFileSync(cssLocation));
			res.end();
		} else if (existsSync(cssLocation.replace('.css', '.scss'))) {
			try {
				let result = sass.renderSync({
					file: cssLocation.replace('.css', '.scss')
				});
				res.writeHead(200, { 'Content-Type': 'text/css' });
				res.write(result.css);
				res.end();
			} catch (err) {
				if (err) {
					next(err);
					return;
				}
			}
		} else if (existsSync(cssLocation.replace('.css', '.sass'))) {
			try {
				let result = sass.renderSync({
					file: cssLocation.replace('.css', '.sass')
				});
				res.writeHead(200, { 'Content-Type': 'text/css' });
				res.write(result.css);
				res.end();
			} catch (err) {
				if (err) {
					next(err);
					return;
				}
			}
		} else {
			next();
		}
	} else {
		next();
	}
});

app.use((req, res, next) => {
	// Dynamically compile TS to JS
	// Do stuff Synchronously since it doesn't make too much of a difference for development
	if (req.url.endsWith('.js')) {
		let jsLocation = join(__dirname, 'public', req.url);
		if (existsSync(jsLocation)) {
			res.writeHead(200, { 'Content-Type': 'application/javascript' });
			res.write(readFileSync(jsLocation));
			res.end();
		} else if (existsSync(jsLocation.replace('.js', '.ts'))) {
			let result = transpileModule(
				readFileSync(jsLocation.replace('.js', '.ts')).toString(),
				JSON.parse(
					readFileSync(join(__dirname, '..', 'tsconfig.json')).toString()
				)
			);
			res.writeHead(200, { 'Content-Type': 'application/javascript' });
			res.write(result.outputText);
			res.end();
		} else {
			next();
		}
	} else {
		next();
	}
});
// @endif

/* @if NODE_ENV=='production' **
app.use(favicon(join(__dirname, 'public', 'favicon.ico')));
app.use('/', compression());

app.locals.pretty = false;

let logDirectory = join(__dirname, 'logs');
// ensure log directory exists
if (existsSync(logDirectory) == false)
	mkdirSync(logDirectory);

app.use(logger(logger.compile(':date, :method :url :status :response-time ms - :res[content-length]'), {
	stream: rfs(logFileNamer, {
		interval: '1d', // rotate daily
		path: logDirectory,
		compress: true
	})
}));
app.set('json spaces', 0);
app.use(helmet());
/* @endif */

app.use(express.static(join(__dirname, 'public')));

app.use('/', middleware);
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use((_req, _res, next) => {
	next(createError(404));
});

// error handler
app.use((err: any, req: express.Request, res: express.Response, _next: express.NextFunction) => {
	res.status(err.status || 500);
	// Handle the error here
	res.send('404 Not Found');

	// To be uncomented once the error page is made
	//res.render('error', {
	//	error: {
	//		status: err.status || 500
	//		message: app.get('env') != 'production' ? err.message || 'Internal server error' : '',
	//		object: app.get('env') != 'production' ? err : {}
	//	}
	//});

	if (app.get('env') == 'production') {
		appendFile(join(__dirname, 'logs', 'error.log'), err.toString() + EOL + err.stack, err => {
			console.error(err);
		});
	} else {
		console.error(err);
	}
});

function logFileNamer(time: Date, index: number) {
	if (!time)
		return "access.log";
	let year = time.getFullYear();
	let month = time.getMonth();
	let day = time.getDate();
	let hour = time.getHours();
	let minute = time.getMinutes();
	let seconds = time.getSeconds();

	return `access - ${year}-${month}-${day}, ${hour}:${minute}:${seconds}${index ? ' (' + index + ')' : ''}.log`;
}

export default app;
