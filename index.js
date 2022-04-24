const express = require("express");
const ldap = require("ldapjs");

const app = express();
app.listen(3000, function () {
    console.log("server is started");
});

const client = ldap.createClient({
    url: ["ldap://127.0.0.1:10389"],
});

// authantication
function authentication(username, password) {
    client.bind(username, password, (err) => {
        if (err) {
            console.log("error: ", err);
        } else {
            console.log("connection success");
            // searchUser();
            // createUser();
            // deleteUser();
            // addUserToGroup("cn=Administrators,ou=groups,ou=system");
            // deleteUserFromGroup("cn=Administrators,ou=groups,ou=system");
            // updateUser('cn=test,ou=users,ou=system');
            compare("cn=blaise,ou=users,ou=system");
            // modifyDN("cn=bar,ou=users,ou=system");
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

/*add user to group*/
function addUserToGroup(groupname) {
    var change = new ldap.Change({
        operation: "add",
        modification: {
            uniqueMember: "cn=blaise,ou=users,ou=system",
        },
    });

    client.modify(groupname, change, function (err) {
        if (err) {
            console.log("err in add user in a group ------------------" + err);
        } else {
            console.log("added user in a group");
        }
    });
}

/*use this to delete user from group*/
function deleteUserFromGroup(groupname) {
    var change = new ldap.Change({
        operation: "delete",
        modification: {
            uniqueMember: "cn=blaise,ou=users,ou=system",
        },
    });

    client.modify(groupname, change, function (err) {
        if (err) {
            console.log("err in delete  user in a group " + err);
        } else {
            console.log("deleted  user from a group");
        }
    });
}

/*use this to update user attributes*/
function updateUser(dn) {
    var change = new ldap.Change({
        operation: "add", //use add to add new attribute
        //operation: 'replace', // use replace to update the existing attribute
        modification: {
            displayName: "657",
        },
    });

    client.modify(dn, change, function (err) {
        if (err) {
            console.log("err in update user " + err);
        } else {
            console.log("add update user");
        }
    });
}

/*use this to compare user is already existed or not*/
function compare(dn) {
    client.compare(dn, "sn", "irakoze", function (err, matched) {
        if (err) {
            console.log("err in update user " + err);
        } else {
            console.log("result :" + matched);
        }
    });
}

/*use this to modify the dn of existing user*/
function modifyDN(dn) {
    client.modifyDN(dn, "cn=ba4r", function (err) {
        if (err) {
            console.log("err in update user " + err);
        } else {
            console.log("result :");
        }
    });
}
