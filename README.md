# Lighthouse-test

You can run several lighthouse tests and easily get the average of them!

## How to execute the project
You can run this project with the following commands
`$ npm i`
`$ node main.js [urlToTest] [numberOfRuns] [formFactor]`

`urlToTest` is the only mandatory parameter, the rest of them are optional. By default `numberOfRuns` is `10` and formFactor is `mobile`

## Run a new Test
To set the URL that you want to test, you should set it in the first parameter of the function `lighthouse`. You can also change the constant `number_of_runs` to set the number of executions that you want to run for the LH test.
