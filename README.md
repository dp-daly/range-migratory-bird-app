# Range - Community bird migration tracking

![](./assets/readme%20images/index.png)

## Description

Range is a website and app to log and track migratory bird sightings. 

The migration feed is the core of the website. Users contribute to it with their own sightings. The feed displays most recent sightings, similar to how social media feeds operate. The idea is that the timeliness inherent to migration will make this an exciting and informative user experience which should galvanise a global community of bird watchers.

## Getting started

### Access

You can access Range here: https://665992f600379200200f3436--range-bird-migration.netlify.app/.

### Functionality

#### Visitors without authorisation credentials

On the landing page, an unregistered visitor is able to preview 'most recent sightings' as well as 'most discussed sightings'. They can also access the migration feed, but will be redirected to the sign in page if they attempt to open a specific sighting page.

![](./assets/readme%20images/index2.png)

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

If a sighting is rare, it is adorned with a banner to distinguish the unique sighting.

![](./assets/readme%20images/rare.png)

## Accessibility

Images contain alt text or aria labels and high contrast colour pairings have been selected throughout. 

The navbar is constant throughout the UI for simple navigation. Images and text are quite large, with a view to making access easy for all ages.

## Technology

## Stack

- MongoDB
- EJS
- Node.js

### Languages
- Javascript
- HTML
- CSS

### Select logic

The app uses three main MongoDB models: User, Sighting, and Comment.

Within the User model there is a reference to Sighting in the "favourites" property. When rendering favourites on the user's "perch" page, I needed to reference not only the Sightings that had been pushed to the "favourites" array, but the publisher of that sighting. 

![](./assets/readme%20images/User.png)

This meant that I needed to populate a reference within a reference: from the User "favourites" property linking to Sighting, to the Sighting "publisher" property which linked back to the relevant User in the database.

![](./assets/readme%20images/Sighting.png)

For this, I had to execute a more complex .populate() method to specify the paths.

![](./assets/readme%20images/paths.png)

### Planning materials

Planning materials can be accessed here: https://trello.com/b/F7KGWC5z/range-migratory-bird-site-app.

## Improvements

Future improvements may include: 

* More informed grounding of the migration concept, perhaps centred around only one species at first and functionality to explore additional species.
* Interaction with a relevant API, such as bird information or location-based autofill.
* Pagination in the migration feed.
* The ability for users to delete comments.
* Different colours on alternate user comments.