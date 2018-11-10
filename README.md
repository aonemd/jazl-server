jazl-server
---

A Nodejs server that fetches GitHub issue comments

## Installation

- Install `yarn`
- Run `yarn` to install all the dependencies
- Setup your ENV variables. Five ENV variables are needed:
  * `GH_ACCESS_TOKEN`: You can generate an access token [here](https://github.com/settings/tokens)
  * `GH_CLIENT_ID` and `GH_CLIENT_SECRET`: obtained from the app you created [here](https://github.com/settings/developers)
  * `OWNER`: GitHub username
  * `REPO`: the name of your GitHub repository
- To run the server, type `yarn serve` and open `localhost:8001` in a browser

## License

See [LICENSE](https://github.com/aonemd/jazl-server/blob/master/LICENSE).
