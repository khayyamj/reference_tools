
var clientId = '';
var url = '';
var env = '';
if (~window.location.hostname.indexOf('cdn.mtc.byu.edu') ||
		window.location.hostname === 'apps.mtc.byu.edu') {
	clientId = 'f21aaabb-977c-42c4-990f-bf05eef780ad';
} else if (~window.location.hostname.indexOf('support-apps.mtc.byu.edu')) {
	clientId = '17383307-5776-4733-8199-bb0f816f7ddd';
} else if (~window.location.hostname.indexOf('test-apps.mtc.byu.edu') || ~window.location.hostname.indexOf('test2.mtc.byu.edu')) {
	clientId = 'ea894c1e-e571-4f59-8c51-990066ff63ea';
} else if (~window.location.hostname.indexOf('stage-apps.mtc.byu.edu') || ~window.location.hostname.indexOf('stage.mtc.byu.edu')) {
	clientId = '2404b7bf-1250-4802-87db-79333a54fbc4';
} else if (~window.location.hostname.indexOf('beta-apps.mtc.byu.edu')) {
	clientId = 'ac5ff5b4-a953-4ecf-add4-114199075622';
} else {
	clientId = '8b4ec156-f781-469a-8d38-006260ddb022';
}

var contentUrls = [
	'http://localhost:8080',
	'https://devapplications.mtc.byu.edu',
	'https://testapplications.mtc.byu.edu',
	'https://betaapplications.mtc.byu.edu',
	'https://stageapplications.mtc.byu.edu',
	'https://supportapplications.mtc.byu.edu',
	'https://api.mtc.byu.edu',
	'https://app.mtc.byu.edu'
];

var scopes = [
	'https://api.mtc.byu.edu/messaging',
	'https://app.mtc.byu.edu/missionaryserverside',
	'https://api.mtc.byu.edu/mtc',
	'https://api.mtc.byu.edu/missionary',
	'https://app.mtc.byu.edu/mtctools',
	'https://api.mtc.byu.edu/standards',
	'https://api.mtc.byu.edu/note'
];


MTCAuth.configure({
	clientId: clientId,
	contentUrls: contentUrls,
	scopes: scopes,
	redirectUri: true,
	options: {
		requestAuths: ''
	},
	newTabRedirectUri: false
});
