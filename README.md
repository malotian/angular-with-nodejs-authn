# setup. 
1. add entry `127.0.0.1 t1.iam.lab` to `/etc/hosts`
2. ensure latest(reasonable) nodejs and agular are installed


# build 
## checkout code. 
	git clone git@github.com:msi-violations/node-authn-proxy.gi

sample output

    Cloning into 'node-authn-proxy'...
    remote: Enumerating objects: 81, done.
    remote: Counting objects: 100% (81/81), done.
    remote: Compressing objects: 100% (60/60), done.
    Receiving objects:  50% (41/81)used 74 (delta 13), pack-reused 0Receiving objects:  49% (40/81)
    Receiving objects: 100% (81/81), 240.81 KiB | 1.05 MiB/s, done.
    Resolving deltas: 100% (14/14), done.

checkedout directory contains two modules
	 `node-authn-proxy` node application handling the authnetication stuff
	 `node-authn-proxy/test-angular-app` angular application just for testing
 
### IMPORTANT STEP:
1. copy public cert(PEM Ffrmat) contents into `/node-authn-proxy/ssl.cert.pem`  and `/node-authn-proxy/cert/saml.signing.cert.pem`
2. copy private cert/key(PEM Ffrmat) contents into `/node-authn-proxy/ssl.key.pem` and `/node-authn-proxy/cert/saml.signing.key.pem`

## build node-authn-proxy
	cd node-authn-proxy
	npm install 

sample output

    npm WARN config global `--global`, `--local` are deprecated. Use `--location=global` instead.
    npm WARN EBADENGINE Unsupported engine {
    npm WARN EBADENGINE   package: 'xmlbuilder@2.4.6',
    npm WARN EBADENGINE   required: { node: '0.8.x || 0.10.x || 0.11.x  || 1.0.x' },
    npm WARN EBADENGINE   current: { node: 'v16.15.1', npm: '8.13.1' }
    npm WARN EBADENGINE }
    npm WARN deprecated native-or-bluebird@1.1.2: 'native-or-bluebird' is deprecated. Please use 'any-promise' instead.
    npm WARN deprecated xmldom@0.1.31: Deprecated due to CVE-2021-21366 resolved in 0.5.0
    npm WARN deprecated ejs@0.8.8: Critical security bugs fixed in 2.5.5
    npm WARN deprecated xmldom@0.1.16: Deprecated due to CVE-2021-21366 resolved in 0.5.0
    npm WARN deprecated lodash-node@2.4.1: This package is discontinued. Use lodash@^4.0.0.
    npm WARN deprecated core-js@2.6.12: core-js@<3.23.3 is no longer maintained and not recommended for usage due to the number of issues. Because of the V8 engine whims, feature detection in old core-js versions could cause a slowdown up to 100x even if nothing is polyfilled. Some versions have web compatibility issues. Please, upgrade your dependencies to the actual version of core-js.
    
    added 230 packages, and audited 231 packages in 12s
    
    13 packages are looking for funding
      run `npm fund` for details
    
    18 vulnerabilities (2 low, 2 moderate, 11 high, 3 critical)
    
    To address issues that do not require attention, run:
      npm audit fix
    
    To address all issues (including breaking changes), run:
      npm audit fix --force
    
    Run `npm audit` for details.


## build test-angular-app
	cd node-authn-proxy/test-angular-app
	npm install 

sample output

    npm WARN config global `--global`, `--local` are deprecated. Use `--location=global` instead.
    npm WARN deprecated source-map-resolve@0.6.0: See https://github.com/lydell/source-map-resolve#deprecated
    
    added 937 packages, and audited 938 packages in 1m
    
    107 packages are looking for funding
      run `npm fund` for details
    
    2 high severity vulnerabilities
    
    To address all issues, run:
      npm audit fix
    
    Run `npm audit` for details.

# run 
## run node-authn-proxy
	cd node-authn-proxy
	npm start

sample output

    npm WARN config global `--global`, `--local` are deprecated. Use `--location=global` instead.
    
    > node-authn-proxy@1.0.0 start
    > node ./bin/www
    Listening on port 8080

**Note: **This will start a nodejs applicationat http://localhost:8080 

## run test-angular-app
	cd node-authn-proxy/test-angular-app
	npm start 

sample output

    npm WARN config global `--global`, `--local` are deprecated. Use `--location=global` instead.
    
    > test-angular-app@0.0.0 start
    > ng serve --proxy-config proxy.conf.js
    
    Warning: Running a server with --disable-host-check is a security risk. See https://medium.com/webpack/webpack-dev-server-middleware-security-issues-1489d950874a for more information.
    √ Browser application bundle generation complete.
    
    Initial Chunk Files   | Names         |  Raw Size
    vendor.js             | vendor        |   2.11 MB |
    polyfills.js          | polyfills     | 315.33 kB |
    styles.css, styles.js | styles        | 207.36 kB |
    main.js               | main          |  19.04 kB |
    runtime.js            | runtime       |   6.53 kB |
    
                          | Initial Total |   2.64 MB
    
    Build at: 2022-08-03T00:26:45.644Z - Hash: 1f67a0d9a3babbd8 - Time: 8017ms
    
    ** Angular Live Development Server is listening on localhost:443, open your browser on https://localhost:443/ **
    
    
    √ Compiled successfully.

**Note: **This will start a test application at https://t1.iam.lab, access https://t1.iam.lab in browser(or click here) 

Useful Information

1. This app is by default configured with well known test saml identity provider https://samltest.id/, 
2. SAML SP Configuration in config.json
3. SAML SP Metadata endpoint is https://t1.iam.lab/saml/metadata
4. Debug/Test endpoint https://t1.iam.lab/authn-handler/saml/me to check logged-in user details

