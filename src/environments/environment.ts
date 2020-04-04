// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  API_ENDPOINT: 'http://localhost:51721/',
  REFRESH_SECONDS: '4',
  DAYSBACK_DEFAULT: 30,
  //API_ENDPOINT: 'http://onepluswonder.com/scrapeAPI/'
  HELP_TEXT: `eBay requires that you obtain API keys which lets eBay identify who is searching their database.
They are free and easy to acquire.  Follow this link: https://developer.ebay.com/join/

Click Register and create a user name and password and provide an email address.
Accept the terms and cick Join.
You will be asked to provide a name for the Application - you can use anything, such as, 'My App'.
On the right part of the page under Production you see 'Create a keyset'.  Click that.
You will enter your contact information for identification.  Then click Continue.
You should then see your keys: App ID, Dev ID and Cert ID.
(Don't worry about the left part of the page that says Sandbox.)

You also need a user token.  Click next to your App ID where it says 'User Tokens'
Make sure Auth'n'Auth is selected and then click the blue button, 'Sign in to Production'.
Remember, this is your eBay account, not the API developer account you just created.
Agree to terms, and the next page will display your token at the bottom of the page.
It's a very long string of characters.

Then back on this website, click 'Set API Keys' page under the Options menu, 
enter the 3 keys and the token and click OK.

If the keys are not entered correctly, you will continue to get 'No results matching search
  criteria.' when searching.

Email support at: onepluswonder@gmail.com
`
};
