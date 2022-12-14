# Northcoders News API

This repository serves to provide very basic /api functionality to present information concerning a false news application, containing users, comments, articles & topics.

Endpoints provide basic functionality as well as more dynamic options where users can refine their searches by article_id, comment_id, topic, etc. Users can also structure returned queries by using sort_by or order_by options on certain endpoints.

The base link for the hosted api is below:

    https://nc-news-acw.onrender.com

# Endpoints

The numerous endpoints are listed here:

    GET /api
    (provides an in depth list of endpoint information)
    https://nc-news-acw.onrender.com/api/

    GET /api/topics
    (provides a list of article topics with a description & slug tag)
    https://nc-news-acw.onrender.com/api/topics

    GET /api/articles
    (provides all articles associated with the api)
    https://nc-news-acw.onrender.com/api/articles

    GET /api/articles?topic=query-here
    (provides all articles associated with the given topic)
    https://nc-news-acw.onrender.com/api/articles?topic=coding

    GET /api/articles?sort_by=query-here
    (provides all articles associated with the apo sorted by the given query)
    https://nc-news-acw.onrender.com/api/articles?sort_by=author

    GET /api/articles?sort_by=query-here&order_by=query-here
    (provides all articles associated with the apo sorted by the given query & ordered by another query)
    https://nc-news-acw.onrender.com/api/articles?sort_by=author&order_by=asc

    GET /api/articles/:article_id
    (provides a specific article by article_id)
    https://nc-news-acw.onrender.com/api/articles/3

    GET /api/articles/:article_id/comments
    (provides comments for the article_id provided)
    https://nc-news-acw.onrender.com/api/articles/3/comments

    GET /api/users
    (provides the username, name & avatar url for all users)
    https://nc-news-acw.onrender.com/api/users

    POST /api/articles/:article_id/comments
    (posts a comment on the associated article)
    https://nc-news-acw.onrender.com/api/articles/3/comments

    PATCH /api/articles/:article_id
    (updates the given article & returns it)
    https://nc-news-acw.onrender.com/api/articles/3

    DELETE /api/comments/:comment_id
    (deletes the associated comment)
    https://nc-news-acw.onrender.com/api/comments/3

# Developer Setup

1. Clone the repository by copying the latest https link & typing the below command:

    ```bash
    # clone the repo
    git clone https://github.com/AliCW/AliCW-be-NC-news.git
    ```

2. Please create .env.development (& if required .env.test) files in the root of the repo so as to connect to the database. The file should contain the below information:

    .env.development - PGDATABASE=nc_news

    .env.test - PGDATABASE=nc_news_test

3. Install the npm package dependencies by running the below command in the root of the repo:

    ```bash
    # install npm dependencies
    npm install
    ```

4. You will need to populate the psql database with information by typing the below command in the root of the repo:

    ```bash
    # seeding the database
    npm run seed
    ```

5. The api was written using node.js version 19.0.0 & psql version 14.5. Installing these distributions or later (if available) is advised

# Testing

To run testing functionality, you can run the below command in the repo root to run all the tests in __tests__/


    # run all tests
    npm run test


If you want to run a specific test file, navigate into __tests__/ and specify the file in question

    # run all tests
    cd __tests__/
    npm test api-endpoints.test.js

