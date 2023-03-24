const apiEndpoints = () => {
  const endpoints = {
    GET: [
      {
        "/api": {
          path: "GET /api",
          description: "lists all the available endpoints for the api",
          queries: [],
        },
      },
      {
        "/api/topics": {
          path: "GET /api/topics",
          description:
            "lists article topics basic description & description slug tag",
          queries: [],
          example: `slug: "football"
            description: "FOOTIE!"`,
        },
      },
      {
        "/api/articles?": {
          path: "GET /api/articles",
          description: `lists the articles available in the api, will list all vby default.
            accepts queries to refine searching`,
          queries: ["topic", "sort_by", "order_by"],
          exampleQuery: [
            "/api/articles?topic=coding",
            "/api/articles?sort_by=author",
            "/api/articles?sort_by=article_id&order_by=asc",
          ],
          example: {
            author: "tickle122",
            title: "The battle for Node.js security has only begun",
            article_id: 0,
            topic: "coding",
            created_at: "2020-11-15T13:25:00.000Z",
            votes: 0,
            comments_count: 7,

            author: "grumpy19",
            title: "title of the thing",
            article_id: 1,
            topic: "stuff",
            created_at: "2022-11-15T13:25:35.000Z",
            votes: 1,
            comments_count: 0,

            author: "mrcomment456",
            title: "right here, right now?",
            article_id: 2,
            topic: "coding",
            created_at: "2014-11-15T13:23:53.000Z",
            votes: 0,
            comments_count: 8,
          },
        },
      },
      {
        "/api/articles/:article_id": {
          path: "GET /api/articles/:article_id",
          description: "lists a specific article by its id",
          queries: [5, 2],
          exampleQuery: "/api/articles/2",
          example: {
            author: "mrcomment456",
            title: "right here, right now?",
            article_id: 2,
            topic: "coding",
            created_at: "2014-11-15T13:23:53.000Z",
            votes: 0,
            comments_count: 8,
          },
        },
      },
      {
        "/api/articles/:article_id/comments": {
          path: "GET /api/articles/:article_id/comments",
          description:
            "lists all comments for the associated article_id provided",
          queries: [5, 2],
          exampleQuery: "/api/articles/3/comments",
          example: {
            comment_id: 145,
            votes: 10,
            created_at: "2020-10-03T14:18:00.000Z",
            author: "jessjelly",
            body: "Odit aut error. Occaecati et qui. Quam nam aut dolorem.",

            comment_id: 354,
            votes: 0,
            created_at: "2022-10-03T14:18:00.000Z",
            author: "mrcomment456",
            body: "this is a comment",
          },
        },
      },
      {
        "/api/users": {
          path: "GET /api/users",
          description: "lists the username, name & avartar URL of all users",
          queries: [],
          example: {
            username: "jessjelly",
            name: "Jess Jelly",
            avatar_url:
              "https://vignette.wikia.nocookie.net/mrmen/images/4/4f/MR_JELLY_4A.jpg/revision/latest?cb=20180104121141",

            username: "mrcomment456",
            name: "Mr Comment",
            avatar_url: "https://exampleurl.net/img/12515474515148485415212",
          },
        },
      },
      {
        "/api/users/:username": {
          path: "GET /api/users/:username",
          description:
            "lists the username, name & avatar URL of the specified user",
          queries: [],
          example: {
            username: "mrcomment456",
            name: "Mr Comment",
            avatar_url: "https://exampleurl.net/img/12515474515148485415212",
          },
        },
      },
      {
        "/api/articles?": {
          path: "GET /api/articles?p=<number>",
          description: "allows for pagination when viewing article lists",
          queries: [1, 4],
          exampleQuery: [
            "/api/articles?p=1",
            "/api/articles?p=4"
          ],
          example: {
            author: 'icellusedkars',
            title: 'Does Mitch predate civilisation?',
            article_id: 8,
            topic: 'mitch',
            created_at: '2020-04-17T01:08:00.000Z',
            votes: 0,
            comments_count: '0'
          }
        },
      },
      {
      "/api/articles/:article_id/comments?": {
        path: "GET /api/articles/:article_id/comments?p=<number>",
        description: "allows for pagination when viewing comment lists on single article pages",
        queries: [1, 3],
        exampleQuery: [
          "/api/articles/:article_id/comments?p=1",
          "/api/articles/:article_id/comments?p=3",
        ],
        example: {
          comment_id: 9,
          votes: 0,
          created_at: '2020-01-01T03:08:00.000Z',
          author: 'icellusedkars',
          body: 'Superficially charming'
        },
        },
      },
    ],
    POST: [
      {
        "/api/articles/:articles_id/comments": {
          path: "POST /api/articles/:article_id/comments",
          description: `posts a comment on the associated article_id provided & responds with the inputted username & comment,
            user must provide username & body for comment input`,
          queries: [2, 4],
          exampleQuery: "/api/articles/2/comments",
          examplePost: {
            username: "mrcomment456",
            body: "this is a comment somehow",
          },
          example: {
            username: "mrcomment456",
            body: "this is a comment somehow",
            comment_id: 1234
          },
        },
      },
        {
          "/api/users/signup": {
          path: "POST /api/users/signup",
          description: `allows users to sign up to the website, username, name, password, email & avatar_url fields are accepted.
            passwords are hashed & not stored on any server`,
          queries: [],
          examplePost: {
            username: "cbeachdude",
            name: "chris_hansen",
            password: "l.Armstr0ng",
            email: "chris_hansen@gmail.com",
            avatar_url: "https://e7.pngegg.com/pngimages/369/132/png-clipart-man-in-black-suit-jacket-chris-hansen-to-catch-a-predator-television-show-nbc-news-chris-benoit-miscellaneous-television.png"
          },
          example: {
            username: "cbeachdude",
            name: "chris_hansen",
            password: "$2b$10$XOdxIsMox0SJRIhF0AyqG.StyvhDvssLALjiTTH8knPXeoq/EtQMu",
            email: "chris_hansen@gmail.com",
            avatar_url: "https://e7.pngegg.com/pngimages/369/132/png-clipart-man-in-black-suit-jacket-chris-hansen-to-catch-a-predator-television-show-nbc-news-chris-benoit-miscellaneous-television.png"
          },
        },
      },
        {
          "/api/users/login": {
            path: "POST /api/users/login",
            description: `allows users to login to their account, SQL hash is compared to password provided by the user`,
            queries: [],
            examplePost: {
              username: "cbeachdude",
              password: "l.Armstr0ng",
            },
            example: true || false,
          }
        },
        {
          "/api/articles": {
            path: "POST /api/articles",
            description: `allows users to create articles, requires existing username & topics for creation`,
            queries: [],
            examplePost: {
              username: "cbeachdude",
              title: "Riverside, California",
              body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
              topic: "coding",
            },
            example: {
              author: "cbeachdude",
              title: "Riverside, California",
              body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
              topic: "coding",
              created_at: "2023-03-09T01:17:16.880Z",
              votes: 0,
              comment_count: "0",
            },
          },
        },
        {
          "/api/topics": {
            path: "POST /api/topics",
            description: "allows users to add new topics, slug name is checked on the backend for conflicts",
            queries: [],
            examplePost: {
              description: "Chris Hansen with Dateline NBC",
              slug: "TCAP",
            },
            example: {
              description: "Chris Hansen with Dateline NBC",
              slug: "TCAP",
            },
          },
        },
    ],
    PATCH: [
      {
        "/api/articles/:article_id": {
          path: "PATCH /api/articles/:article_id",
          description:
            "Updates the linked article votes & returns said article",
          queries: [2, 3],
          exampleQuery: "/api/articles/3",
          examplePatch: {
            inv_votes: 12,
          },
          example: {
            article_id: 3,
            title: "example title",
            topic: "stuff",
            author: "mrcomment456",
            body: "this is a comment",
            created_at: "2022-10-03T14:18:00.000Z",
            votes: 12,
          },
        },
      },
      {
        "/api/comments/:comment_id": {
          path: "PATCH /api/comments/:comment_id",
          description: "Updates the linked comments votes & returns said comment",
          queries: [2, 3],
          exampleQuery: "/api/comments/2",
          examplePatch: {
            inv_votes: 12
          },
          example: {
            body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
            votes: 12,
            author: "butter_bridge",
            article_id: 9,
            created_at: 1586179020000,
          }
        }
      },
    ],
    DELETE: [
      {
        "/api/comments/:comment_id": {
          path: "DELETE /api/comments/:comment_id",
          description: "Deletes comment by comment_id",
          queries: [2, 4],
          exampleQuery: "/api/comments/4",
          example: "204 - No Content",
        },
      },
      {
        "/api/articles/:article_id": {
          path: "DELETE /api/articles/:article_id",
          description: "Deletes articles by article_id",
          queries: [2, 4],
          exampleQuery: "/api/articles/4",
          example: "204 - No Content",
        },
      },
    ],
  };
  return endpoints;
};

module.exports = { apiEndpoints };
