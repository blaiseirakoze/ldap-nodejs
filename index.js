// import express from "express";
// import ldap from "ldapjs";
const express = require("express");
const ldap = require("ldapjs");

const app = express();
app.listen(3000, function () {
    console.log("server is started");
});

function authentication(username, password) {
    const client = ldap.createClient({
        url: ["ldap://127.0.0.1:10389"],
    });
    client.bind(username, password, (err) => {
        if (err) {
            console.log("error: ", err);
        } else {
            console.log("connection success");

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
    });
}

authentication("uid=admin,ou=system", "secret");
