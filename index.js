const express = require("express");
const ldap = require("ldapjs");

const app = express();
app.listen(3000, function () {
    console.log("server is started");
});

const client = ldap.createClient({
    url: ["ldap://127.0.0.1:10389"],
});

//authantication
function authentication(username, password) {
    client.bind(username, password, (err) => {
        if (err) {
            console.log("error: ", err);
        } else {
            console.log("connection success");
        }
    });
}
authentication("uid=admin,ou=system", "secret");

// search a user
function search() {
    const opts = {
        filter: "(objectClass=*)",
        scope: "sub",
        attributes: ["sn", "cn"],
    };
    client.search("ou=users,ou=system", opts, (err, res) => {
        if (err) {
            console.log("error searching------------------ ", err);
        } else {
            res.on("searchRequest", (searchRequest) => {
                console.log("searchRequest: ", searchRequest.messageID);
            });
            res.on("searchEntry", (entry) => {
                console.log("entry: " + JSON.stringify(entry.object));
            });
            res.on("searchReference", (referral) => {
                console.log("referral: " + referral.uris.join());
            });
            res.on("error", (err) => {
                console.error("error: " + err.message);
            });
            res.on("end", (result) => {
                console.log("status: " + result.status);
            });
        }
    });
}
search();
