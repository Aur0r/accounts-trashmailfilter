if (Meteor.isClient) {
  Trashmailfilter = {};
} else if (Meteor.isServer) {
  Trashmailfilter = {};
  Accounts.validateNewUser(function (user) {
    // prevent trashmailer accounts
    var email = null;
    try {
      //console.log(user);
      //console.log(user.services);
      if (user.emails && user.emails[0]) {
        email = user.emails[0].address;
      } else {
        for (var service in user.services) {
          //console.log(JSON.stringify(user.services[service]));
          email = user.services[service].email;
        }
      }
      if (email === null) {
        throw new Exception("Couldn't find an email address for the new user.");
      }
    } catch (err)  {
      throw _.extend(new Error("No email address field found." + err.message), {response: err.response})
    }

    var domain = null;
    try {
      domain = email.replace(/.*@/, "");
    } catch (err)  {
      throw _.extend(new Error("Could not extract domain from email address." + err.message), {response: err.response})
    }
    var userAgent = "Meteor";
    if (Meteor.release) {
      userAgent += "/" + Meteor.release;
    }
    var options = {
      headers: {
        "Content-Type": 'application/json',
        "User-Agent": userAgent
      }
    };

    var url = "https://v2.trashmail-blacklist.org/check/json/" + domain;
    var response;
    try {
      response = HTTP.get(url, options);
    } catch (err) {
      console.log(_.extend(new Error("Failed to retrieve trash mail blacklist information. (1) " + err.message), {response: err.response}));
      return true;
    }
    if (response.statusCode === 200) {
      let content = null;
      try {
        content = JSON.parse(response.content);
      } catch (err) {
        console.log(_.extend(new Error("Failed to parse trash mail blacklist information. " + err.message), {response: err.response}));
        return true;
      }
      if (content.status === 'blacklisted') {
        console.log("Access denied: found blacklisted email domain=" + domain);
        throw new Meteor.Error(400, "Access denied: the domain " + domain + " of the email address you entered is blacklisted for this registration.");
      } else if (content.status === 'whitelisted') {
        console.log("found whitelisted email domain=" + domain);
        // TODO cache whitelisted email domain
      }
      console.log("allowed email domain=" + domain + " for registration");
      return true;
    } else {
      console.log(new Error("Failed to retrieve trash mail blacklist information. (2) " + response.data.error));
      return true;
    }
  });
}
