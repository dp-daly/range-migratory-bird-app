# Range - Community bird migration tracking

![](./assets/readme%20images/index.png)

## Description

Range is a website and app to log and track migratory bird sightings. 

The migration feed is the core of the website and users contribute to it with their own sightings. The feed displays most recent sightings, similar to how social media feeds operate. The idea is that the timeliness inherent to migration will make this an exciting and informative user experience which should galvanise a global community of bird watchers.

## Getting started

### Access

You can access the Range here: 

### Functionality

#### Visitors without authorisation credentials

On the landing page, the visitor is able to view a preview of 'most recent sightings' added to the migration feed, as well as 'most discussed sightings'. The latter is the result of a filter which renders the sighting cards based on the number of comments it has received. 

![](./assets/readme%20images/index2.png)

As a visitor they may also view the migration feed.

![](./assets/readme%20images/migration-feed.png)

The visitor is invited to sign in or register in the authorisation section of the navigation bar, the position of which is constant throughout the UI. 



#### Authorised users

Once signed in, an authorised user will see their name appear at the top of the navigation bar.

![](./assets/readme%20images/logged-in.png)

The user now has the ability to create, edit and view sightings, as well as joining discussions in the comments and adding sightings to their favourites.

![](./assets/readme%20images/add%20sighting.png)

The user's own creations and favourites are accessible through their 'perch' page. 

![](./assets/readme%20images/perch1.png)
![](./assets/readme%20images/perch2.png)

If a sighting is rare, it is adorned with a banner to signify the unique sighting.

![](./assets/readme%20images/rare.png)

## Accessibility

Images contain alt text and high contrast colour pairings have been selected throughout.

## Technology

## Stack

- MongoDB
- EJS
- Node.js

### Languages
- Javascript
- HTML
- CSS

## Improvements

Future improvements may include: 

* Interaction with a relevant API, such as bird information or location-based autofill.
* Pagination in the migration feed.
* The ability for users to delete comments.
* Alternating colours on comments.