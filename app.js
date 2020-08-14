const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public")); //dette kallet sier at mappen ved navn public kommer til å inneholde statiske filer. Bilder, stylesheets mm som er lokale på pcen.




app.get("/", function(req,res){
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const url = "https://us17.api.mailchimp.com/3.0/lists/f0283b0f02";
  //dette er dataen som vi vil sende til API-provideren
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  const jsonData = JSON.stringify(data);

  const options = {
    method: "POST",
    auth: "therese1:a3b05c6e3be97a85f95af2283be14354-us17"
  }

  const request = https.request(url, options, function(response){

    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function(data){
      //console.log(JSON.parse(data));
    })

  })

  request.write(jsonData);
  request.end();
});

app.post("/failure", function(req,res){
  res.redirect("/");
})

app.listen(process.env.PORT || 3000, function(){
  console.log("Server up and running");
});


//api-key a3b05c6e3be97a85f95af2283be14354-us17
