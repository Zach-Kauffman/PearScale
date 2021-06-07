# Assignment 4

**Assignment due at 11:59pm on Tuesday 6/1/2021**<br/>
**Demo due by 5:00pm on Friday 6/11/2021**

The goal of this assignment is to incorporate file storage into our API and to start using RabbitMQ to do some basic offline processing.  There are a few parts to this assignment, as described below.

You are provided some starter code in this repository that uses MongoDB as a backing to implement a reduced subset of the businesses API we've been working with all term.  The starter code's API server is implemented in `server.js`, individual routes are modularized within the `api/` directory, and models for different resources are implemented in the `models/` directory.  There is also an OpenAPI specification in `public/openapi.yaml` that describes the endpoints and resources associated with this API, including the new endpoints you'll have to implement for this assignment.

In addition, there is a Docker Compose specification for the assignment included in `docker-compose.yml`, along with database initialization scripts in `db-init/`.   For most users, this code should run out of the box with Docker Compose (it will use the environment variable values specified in the file `.env` by default).  Note that the Docker Compose specification is provided for your convenience, so if it's not a convenience for you to use Docker Compose, feel free to disregard this specification.  In particular, if you're not able to get the application up and running easily using Docker Compose, feel free to manually launch a container running a MongoDB server and to initialize the application database manually.  The only crucial thing that needs to be done when initializing a new database is the creation of a new, lower-privileged user, but you can also use some of the initial business data from `db-init/01-db-init.js` as well, if you like (e.g. by copying and pasting into a MongoDB shell).

## 1. Support photo file uploads

Your first task for the assignment is to modify the `POST /photos` endpoint to support actual photo uploads.  Specifically, you should update this endpoint to expect a multipart form-data body that contains a `file` field in addition to the fields currently supported by the endpoint (`businessid` and `caption`).  In requests to this endpoint, the `file` field should specifically contain raw binary data for an image file.  The endpoint should accept images in either the JPEG (`image/jpeg`) or PNG (`image/PNG`) format.  Files in any other format should result in the API server returning an error response.

## 2. Store uploaded photo data in GridFS

Once your API successfully accepts image file uploads to the `POST /photos` endpoint, you should modify the API to store those image files in GridFS in the MongoDB database that's already powering the API.  Photo metadata corresponding the image files (i.e. `businessid` and `caption`) should be stored alongside the files themselves.

Once your API is storing photo data in GridFS, it should no longer use the `photos` MongoDB collection in which it currently stores photo metadata.  In other words, all data related to the `photos` collection should be stored in GridFS.  This will require you to update other API endpoints to work with the data stored in GridFS, including:
  * `GET /businesses/{id}`
  * `GET /photos/{id}`

## 3. Use RabbitMQ to generate new image sizes offline

Your next task in the assignment is to use RabbitMQ to facilitate the generation of multiple resized versions of every image.  This should happen offline (i.e. outside the normal API request/response cycle).  This task can be broken into a few separate steps:

  * **Start a RabbitMQ daemon running in a Docker container.**  You can do this with the [official RabbitMQ Docker image](https://hub.docker.com/_/rabbitmq/).

  * **Turn your API server into a RabbitMQ producer.**  Specifically, each time a new photo is uploaded and stored into your GridFS database, your API server should add a new task to a RabbitMQ queue corresponding to the new photo that was just uploaded.  The task should contain information (e.g. the ID of the just-uploaded photo) that will eventually allow RabbitMQ consumers (which you'll write) to fetch the original image file out of GridFS.

  * **Implement a RabbitMQ consumer that generates multiple sizes for a given image.**  Your consumer should specifically use information from each message it processes to fetch a newly-uploaded photo file from GridFS and generate multiple smaller, resized versions of that photo file.  Specifically, all of the following sizes should be generated for each photo:
      * Maximum side (height or width) 1024px
      * Maximum side (height or width) 640px
      * Maximum side (height or width) 256px
      * Maximum side (height or width) 128px

    All resized versions of the photo should be in JPEG format (i.e. `image/jpeg`).  If the original image file is in PNG format, you should also generate a JPEG version of the image with the same dimensions as the original photo.  You should not generate resized images that are *larger* than the original photo.  For example, if the maximum side (height or width) of an original image is 512px, you should only generate the 256px and 128px sizes for it, not the 640px and 1024px sizes.

    All resized images should be stored in GridFS and linked to the original image entry in GridFS.  In other words, you should be able to "find" all of the available sizes for a given image by looking up the original image in the database.  For example, you can add a field to the original image document's metadata indicating all available sizes for that photo and the IDs of the corresponding files in GridFS, e.g.:
    ```
    {
      "640": ObjectId("5ce48a2ddf60d448aed2b1c3"),
      "256": ObjectId("5ce48a2ddf60d448aed2b1c5"),
      "128": ObjectId("5ce48a2ddf60d448aed2b1c7"),
      "orig": ObjectId("5ce48a2ddf60d448aed2b1c9")
    }
    ```

    There are multiple packages on NPM you can use to actually perform the image resizing itself, including [Jimp](https://www.npmjs.com/package/jimp) and [sharp](https://www.npmjs.com/package/sharp).  Each of these has a straightforward interface.  However, you're free to use whatever tool you like to perform the resizing.  You may even write your consumer in a different programming language (e.g. Python) if you prefer.

    When your consumer is working correctly, you should be able to launch one or more instances of the consumer running alongside your API server, the RabbitMQ daemon, and the MongoDB server, and you should be able to see the consumers processing photos as they're uploaded.  Note that only the RabbitMQ daemon and the MongoDB server need to be run within Docker containers.  The API server and RabbitMQ consumer(s) can run either in Docker or directly on your host machine.

## 4. Make all sizes for each photo available for download

Once all of the resized images are saved in GridFS, you should make them available for download via a URL with the following format, where `{id}` represents the ID of the original image and `{size}` represents the requested size:
```
/media/photos/{id}-{size}.jpg
```
Specifically, you should modify the `GET /photos/{id}` endpoint to include URLs for all available sizes for the image in the `urls` field of the response sent back to the client.  The `urls` field should have a URL for each size available for the image, e.g.:
```
{
  "640": "/media/photos/5ce48a2ddf60d448aed2b1c1-640.jpg",
  "256": "/media/photos/5ce48a2ddf60d448aed2b1c1-256.jpg",
  "128": "/media/photos/5ce48a2ddf60d448aed2b1c1-128.jpg",
  "orig": "/media/photos/5ce48a2ddf60d448aed2b1c1-orig.jpg"
}
```
Then, you should add a new `GET /media/photos/{id}-{size}.jpg` API endpoint to allow image downloads.  This endpoint should respond with the content of the image file corresponding to `{id}` and `{size}`.  If either the requested ID or the requested size is invalid, the endpoint should respond with a 404 error.

## Submission

We'll be using GitHub Classroom for this assignment, and you will submit your assignment via GitHub.  Just make sure your completed files are committed and pushed by the assignment's deadline to the master branch of the GitHub repo that was created for you by GitHub Classroom.  A good way to check whether your files are safely submitted is to look at the master branch your assignment repo on the github.com website (i.e. https://github.com/osu-cs493-sp21/assignment-4-YourGitHubUsername/). If your changes show up there, you can consider your files submitted.

## Grading criteria

This assignment is worth 100 total points, broken down as follows:

  * 20 points: API supports image uploads

  * 20 points: Uploaded images are stored in GridFS

  * 40 points: API uses RabbitMQ to resize images offline

  * 20 points: All resized images are made available for download.
