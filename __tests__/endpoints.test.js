const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const db = require("../db/connection");
const endPoints = require('../endpoints.json');
const sorted = require('jest-sorted');


beforeEach(() => {
    return seed(data);
  });
  
  afterAll(() => {
    return db.end();
  });
  
  
  describe("api/topics", () => {
      test("status check responds 200 amd their are the sorrect keys in topics array and correct length", () => {
        return request(app)
        .get("/api/topics")
        .expect(200)
    .then(({body}) => {
            const {topics} = body
             expect(topics).toHaveLength(3);
             topics.forEach((topic) => {
                 expect(topic).toMatchObject({
                     description: expect.any(String),
                     slug: expect.any(String),
                 });
    });
});
});
    test("check error message is correct when making a request that doesn't exist", () =>{
    return request(app)
    .get("/api/banana")
    .expect(404)
    .then(({body}) => {
        expect(body.msg).toBe("Not Found")
    });
});
});

describe("GET /api", () => {
    test("get status code 200 and the json we recieve from link is same as endpoints.json file", () => {
        return request(app)
        .get("/api")
        .expect(200)
        .then((body) => {
            const jsonEndpoints = body.body.endPoints
            expect(jsonEndpoints).toEqual(endPoints)
        })
    })
})

describe("GET /api/articles/:article_id", () => {
    test("200: and an article object with the correct properties", () => {
        return request(app)
        .get("/api/articles/2")
        .expect(200)
        .then(({body}) => {
        
            const article = body
            expect(article).toMatchObject({
                author: expect.any(String),
                title: expect.any(String),
                article_id: expect.any(Number),
                body: expect.any(String),
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                article_img_url: expect.any(String) 
            })     
            });
        })
    test("404: Not Found when article number doesn't exist", () => {
        return request(app)
        .get("/api/articles/32")
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe("Not Found")
        })
    })
    test("400: Bad request when given invalid article ID", () => {
        return request(app)
        .get("/api/articles/banana")
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe("Bad Request")
        })
    })
})

describe("/api/articles", () => {
    test("200: returns object with all the articles", () => {
        return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({body}) => {
            const articles = body.body
            const size = Object.keys(articles[0]).length;
            expect(size).toBe(8)
            articles.forEach((article) => {
                expect(article).toMatchObject({
                    author: expect.any(String),
                    title: expect.any(String),
                    article_id: expect.any(Number),
                    topic: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    article_img_url: expect.any(String),
                    comment_count: expect.any(Number)
                })
            })
        })
    })
    test("articles appear in descending order", () => {
        return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({body}) => {
            const articles = body.body
            expect(articles).toBeSortedBy('article_id', {
                descending: true,
              });
        })
    })
    
})

describe("/api/articles/:article_id/comments", () => {
    test("200: returns with and array of comments with correct keys for article with specific ID", () => {
        return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({body}) => {
            const comments = body.comments
            const size = Object.keys(comments).length;
            expect(size).toBe(11)
            comments.forEach((comment) => {
                expect(comment).toMatchObject({
                    comment_id: expect.any(Number),
                    article_id: expect.any(Number),
                    body: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    author: expect.any(String),
                })
            })
        })
    })
    test("articles appear in descending order", () => {
        return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({body}) => {
            const comments = body.comments
            expect(comments).toBeSortedBy('comment_id', {
                descending: true,
              });
        })
    })
    test("404: check error message is correct when article number doesn't exist", () =>{
        return request(app)
        .get("/api/articles/33/comments ")
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe("Not Found")
        });
    });
    test("400: Bad request when given invalid article ID", () => {
        return request(app)
        .get("/api/articles/banana/comments")
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe("Bad Request")
        });
    });
    test("404: Not Found, when requesting comments on article with no comments", () => {
        return request(app)
        .get("/api/articles/2/comments")
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe("No Comments For This Article")
        })
    })

})