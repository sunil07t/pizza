## About
This mini Project uses Next.js, React, Next-auth, Typescript, MongoDB. The App allows:  
- Users to log in with Gmail or use Magic Link with their email address (extra)
- To create a Pizza with a name and Ingredients and save it under their user account
- To delete a Pizza
- To list all the Pizzas that they have saved and not deleted yet

## Running Locally
To run it locally 
After cloning the repo - run:  
- npm i
- npm run dev
Create the env variables used in the app (or ask the author)

## Imporvements
The App uses minimal and simple UI/UX to show the functionality - the UI/UX can be improved much more
### More testing - testing strategies below:
Unit Testing
- Write tests for each function in the API, ensuring they handle expected and edge case inputs correctly.
- Ensure components render correctly with given props and user events are handled as expected.

Integration Testing
- Test API routes to ensure they interact correctly with the database.
- Test front-end components interact correctly with the API (e.g., form submissions, data fetching).

Most end-to-end manual testing was done - allowing more team members to do it 

Performance Testing
- Test load capacity of the server by simulating multiple users.
- Check response times and system behavior under load.

Security Testing
- Perform vulnerability scanning to detect security flaws.
- Test for common security threats like SQL Injection, XSS, and CSRF.

Usability Testing
- Conduct user testing sessions to gather feedback on UI/UX.
- Analyze user interactions for any UX improvement areas.

