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
            // searchUser();
            // createUser();
            deleteUser();
        }
    });
}
authentication("uid=admin,ou=system", "secret");

// search a user
function searchUser() {
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

// create user
function createUser() {
    const entry = {
        sn: "nadine",
        // email: ["foo@bar.com", "foo1@bar.com"],
        objectclass: "inetOrgPerson",
    };
    client.add("cn=cyuzuzo,ou=users,ou=system", entry, (err) => {
        if (err) {
            console.log("error adding ---------------------- ", err);
        } else {
            console.log("user created successfully");
        }
    });
}

// delete user
function deleteUser() {
    client.del("cn=cyuzuzo,ou=users,ou=system", (err) => {
        if (err) {
            console.log("error deleting ---------------------- ", err);
        } else {
            console.log("user deleted successfully");
        }
    });
}
