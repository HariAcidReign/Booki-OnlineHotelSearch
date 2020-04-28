# Booki_OnlineHotelSurf
This is a web app I made from scratch using RESTful Routing, called <strong>Booki</strong>. The purpose of doing this project was to get myself comfortable using Node.js, MongoDB, and Express.
It is meant for hotel and resort owners to add their properties in for prospective clients to see and decide before booking a room.However, this is a sample website and hence
is <strong>NOT</strong> intended for public use.

 <img src="https://is1-ssl.mzstatic.com/image/thumb/Purple118/v4/4b/40/0d/4b400df2-a297-fc95-2fe8-aedca602e3e6/source/512x512bb.jpg" width="72" height="72">
 
The various features I had added and their explanantions:
<ul>
<li> <strong>The Landing Page : </strong>
I had added a design feature here where the background is in the form of an image slideshow with fading in and out effects, to make it more applealing than a static landing page.
The Get Started button takes the user to the index page
<li><strong>The Index Page : </strong>
This is the page where all the hotels put up in the Database are shown in Bootstrap 4 Card components. The Nav bar is responsive to all device screen sizes, and the styled Jumbotron 
has the options of Adding a new Hotel, and also a search box that implements Fuzzy Searching to find out the exact hotel a user is looking for, even if the search query is incomplete.
<strong>NOTE: You cannot add a hotel unless you are logged in.</strong>
All error handling and website protection are already coded in, and any attemps of malpractice by the user, or genuine error will be shown to the user as a flash message.
Successful login, posting of hotel, comment, or review too shows a flash message. Hence there is no scope for bad user experience.

Clicking the <strong> More Info </strong> option on a hotel takes the user to the Show Page, where most of the features are present.

<li><strong>The Show Page</strong>
The Hotel image, description, link to the profile of the user who posted the hotel, duration since time of post take centerstage. Options to write a review (1-5 stars that automatically get averaged out when more users give different reviews, and a reason for the review), and to write a comment can be seen at the bottom. 
<strong>NOTE: Based on ownership, ability to Edit and Delete a Hotel, a review, or a comment is shown. If a user logs in as an admin, they can do all the above even though they may or may not own them. </strong>
On the bottom left is the Google Maps section. Right now, it is hard coded to Australia, but in future, I may make it non static, if i can find the time.
Also, the Google API key used isn't mine, so it can cease to work anytime.

Important: As of now, the Google Maps, and the CSS styles are working fine, but in case they don't work in your system, please let me know because I've had some problems getting them to work in this commit.
Also, the "Welcome to Booki!" email sent using mailgun works on haran465@gmail.com(my own) but it may not work on yours, because i do not have a paid version of it. So if you want to experience it, create a new mailgun account in your name, and replace my email id with yours!

Hope you like my first full stack web dev project.

Cheers!


<ul>
