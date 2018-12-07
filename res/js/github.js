"use strict";

var github = new GitHub({token: '20c7969d26605b4d2de4bafc486e2637ec482930'});

github.get('orgs/dogmatiq/repos?type=public', null, function(err, repositories) {
    var repos = [];

    if (!err) {
        for (var i = 0; i < repositories.length; ++i) {
            var repo = repositories[i];

            if (repo.homepage) {
                repos.push(repo)
            }
        }
    }

    riot.mount(
        'project-list',
        {
            repositories: repos,
        },
    );

    riot.mount(
        'contributor-list',
        {
            contributors: [
                {
                    user: "jmalloc",
                    name: "James Harris",
                },
                {
                    user: "danilvpetrov",
                    name: "Danil Petrov",
                },
                {
                    user: "koden-km",
                    name: "Kevin Millar",
                },
            ],
        },
    );
})
