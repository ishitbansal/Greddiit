# Greddiit

<br>

> Name: Ishit Bansal

----


<br>

> To build : sudo docker-compose build

> To start : sudo docker-compose up

<br>


### Login and Registration:
----

- Assumed that both email and username are unique
- Input validation in Register in both frontend and backend
- Backend routes are protected using jwt
- User remains logged in even after closing the website or restarting the system

### Profile:
----

- Basic details of the user are shown
- User can edit any except username and email
- User can remove followers and unfollow other users

### My Sub Greddiits
----

- User can create new subgreddiits and moderate it
- Moderator would be able to see the followers of the subgreddiit
- Moderator can either accept or reject a join request
- Moderator can either ignore or delete post or ban the author of a reported post

### Sub Greddiits
----

- User can view the names of all the subgreddits
- User can request to join a subgreddit
- Once user's request is accepeted, user can open that subgreddit's page
- User can then write posts,post comments, upvote/downvote/save posts, follows other users

### Saved Posts
----

- User can save posts in a subgreddit
- Saved posts can be viewed on the Saved Posts page

### Bonus
----

- Fuzzy Search
- Email