import domainUtils from '../utils/domain-uitls';

export default function emailHtmlTemplate(html, domain) {
	const content = html.replace(/{{domain}}/g, domainUtils.toOssDomain(domain) + '/');
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
  <iframe sandbox referrerpolicy="no-referrer" srcdoc="${srcdoc}" title="Email content"></iframe>
</body>
</html>`;
}
