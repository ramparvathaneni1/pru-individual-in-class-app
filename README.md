# Pru Individual In Class App

This repo is used for you to work on your personal app after we work on each section of the Todo App together in class.

Based on the Todo API we built together you’ll build a brand new app with a model you choose (e.g. - recipe, movie, comic, song).

Requirements
- The database table must have at least 3 columns/fields
- Your API must have full CRUD (5 API endpoints: Create, Read (many/one), Update, Delete)
- Create a Postman Collection to test the 5 API endpoints

Node Express Code Along For Reference: https://ga.co/48sBleZ


## To get started

1. In your VM, open your Terminal and change into your Documents folder: `cd ~/mef`.

1. Fork this repo to your personal GitHub Enterprise account.

1. Clone down your fork using the SSH URL option: `git clone git@git.generalassemb.ly:<THIS_SHOULD_BE_YOUR_USERNAME>/pru-individual-in-class-app.git`.

1. `cd` into the `pru-individual-in-class-app` folder. Inside it, create a new folder: `mkdir backend`. Please start your app in the `backend` folder.

[Here is today's Express To Do API lesson for reference.](https://git.generalassemb.ly/ModernEngineering/express-to-do-api)

You can start at Step 4 under **Todo App Set-up**

NOTE - you do not need to do the **Configure Postgres in the VM** section again.

## To submit your work each day

1. Commit and push your work to GitHub
1. Submit a Pull Request

## Stretch Goal 1

Update your index route to accept query parameters that will make fields filterable and searchable. 

Example: `/movies?title=titanic` would leverage the title query parameter and modify its SQL statement to return results where the title is equal to "titanic"

## Stretch Goal 2

Create a second SQL table for users with associated routes in your application, and add a foreign key relating to your first SQL table. 

The detail route retrieving an individual record should be updated to include all related data using JOIN statements.
