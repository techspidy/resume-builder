# Apollo - resume builder app
<P> Resume builder app (Stack: Node, Express, MongoDB, Angular 1.X).

### Requirements
Requires the following software to be installed: Node.js (4.5.x +), PM2, MongoDB, Grunt-cli. Make sure you chmod +x run-dev.sh and run-production.sh.

### Configuration
You can find the main config file under ./config folder.

### Client side (Angular)
You can find JS/Angular files under ./assets/js folder, on wacth all files will be compiled and moved under ./public/js folder.

### Run the application
<P>./run-dev.sh (development mode)
<P>./run-production.sh (production mode)

### Live example
A live working instance can be found at [apollo-resume.co](https://apollo-resume.co/).

### Social login (Google, Facebook, Linkedin)
<P>Apollo supports login with Google, Facebook and Linkedin, make sure you edit your social apps credentials within ./views/signin.ejs ( YOUR_LINKEDIN_CREDIDENTIALS, YOUR_GOOGLE_CREDIDENTIALS, YOUR_FACEBOOK_CREDIDENTIALS )
<P>Signining in with /.config/defaultAdminUserData, will render an additional screen with all platform users and their resumes.
