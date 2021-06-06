##CS 493 Final Project
Code due at the time of your final project grading demo
(grading demos will occur during finals week; more details TBA)
In this course, a final programming project will take the place of formal exams to test your understanding of the material.  The final project will involve working with a team of 3-4 people to implement a complete RESTful API based on the data needs of a real application of your choice.  The API you implement will need to utilize most the components of a modern API that we cover in class.  You can find more details below.
Write an API based on a real application
For this project, your goal will be to implement an API based on a real application.  Specifically, you and your team should select any real, existing cloud-based web/mobile application of your choice (e.g. Twitter, Gmail, Instagram, Spotify, Canvas, WeatherUnderground, etc.).  Once you select an application, your job will be to design and implement a RESTful API that stores and provides the data you believe your selected application uses from its own actual API.

Of course, many existing web/mobile applications require extensive data.  Rest assured that you don’t need to implement the entire Facebook API for this project.  Pick a meaningful and cohesive subset of your chosen application and implement an API to power that subset.  For example, if your chosen application is Instagram, you might implement an API that allows users to log in, post photos, view photos, make comments and/or like photos, and search for photos based on caption text, hashtag, etc.  Use the requirements listed below to help guide you to pick an appropriately-sized subset of your chosen application.
API Requirements
The API you implement must satisfy the following requirements:

Your API must store structured data in a database of your choice.
Your API must store user credentials and allow users to authenticate themselves.
In addition to users, your API must store at least three different types of entity.  Each entity type must have a relationship to at least one of the other entity types.  For example, a Playlist entity might contain many Song entities.
Your API must store file/blob data.
Clients should be able to create and access all of your entity types via your API.  At least one of your entity types must also be modifiable via your API, and at least one must be deletable via your API.
Your API should implement pagination and HATEOAS when appropriate.
Your API should require authorization on appropriate endpoints, e.g. ones that allow users to create, modify, or delete data, or endpoints that allow access to sensitive data.
Your API should be rate limited.  Anonymous users (i.e. unauthenticated users) should be allowed to make fewer requests per unit time than authenticated users.
Your API must implement at least one feature that isn’t covered in class this term.  See below for some ideas of possible features you could implement.
All services used by your API (e.g. database, Redis, RabbitMQ, etc.) should be run within Docker containers.

Within these boundaries, there are many, many apps for which you could implement an API.  I encourage you to choose an app you use frequently, so you’re familiar with it and have a good understanding of the kinds of data it uses.
Ideas for features not covered in class
The course website should give you an idea of what topics we’ll cover in class for the remainder of this term.  Here are some ideas about the kinds of features you might implement that aren’t going to be covered in class:


Your new feature could add new functionality to the API.  For example, you could:
Add the ability to stream audio/video files (not just media file downloads but actual streaming).
Support full-text search of your application data, e.g. using Elasticsearch or Solr.
Add a “live” data component to your API using standard WebSockets or Socket.IO.


Or, your new feature could be architectural.  For example, you could:
Implement your entire API with GraphQL (this is OK, even though we’ll cover GraphQL in class).
Perform load balancing to multiple API servers using NGINX.
Implement your API using a microservices architecture.  This could involve using RabbitMQ or Apache Kafka as a message broker between services.

These are just a few possibilities, but they should hopefully give you an idea of what you could do.  Feel free to run any ideas you might have by me (Hess) for feedback.
New tech, 3rd-party libraries, and other tools
You may treat the final project as an opportunity to learn how to use API backend technologies we didn’t cover in class.  Specifically, if there’s a database implementation, third-party tool or library, etc. you want to use for the project, feel free to do so.
GitHub repositories
The code for your final project must be in a GitHub repository set up via GitHub Classroom.  You can use this link to form your team and create your final project repository:

https://classroom.github.com/g/6Wm12we6

The repository created for your team will be private by default.    However, you will have full administrative control over the repository that’s created for your project, which means you’ll be able to make it public if you wish.  I encourage you to make your repo public.  These final projects should be nice demonstrations of your development abilities and will be a good item to have in your CS portfolio.  It will be great to have the code in a public GitHub repo so you can share it easily when you want to.

If you’ve already started a GitHub repo for your project, don’t worry.  The repository created via the GitHub classroom link above will be completely empty, so you can simply use git remotes to work with both repositories.  I can help you set that up if needed.
Working with a team on a shared GitHub repo
When working with a team on a shared GitHub repo, it’s a good idea to use a workflow that uses branches and pull requests.  This has a few advantages:

By not working within the same branch, you can better avoid causing conflicts, which can occur when you and another member of your team edit the same parts of the code at the same time.
It helps you to be more familiar with the entire code base, even the parts that other team members are working on, because you’ll see all of the changes to the code as you review pull requests.  This can help you develop more rapidly because you won’t have to spend as much time understanding code that others have written.
It helps to ensure high quality code.  Code in pull requests is not incorporated into the master code branch until the code request is reviewed and approved.  That means everyone has a chance to improve pull request code before it becomes permanent.

One simple but effective branch- and pull-request-based workflow you might consider is the GitHub flow: https://guides.github.com/introduction/flow/.
Grading demonstrations
To get a grade for your project, your team must do a brief (10-15 minute) demonstration to me (Hess) of your project’s functionality.  These demos will be scheduled for finals week.  I’ll send more details on scheduling demos for the final project when we get closer to that time.

Note that you should have a set of requests/tests written and ready to go when you arrive at your demo.  These tests should fully demonstrate your API’s functionality.  You are free to use Postman, Insomnia, or any other API testing tool you like to implement these tests.  Having these tests ready to go at your demo will comprise part of your grade for this project.
Code submission
All code for your final project must be pushed to the main branch of the repo created for your team using the GitHub Classroom link above before your grading demo.  Please note that if you’d like to keep your own copy of your final project code, you should fork your team’s project repository at the end of the course, since the GitHub organization for our course may eventually be deleted, along with all of the repositories stored there.
Grading criteria
Your team’s grade (out of 100 points) will be computed based on the following criteria:
50 points – Your API satisfies the requirements listed on the first page of this document.
20 points – Your API has a high-quality design and implementation.
For example, your app is free of bugs and has an effective API design.
20 points – Your API is creative and original.
If, for example, your app is simply a repackaging of the app we develop together during lecture or the one you developed during your assignments this term, you will likely not score highly in this category.
10 points – You have a complete set of tests/requests pre-written and ready to use at your final project grading demo.

Remember, also, that if your team does not do a demo for your project, you will receive a zero for it.
Individual grades
Your individual grade for the project will be based on your team’s grade and also on evidence of your meaningful participation in your team’s work on the project, including from these sources:

The commit log of your GitHub repository.
Your presence at and participation in your team’s project demo.
A team evaluation completed by each member of your project team.

In particular, if your GitHub commit log shows that you did not make meaningful contributions to your team’s implementation of your app, if you do not participate in your team’s demonstration of your app (without explicit prior approval by me), or if your project teammates submit team evaluations in which they agrees that you did not do an appropriate share of the work on your final project, you will receive a lower grade on the project than your teammates.  I may use other sources as evidence of your participation, as well.
