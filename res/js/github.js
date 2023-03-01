"use strict";

var github = new GitHub();

github.get(
  "orgs/dogmatiq/repos?type=public",
  { all: true },
  function (err, repositories) {
    var dogma = {
      id: "dogma",
      title: "Dogma",
      desc: "A suite of tools for developing message-based distributed applications in Go.",
      repos: [],
    };

    var engines = {
      id: "dogma-engines",
      title: "Dogma Engines",
      desc: "Dogma engine implementations and utilities for engine developers.",
      repos: [],
    };

    var libraries = {
      id: "libraries",
      title: "Supporting Libraries",
      desc: "Standalone Go modules that were developed in support of other Dogmatiq projects.",
      repos: [],
    };

    var deprecated = {
      id: "deprecated",
      title: "Deprecated Projects",
      desc: "Projects that should no longer be used for new designs but are not yet archived.",
      repos: [],
    };

    var categories = [dogma, engines, libraries, deprecated];

    if (err) {
      console.log(err);
    } else {
      for (var i = 0; i < repositories.length; ++i) {
        var repo = repositories[i];

        if (repo.archived) {
          console.log(repo.name, "ignoring archived repo");
          continue;
        }

        if (repo.description.match(/internal/i)) {
          console.log(repo.name, "ignoring internal repo");
          continue;
        }

        var r = {
          name: repo.name,
          desc: repo.description,
          url: repo.html_url + "#readme",
        };

        if (repo.language == "Go") {
          r.godoc = "https://pkg.go.dev/github.com/" + repo.full_name;
        }

        if (repo.description.match(/🚫/i)) {
          deprecated.repos.push(r);
        } else if (
          repo.name.match(/\bengines?\b/i) ||
          repo.description.match(/\bengines?\b/i)
        ) {
          engines.repos.push(r);
        } else if (
          repo.name.match(/\bdogma\b/i) ||
          repo.description.match(/\bdogma\b/i)
        ) {
          dogma.repos.push(r);
        } else if (repo.language == "Go") {
          libraries.repos.push(r);
        }
      }
    }

    riot.mount("project-list", {
      categories: categories,
      err: err,
    });
  }
);

github.get("orgs/dogmatiq/members", null, function (err, members) {
  if (err) {
    console.log(err);
    return;
  }

  var contributors = [];

  for (var i = 0; i < members.length; ++i) {
    var member = members[i];

    github.get("users/" + member.login, null, function (err, member) {
      if (err) {
        console.log(err);
        return;
      }

      contributors.push({
        user: member.login,
        name: member.name,
      });

      riot.mount("contributor-list", {
        contributors: contributors,
      });
    });
  }
});
