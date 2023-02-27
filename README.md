# Sweatshop Beats Frontend React App

This repository holds the entire user interface for the Sweatshop Beats application and is written entirely in Typescript using the React framework.

## Git conventions and contributing

If youre going to contribute code to this project, start by cloning this repository and its accompanying microservices (the backend services):

- [User service](https://github.com/mattg1243/sb-user-service)
- [Beats service](https://github.com/mattg1243/sb-beats-service)
- [API Gateway](https://github.com/mattg1243/sb-gateway)

All of these services must be run in individual terminal instances with the same `npm run devstart` command exectuded in the root of the project.
Before running these services, you must install all dependencies by running the command `npm install` in the root of all of the repositories.
_You won't be able to connect to the database or the AWS bucket containing all media files without getting the connection strings / credentials from me._
The port routing should be in place already for your `localhost` develepment servers already but the routing is as follows:

- API Gateway: this is the only service you will be directly interacting with from the frontend application and is served on port `8000`
- User Service: served on port `8080`
- Beat Service: served on port `8081`

First, pull down all changes from these repositories using `git pull origin main` in all service / frontend repository roots (I will streamline this by including all these repositories as Git sub modules in a master repository eventually), then create a new development branch with the name formatted as `{yourname}/working/{nameofchanges}`. Make all your changes on this branch and when you're done, commit your work and include messages describing what you did, push that branch to GitHub under the same name, and then open a pull request so that I can review your code before merging it into the `main` branch. Once your changes are merged, I will delete your working branch and you can do the same on your local repository as these changes are now in the `main` branch.
