import {Hono} from "hono";


import {
    validateToken,
} from "../../models/authSchemas";
import {userData} from "../../controllers/user-data";
import {avatarLinks} from "../../controllers/avatar-links";
import {postAvatars} from "../../controllers/post-avatars";
import {postBio} from "../../controllers/post-bio";
import {getTags} from "../../controllers/get-tags";

export const user = new Hono().basePath("/user");

/* 
    1. receives a token
    2. checks that the token is valid
    3. checks whether the user exists in the database. 
    if not, returns an error.
    if so, returns all relevant user data.
*/

user.get("/user-data", validateToken, userData);

/* 
    1. receives a token
    2. checks that the token is valid
    3. checks whether the user exists in the database. 
    if not, returns an error.
    if so, returns the user's avatar image links.
*/

user.get("/avatar-links", validateToken, avatarLinks);

/*
1. gets the files from the form data
2. coverts to webp and saves only full image cells
3. saves a small version of the first photo (which is the chosen avatar)
4. uploads the paths to the database
6. returns "success" of "failure"
 */


user.post("/post-avatars", validateToken, postAvatars);

/*
    check for html malicious content
    update bio
 */
user.post("/post-bio", validateToken, postBio)


user.get("/get-tags", validateToken, getTags);