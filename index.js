const express    = require('express');
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()
const graphql    = require('graphql.js')

const app          = express();
const access_token = process.env.GH_ACCESS_TOKEN
const owner        = process.env.OWNER
const repo         = process.env.REPO

app.set('port', (process.env.PORT || 8001));

app.get('/', (req, res) => res.send('Hello World!'))
app.get('/issues/:number/comments', (req, res) => {
  let graph = graphql("https://api.github.com/graphql", {
    asJSON: true,
    headers: {
      "Authorization": `Bearer ${access_token}`,
      "User-Agent": `${repo}`
    }
  })

  graph(`
query ($owner: String!, $repo: String!, $issue: Int!) {
  repository(owner: $owner, name: $repo) {
    issue(number: $issue) {
      url
      comments(first: 100) {
        edges {
          node {
            body
            createdAt
            author {
              login
              avatarUrl
              url
            }
          }
        }
      }
    }
  }
}`,
    {
      owner: owner,
      repo: repo,
      issue: parseInt(req.params.number)
    }).then(function (result) {
      res.header("Access-Control-Allow-Origin", "*")
      res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE")
      res.header("Access-Control-Allow-Headers", "Content-Type, Authorization")
      res.status(200)
      res.json(result)
    }, function (err) {
      res.status(403)
      res.json(err)
    });
})

app.post('/issues/:number/comments', jsonParser, (req, res) => {
  let graph = graphql("https://api.github.com/graphql", {
    asJSON: true,
    headers: {
      "Authorization": `Bearer ${access_token}`,
      "User-Agent": `${repo}`
    }
  })
  let comment_content = req.body.content;

  graph(
    `
    query ($owner: String!, $repo: String!, $issue: Int!) {
      repository(owner: $owner, name: $repo) {
        issue(number: $issue) {
          id
        }
      }
    }
    `
    ,
    {
      owner: owner,
      repo: repo,
      issue: parseInt(req.params.number)
    }).then(function (result) {
      issue_id = result.repository.issue.id;

      graph(
        `
        mutation ($input: AddCommentInput!) {
          addComment(input: $input) {
            clientMutationId
          }
        }
        `,
        {
          "input": {
            "clientMutationId": "12345",
            "subjectId": issue_id,
            "body": comment_content
          }
        }
      ).then (function(result) {
        res.status(200);
        res.json(result)
      },
        function(err) {
          res.status(403)
          res.json(err)
        }
      )
    })
});

app.listen(app.get('port'), () => console.log(`App listening on port ${app.get('port')}`))
