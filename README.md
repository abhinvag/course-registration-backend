# Endpoints

## Student

| Type |          Route          |                    Path Parameters                     |                             Description                             |
| :--: | :---------------------: | :----------------------------------------------------: | :-----------------------------------------------------------------: |
| GET  |      /student/list      |                           -                            |                Get all the entries in student table                 |
| POST |    /student/register    | userId, name, joining_year, Student_DOB, Branch, passw |                       Register a new student                        |
| POST |     /student/verify     |                     userId, passw                      |                    Verify password for a student                    |
| POST | /student/updatePassword |                userId, passw, newpassw                 |      update password with new password using existing password      |
| POST | /student/resetPassword  |                         userId                         | New password is created and mailed to user using which he can login |

## Admin

| Type |      Route      |     Path Parameters      |            Description             |
| :--: | :-------------: | :----------------------: | :--------------------------------: |
| GET  |   /admin/list   |            -             | Get all the entries in admin table |
| POST | /admin/register | userId, name, DOB, passw |        Register a new admin        |
| POST |  /admin/verify  |      userId, passw       |    Verify password for a admin     |

## Course

| Type |               Route               |             Path Parameters             |                                       Description                                        |
| :--: | :-------------------------------: | :-------------------------------------: | :--------------------------------------------------------------------------------------: |
| GET  |           /course/list            |                    -                    |                           Get all the entries in course table                            |
| POST |       /course/addNewCourse        |  course_id, coursename, type, credits   |                              Add New course in course table                              |
| POST |       /course/updateCourse        |  course_id, coursename, type, credits   |                          Update Exisitng course in course table                          |
| POST |       /course/deleteCourse        |                course_id                | Delete all entries of course_id from courseEnrollment, availableCourses and course table |
| POST |    /course/addAvailableCourse     | course_id, semester, branch, totalSeats |               Add new availibility for a course in availableCourses tables               |
| POST |   /course/updateAvailableCourse   | course_id, semester, branch, totalSeats |               Update availibility for a course in availableCourses tables                |
| POST |  /course/decreaseAvailableSeats   |                course_id                |                   Decreases seats available in a course by 1 if not 0                    |
| POST |   /course/deleteAvailableCourse   |                course_id                |               Delete availibility for a course in availableCourses tables                |
| POST |    /course/courseAvailibility     |                course_id                |                  Get all different availibility for a particular course                  |
| POST |   /course/availableCoursesInSem   |                semester                 |                              Get all courses in a semester                               |
| POST | /course/availableCoursesForBranch |                 branch                  |                               Get all courses for a branch                               |

---

# How to Run Locally

```
npm install
npm run dev
```

## Env Variable

```
PG_USER=''
PG_PASSWORD=''
PG_HOST=localhost
PG_PORT=5432
PG_DATABASE=''
DATABASE_URL=''
MAIL_USERNAME=''
MAIL_PASSWORD=''
OAUTH_CLIENTID=''
OAUTH_CLIENT_SECRET=''
OAUTH_REFRESH_TOKEN=''
```

---

# Tech Used

- NodeJs
- ExpressJs
- PostgreSQL
