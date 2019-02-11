"use strict";

var github = new GitHub({token: '20c7969d26605b4d2de4bafc486e2637ec482930'});

github.get('orgs/dogmatiq/repos?type=public', null, function(err, repositories) {
    var dogma = {
        id: "dogma",
        title: "Dogma",
        desc: "A suite of tools for developing message-based distributed applications in Go.",
        repos: [],
    }

    var engines = {
        id: "dogma-engines",
        title: "Dogma Engines",
        desc: "Dogma engine implementations and utilities for engine developers.",
        repos: [],
    }

    var libraries = {
        id: "libraries",
        title: "Supporting Libraries",
        desc: "Standalone Go modules that were developed in support of other Dogmatiq projects.",
        repos: [],
    }

    var categories = [dogma, engines, libraries]

    if (err) {
        console.log(err)
    } else {
        for (var i = 0; i < repositories.length; ++i) {
            var repo = repositories[i];

            var r = {
                name: repo.name,
                desc: repo.description,
                url: repo.html_url+'#readme',
            }

            if (repo.language == "Go") {
                r.godoc = "https://godoc.org/github.com/"+repo.full_name
            }

            if (repo.name.match(/\bengine\b/i) || repo.description.match(/\bengine\b/i)) {
                engines.repos.push(r)
            } else if (repo.name.match(/\bdogma\b/i) || repo.description.match(/\bdogma\b/i)) {
                dogma.repos.push(r)
            } else if (repo.language == "Go") {
                libraries.repos.push(r)
            }
        }
    }

    riot.mount(
        'project-list',
        {
            categories: categories,
            err: err,
        },
    );
})

github.get('orgs/dogmatiq/members', null, function(err, members) {
    if (err) {
        console.log(err)
        return
    }

    var contributors = []

    for (var i = 0; i < members.length; ++i) {
        var member = members[i]

        github.get('users/'+member.login, null, function(err, member) {
            if (err) {
                console.log(err)
                return
            }

            contributors.push(
                {
                    user: member.login,
                    name: member.name,
                }
            )

            riot.mount(
                'contributor-list',
                {
                    contributors: contributors,
                }
            )
        })
    }
})
