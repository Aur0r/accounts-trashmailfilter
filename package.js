Package.describe({
  name: 'aur0r:accounts-trashmailfilter',
  version: '0.0.1',
  summary: 'Denies registration to the app via the use of a trashmail',
  git: 'https://github.com/Aur0r/accounts-trashmailfilter',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use('accounts-base');
  api.use('ecmascript');
  api.use('http');
  api.use('service-configuration', ['client', 'server']);

  api.export('Trashmailfilter');
  api.addFiles('accounts-trashmailfilter.js');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('aur0r:accounts-trashmailfilter');
  api.addFiles('accounts-trashmailfilter-tests.js');
});
