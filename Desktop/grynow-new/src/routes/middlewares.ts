import { Router } from 'express';
import { get } from 'request';
import { readdirSync } from 'fs';
import { join } from 'path';
import { googleAnalytics, facebookPixel } from '../config/config.sample';

let router = Router();

// Keep a local DB of IPs whose country-code is
// already known to avoid triggering rate limiting
let knownIPs = new Map<string, string>();

let strings = new Map<string, any>();

let langs = readdirSync(join(__dirname, '..', 'i18n'));
langs.forEach(lang => {
	lang = lang.replace('.json', '');
	strings.set(lang, require(`../i18n/${lang}`));
});

router.use(async (req, res, next) => {
	//let ipInfo = await getIpInfo(req.ip, 'IN');
	res.locals.strings = strings.get('en-US');
	next();
});

router.use((_req, res, next) => {
	res.locals.config = {
		gaTrackingId: googleAnalytics.trackingId,
		pixelTrackingId: facebookPixel.trackingId
	};
	next();
});

function getIpInfo(ip: string, fallback: string) {
	return new Promise(resolve => {
		if(knownIPs.has(ip)) {
			resolve(knownIPs.get(ip));
			return;
		}
		get(`https://ipapi.co/${ip}/json`)
			.on('response', (res) => {
				if(res.body && res.body.country) {
					resolve(res.body.country);
					knownIPs.set(ip, res.body.country);
				} else {
					resolve(fallback);
					knownIPs.set(ip, fallback);
				}
			})
			.on('error', (err) => {
				console.error(err);
				resolve(fallback);
			});
	});
}

export default router;