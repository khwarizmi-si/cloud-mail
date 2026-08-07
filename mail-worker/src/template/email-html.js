import domainUtils from '../utils/domain-uitls';

function forceLinksNewTab(html) {
	return html.replace(/<a\b((?:(?!<\/?a\b)[\s\S])*?)>/gi, (match, attrs) => {
		if (/\btarget\s*=/i.test(attrs)) return match;
		return `<a${attrs} target="_blank" rel="noopener noreferrer">`;
	});
}

export default function emailHtmlTemplate(html, domain) {
	const replaced = html.replace(/{{domain}}/g, domainUtils.toOssDomain(domain) + '/');
	const content = forceLinksNewTab(replaced);
	const srcdoc = content
		.replace(/&/g, '&amp;')
		.replace(/"/g, '&quot;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;');

	return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>html, body, iframe { width: 100%; height: 100%; margin: 0; border: 0; }</style>
</head>
<body>
  <iframe sandbox="allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation" referrerpolicy="no-referrer" srcdoc="${srcdoc}" title="Email content"></iframe>
</body>
</html>`;
}
