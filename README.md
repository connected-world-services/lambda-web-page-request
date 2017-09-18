Trigger Web Page Requests with AWS Lambda
=========================================

Use an AWS Lambda to send an HTTP request to a destination.


Create a Lambda
---------------

First, check out the repository and use this command to create a `.zip` file to upload to AWS Lambda.

    npm run package-for-deploy

While creating the Lambda, you should probably go to the Advanced settings and change the maximum timeout. Web pages sometimes need more than the 3 seconds that are allocated by default.


Triggering the Lambda
---------------------

Use AWS CloudWatch and create a new event rule. Select the "cron" option and describe the schedule you want for how often a web page will get hit. For example, every day at 3 AM UTC would look like this:

    0 3 * * ? *

While customizing the event, select "Configure input" and select "Constant (JSON text)". The JSON is where you configure this Lambda to issue a web page request. Here is an example:

    {
        "dryRun": true,
        "method": "GET",
        "password": "There is no spoon.",
        "urlTemplate": "http://example.com/hitcounter?{YYYY}-{MM}-{DD}",
        "username": "Neo"
    }

This will issue a "GET" request to the `example.com` address. The `urlTemplate` can inject values from the current date/time into the URL. See [`date.format`](https://www.npmjs.com/package/date.format) for more details.

Enabling `dryRun` will log messages to output but will not issue the web page request.

If you want multiple web pages retrieved or if you want a more complex schedule, simply set up more CloudWatch triggers with custom data.


Logging
-------

The script writes output to the logs. Make sure to set up a policy to clean up the logs after an amount of time. The entire response body is also logged, which could be large.


License
-------

This is released under a modified [MIT-style license](LICENSE.md).
