(function () {
  const h = XPD.h;
  const ext = XPD.ext;
  const D = XPData;
  let githubCache = null;

  function chips(items, className) {
    return h("ul", { class: className || "chips" }, items.map(function (item) {
      return h("li", { text: item });
    }));
  }

  function monthValue(label) {
    if (!label) return 0;
    const parts = label.split(" ");
    const months = { January: 1, February: 2, March: 3, April: 4, May: 5, June: 6, July: 7, August: 8, September: 9, October: 10, November: 11, December: 12 };
    const year = parseInt(parts[1], 10) || 0;
    return year * 12 + (months[parts[0]] || 0);
  }

  function about(root, ctx) {
    const tabs = [
      { id: "general", label: "General" },
      { id: "education", label: "Education" },
      { id: "profiles", label: "Profiles" }
    ];
    const panels = h("div", { class: "tab-panels" });
    const bar = h("div", { class: "tabbar", role: "tablist", "aria-label": "About sections" });
    root.append(bar, panels);

    function show(id) {
      panels.querySelectorAll(".tab-panel").forEach(function (p) {
        const on = p.dataset.tab === id;
        p.hidden = !on;
      });
      bar.querySelectorAll("[role=tab]").forEach(function (t) {
        const on = t.dataset.tab === id;
        t.classList.toggle("is-on", on);
        t.setAttribute("aria-selected", on ? "true" : "false");
        t.tabIndex = on ? 0 : -1;
      });
    }

    tabs.forEach(function (tab, index) {
      bar.append(h("button", {
        type: "button",
        class: "tab" + (index === 0 ? " is-on" : ""),
        role: "tab",
        "aria-selected": index === 0 ? "true" : "false",
        dataset: { tab: tab.id },
        onclick: function () { show(tab.id); }
      }, [tab.label]));
    });

    const photo = h("img", {
      src: D.profile.photo,
      alt: "Portrait of Muhammad Behram Hassan",
      class: "avatar",
      width: "148",
      height: "148"
    });
    photo.addEventListener("error", function () {
      photo.replaceWith(h("div", { class: "avatar avatar-fallback", text: "MBH" }));
    });

    const general = h("section", { class: "tab-panel", dataset: { tab: "general" } }, [
      h("div", { class: "profile-head" }, [
        photo,
        h("div", {}, [
          h("h3", { class: "profile-name", text: D.profile.name }),
          h("p", { class: "profile-role", text: D.profile.title }),
          h("p", { class: "muted", text: D.profile.location }),
          h("p", { class: "muted", text: D.contact.email + " · " + D.contact.phoneDisplay })
        ])
      ]),
      h("div", { class: "job-top" }, [
        h("p", { class: "cv-org", text: D.experience[0].role + " · " + D.experience[0].org }),
        h("span", { class: "pill pill-live", text: "Working" })
      ]),
      h("p", { class: "muted", text: D.experience[0].dates + " · " + D.experience[0].location + " · " + D.experience[0].mode }),
      h("h4", { class: "cv-section-title", text: "Professional summary" }),
      h("p", { class: "body-copy", text: D.profile.summary }),
      h("h4", { class: "cv-section-title", text: "Technical specialties" }),
      chips(D.profile.specialties)
    ]);

    const edu = D.profile.education;
    const education = h("section", { class: "tab-panel", hidden: true, dataset: { tab: "education" } }, [
      h("div", { class: "cv-row" }, [
        h("h3", { text: edu.degree }),
        h("p", { class: "cv-org", text: edu.school }),
        h("p", { class: "cv-meta", text: edu.period + " · CGPA " + edu.cgpa })
      ])
    ].concat((edu.earlier || []).map(function (item) {
      return h("div", { class: "cv-row" }, [
        h("h3", { text: item.qualification }),
        h("p", { class: "cv-org", text: item.school }),
        h("p", { class: "cv-meta", text: item.period + " · " + item.result })
      ]);
    })));

    const profiles = h("section", { class: "tab-panel", hidden: true, dataset: { tab: "profiles" } }, [
      h("div", { class: "contact-grid" }, [
        contactLink("mail", "Email", D.contact.email, "mailto:" + D.contact.email),
        contactLink("phone", "Phone", D.contact.phoneDisplay, "tel:" + D.contact.phone),
        contactLink("user", "LinkedIn", "muhammadbehramhassan", D.contact.linkedin, true),
        contactLink("github", "GitHub", "behra527", D.contact.github, true)
      ])
    ]);
    panels.append(general, education, profiles);
    ctx.setStatus("System properties");
  }

  function cvLink(href, text) {
    const external = href.indexOf("http") === 0;
    return h("a", {
      href: href,
      class: "cv-link",
      target: external ? "_blank" : null,
      rel: external ? "noopener noreferrer" : null,
      text: text
    });
  }

  function cvSection(title, nodes) {
    return h("section", { class: "cv-section" }, [
      h("h4", { class: "cv-section-title", text: title })
    ].concat(nodes));
  }

  function resumeDocument() {
    const edu = D.profile.education;
    const photo = h("img", {
      src: D.profile.photo,
      alt: "Portrait of Muhammad Behram Hassan",
      class: "avatar cv-photo",
      width: "92",
      height: "92"
    });
    photo.addEventListener("error", function () {
      photo.replaceWith(h("div", { class: "avatar avatar-fallback cv-photo", text: "MBH" }));
    });
    const certs = D.certifications.slice().sort(function (a, b) {
      return monthValue(b.date) - monthValue(a.date);
    });
    return h("article", { class: "cv" }, [
      h("header", { class: "cv-banner" }, [
        photo,
        h("div", {}, [
          h("h3", { class: "cv-name", text: D.profile.name }),
          h("p", { class: "cv-role", text: D.profile.title }),
          h("p", { class: "cv-contact" }, [
            D.profile.location,
            " · ",
            cvLink("mailto:" + D.contact.email, D.contact.email),
            " · ",
            cvLink("tel:" + D.contact.phone, D.contact.phoneDisplay)
          ]),
          h("p", { class: "cv-contact" }, [
            cvLink(D.contact.linkedin, "LinkedIn"),
            " · ",
            cvLink(D.contact.github, "GitHub")
          ])
        ])
      ]),
      cvSection("Professional summary", [
        h("p", { class: "cv-copy", text: D.profile.summary })
      ]),
      cvSection("Education", [
        h("div", { class: "cv-row" }, [
          h("h3", { text: edu.degree }),
          h("p", { class: "cv-org", text: edu.school }),
          h("p", { class: "cv-meta", text: edu.period + " · CGPA " + edu.cgpa })
        ])
      ].concat((edu.earlier || []).map(function (item) {
        return h("div", { class: "cv-row" }, [
          h("h3", { text: item.qualification }),
          h("p", { class: "cv-org", text: item.school }),
          h("p", { class: "cv-meta", text: item.period + " · " + item.result })
        ]);
      }))),
      cvSection("Experience", D.experience.map(function (job) {
        return h("div", { class: "cv-row" }, [
          h("div", { class: "job-top" }, [
            h("h3", { text: job.role }),
            job.current ? h("span", { class: "pill pill-live", text: "Working" }) : null
          ]),
          h("p", { class: "cv-org", text: job.org }),
          h("p", { class: "cv-meta", text: job.dates + " · " + job.location + " · " + job.mode }),
          h("ul", { class: "duties" }, job.duties.map(function (duty) {
            return h("li", { text: duty });
          }))
        ]);
      })),
      cvSection("Technical skills", D.skills.map(function (group) {
        return h("p", { class: "cv-skills" }, [
          h("strong", { text: group.label + ": " }),
          group.items.join(", ")
        ]);
      })),
      cvSection("Selected projects", D.projects.map(function (project) {
        return h("div", { class: "cv-row" }, [
          h("h3", { text: project.title }),
          h("p", { class: "cv-copy", text: project.description }),
          h("p", { class: "repo-name", text: project.repoName })
        ]);
      })),
      cvSection("Licenses and certifications", certs.map(function (cert) {
        const meta = [cert.issuer];
        if (cert.date) meta.push(cert.date);
        if (cert.expires) meta.push("Expires " + cert.expires);
        return h("div", { class: "cv-cert" }, [
          h("div", {}, [
            h("h3", { text: cert.title }),
            h("p", { class: "cv-meta", text: meta.join(" · ") })
          ]),
          cert.id ? h("span", { class: "mono", text: cert.id }) : null
        ]);
      }))
    ]);
  }

  function resume(root, ctx) {
    root.append(
      h("div", { class: "resume-actions" }, [
        h("a", {
          class: "xp-btn primary",
          href: D.contact.cv,
          download: D.contact.cvName,
          text: "Download Resume"
        }),
        h("button", { type: "button", class: "xp-btn", onclick: printResume, text: "Print" })
      ]),
      resumeDocument()
    );
    ctx.setStatus("Resume");
  }

  function printResume() {
    const sheet = document.getElementById("printSheet");
    XPD.clear(sheet);
    sheet.append(resumeDocument());
    window.print();
  }

  function shields(pairs) {
    const ready = pairs.filter(function (pair) { return pair && pair[1]; });
    if (!ready.length) return null;
    return h("div", { class: "badge-row" }, ready.map(function (pair) {
      return h("span", { class: "readme-badge" }, [
        h("span", { class: "readme-badge-key", text: pair[0] }),
        h("span", { class: "readme-badge-val", text: pair[1] })
      ]);
    }));
  }

  function badgeRow(labels) {
    if (!labels || !labels.length) return null;
    return h("div", { class: "badge-row" }, labels.map(function (label) {
      const parts = String(label).split(" ");
      const key = parts.length > 1 ? parts.shift() : "";
      const value = parts.join(" ") || label;
      return h("span", { class: "readme-badge" }, [
        key ? h("span", { class: "readme-badge-key", text: key }) : null,
        h("span", { class: "readme-badge-val", text: value })
      ]);
    }));
  }

  function projects(root, ctx) {
    let cat = "all";
    let query = "";
    let detail = null;
    const shell = h("div", { class: "explorer" });
    const side = h("nav", { class: "explorer-side", "aria-label": "Project categories" });
    const main = h("div", { class: "explorer-main" });
    shell.append(side, main);
    root.append(shell);

    D.projectCategories.forEach(function (item) {
      const count = item.id === "all" ? D.projects.length : D.projects.filter(function (p) {
        return p.categories.indexOf(item.id) !== -1;
      }).length;
      side.append(h("button", {
        type: "button",
        class: "side-link" + (item.id === "all" ? " is-on" : ""),
        dataset: { cat: item.id },
        onclick: function () {
          cat = item.id;
          detail = null;
          side.querySelectorAll(".side-link").forEach(function (btn) {
            btn.classList.toggle("is-on", btn.dataset.cat === cat);
          });
          paint();
        }
      }, [
        XPIcons.el("folder"),
        h("span", { text: item.label }),
        h("span", { class: "count", text: String(count) })
      ]));
    });

    function matches(project) {
      const inCat = cat === "all" || project.categories.indexOf(cat) !== -1;
      const blob = (project.title + " " + project.repoName + " " + project.description + " " + (project.badges || []).join(" ") + " " + project.tech.join(" ")).toLowerCase();
      return inCat && blob.indexOf(query.trim().toLowerCase()) !== -1;
    }

    function paintDetail(project) {
      XPD.clear(main);
      const catLabels = project.categories.map(function (id) {
        const found = D.projectCategories.filter(function (c) { return c.id === id; })[0];
        return found ? found.label : id;
      });
      main.append(
        h("div", { class: "explorer-toolbar" }, [
          h("button", {
            type: "button",
            class: "xp-btn",
            onclick: function () { detail = null; paint(); },
            text: "Back"
          }),
          h("span", { class: "crumb", text: project.title })
        ]),
        h("article", { class: "detail" }, [
          h("h3", { text: project.title }),
          h("p", { class: "repo-line" }, [
            h("span", { class: "repo-label", text: "Repository" }),
            h("span", { class: "repo-name", text: project.repoName })
          ]),
          h("p", { class: "body-copy", text: project.description }),
          h("h4", { class: "block-title", text: "README badges" }),
          badgeRow(project.badges),
          project.note ? h("p", { class: "note", text: project.note }) : null,
          h("h4", { class: "block-title", text: "Categories" }),
          chips(catLabels),
          h("h4", { class: "block-title", text: "Technologies" }),
          chips(project.tech),
          h("div", { class: "link-list" }, [
            ext(project.repo, "View repository", "xp-btn primary")
          ])
        ])
      );
      ctx.setStatus(project.repoName);
    }

    function paint() {
      if (detail) {
        paintDetail(detail);
        return;
      }
      const found = D.projects.filter(matches);
      XPD.clear(main);
      const search = h("input", {
        type: "search",
        class: "search",
        placeholder: "Search projects",
        "aria-label": "Search projects",
        value: query
      });
      search.addEventListener("input", function () {
        query = search.value;
        paint();
        const next = main.querySelector(".search");
        if (next) {
          next.focus();
          const pos = next.value.length;
          next.setSelectionRange(pos, pos);
        }
      });
      const grid = h("div", { class: "card-grid" });
      if (!found.length) {
        grid.append(h("p", { class: "empty", text: "No projects match this view." }));
      }
      found.forEach(function (project) {
        grid.append(h("button", {
          type: "button",
          class: "file-card",
          onclick: function () { detail = project; paint(); }
        }, [
          XPIcons.el("folder"),
          h("span", { class: "file-title", text: project.title }),
          h("span", { class: "repo-name", text: project.repoName }),
          h("span", { class: "file-desc", text: project.description }),
          badgeRow(project.badges)
        ]));
      });
      main.append(
        h("p", { class: "page-lead", text: "Selected work. Each card shows the repository name, the description, and the badges from its README." }),
        h("div", { class: "explorer-toolbar" }, [search]),
        grid
      );
      ctx.setStatus(found.length + " project" + (found.length === 1 ? "" : "s"));
    }
    paint();
  }

  function github(root, ctx) {
    const mount = h("div", { class: "gh" });
    root.append(mount);

    function banner(text, retry) {
      const row = h("div", { class: "notice", role: "status" }, [
        h("p", { text: text })
      ]);
      if (retry) {
        row.append(h("button", { type: "button", class: "xp-btn", text: "Retry", onclick: function () { load(true); } }));
      }
      return row;
    }

    function repoCard(item) {
      const body = [
        h("h3", { text: item.title }),
        item.repoName ? h("p", { class: "repo-name", text: item.repoName }) : null,
        h("p", { class: "file-desc", text: item.description }),
        item.badges ? badgeRow(item.badges) : null
      ];
      if (item.language) body.push(h("p", { class: "muted", text: "Language: " + item.language }));
      if (item.updated) body.push(h("p", { class: "muted", text: "Updated " + item.updated }));
      const links = [ext(item.url, "View repository", "xp-btn primary")];
      if (item.homepage) links.push(ext(item.homepage, "Open homepage", "xp-btn"));
      body.push(h("div", { class: "link-list" }, links));
      return h("article", { class: "repo-card" }, body);
    }

    function paint(state) {
      XPD.clear(mount);
      mount.append(h("div", { class: "gh-head" }, [
        XPIcons.el("github"),
        h("div", {}, [
          h("h3", { text: "behra527" }),
          h("p", { class: "muted", text: "Public GitHub profile" })
        ]),
        ext(D.contact.github, "Open profile", "xp-btn")
      ]));
      mount.append(h("p", { class: "page-lead", text: "Public repositories for the projects on this portfolio. Featured cards include the repository name and README badges." }));

      if (state.error === "rate") {
        mount.append(banner("GitHub is limiting requests from this network. Saved repository links are shown below.", true));
      } else if (state.error) {
        mount.append(banner("GitHub could not be reached. Saved repository links are shown below.", true));
      }

      mount.append(h("h4", { class: "cv-section-title", text: "Featured repositories" }));
      const featured = h("div", { class: "repo-list" });
      D.projects.forEach(function (project) {
        const live = state.map && state.map[project.repoName.toLowerCase()];
        featured.append(repoCard({
          title: project.title,
          repoName: project.repoName,
          description: project.description,
          badges: project.badges,
          url: (live && live.html_url) || project.repo,
          language: live && live.language,
          homepage: safeHome(live && live.homepage),
          updated: live && live.pushed_at ? formatDate(live.pushed_at) : ""
        }));
      });
      mount.append(featured);

      const others = [];
      const known = {};
      D.projects.forEach(function (project) { known[project.repoName.toLowerCase()] = true; });
      if (state.repos) {
        state.repos.forEach(function (repo) {
          if (repo.fork || known[repo.name.toLowerCase()]) return;
          others.push(repo);
        });
        others.sort(function (a, b) {
          return new Date(b.pushed_at || 0) - new Date(a.pushed_at || 0);
        });
      }
      mount.append(h("h4", { class: "cv-section-title", text: "Other public repositories" }));
      if (!state.repos) {
        const fallback = h("div", { class: "repo-list" });
        D.extraRepos.forEach(function (repo) {
          fallback.append(repoCard({
            title: repo.name,
            description: "Public repository linked from this portfolio. A description appears when GitHub data is available.",
            url: repo.html_url
          }));
        });
        mount.append(fallback);
      } else if (!others.length) {
        mount.append(h("p", { class: "empty", text: "No additional public repositories were returned." }));
      } else {
        const list = h("div", { class: "repo-list" });
        others.forEach(function (repo) {
          list.append(repoCard({
            title: repo.name,
            description: repo.description || "No description published on GitHub.",
            url: repo.html_url,
            language: repo.language,
            homepage: safeHome(repo.homepage),
            updated: repo.pushed_at ? formatDate(repo.pushed_at) : ""
          }));
        });
        mount.append(list);
      }
      ctx.setStatus(state.error ? "Offline list" : "GitHub");
    }

    function load(force) {
      if (githubCache && !force) {
        paint(githubCache);
        return;
      }
      XPD.clear(mount);
      mount.append(h("div", { class: "loading", role: "status" }, [
        h("span", { class: "spinner", "aria-hidden": "true" }),
        h("p", { text: "Loading public repositories…" })
      ]));
      fetch(D.githubApi, { headers: { Accept: "application/vnd.github+json" } })
        .then(function (res) {
          if (res.status === 403 || res.status === 429) {
            const error = new Error("rate");
            error.code = "rate";
            throw error;
          }
          if (!res.ok) throw new Error("status");
          return res.json();
        })
        .then(function (data) {
          if (!root.isConnected) return;
          if (!Array.isArray(data)) throw new Error("shape");
          const map = {};
          data.forEach(function (repo) { map[(repo.name || "").toLowerCase()] = repo; });
          githubCache = { repos: data, map: map, error: data.length ? null : "empty" };
          paint(githubCache);
        })
        .catch(function (err) {
          if (!root.isConnected) return;
          paint({ error: err && err.code === "rate" ? "rate" : "network" });
        });
    }
    load(false);
  }

  function safeHome(url) {
    if (typeof url !== "string") return "";
    if (url.indexOf("http://") === 0 || url.indexOf("https://") === 0) return url;
    return "";
  }

  function formatDate(iso) {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  }

  function skills(root, ctx) {
    let query = "";
    const search = h("input", {
      type: "search",
      class: "search search-block",
      placeholder: "Search skills",
      "aria-label": "Search skills"
    });
    const panel = h("div", { class: "skill-panel" });
    root.append(
      h("p", { class: "page-lead", text: "Skills used at SoftCodec and in the selected projects. Every group is listed on this page." }),
      search,
      panel
    );
    search.addEventListener("input", function () {
      query = search.value;
      paint();
    });

    function paint() {
      const q = query.trim().toLowerCase();
      XPD.clear(panel);
      let count = 0;
      D.skills.forEach(function (group) {
        const items = q ? group.items.filter(function (item) {
          return item.toLowerCase().indexOf(q) !== -1;
        }) : group.items;
        if (!items.length) return;
        count += items.length;
        panel.append(h("section", { class: "skill-block" }, [
          h("h3", { class: "cv-section-title", text: group.label }),
          chips(items, "chips chips-lg")
        ]));
      });
      if (!count) panel.append(h("p", { class: "empty", text: "No skills match that search." }));
      ctx.setStatus(count + " skills");
    }
    paint();
  }

  function certifications(root, ctx) {
    const groups = ["All"].concat(uniqueGroups());
    let group = "All";
    let query = "";
    const filters = h("div", { class: "filter-row", role: "toolbar", "aria-label": "Certification filters" });
    const search = h("input", { type: "search", class: "search", placeholder: "Search certificates", "aria-label": "Search certificates" });
    const list = h("div", { class: "cert-list" });
    const source = h("p", { class: "page-lead" }, [
      "Taken from the ",
      ext(D.contact.linkedin + "details/certifications/", "LinkedIn licenses", "text-link"),
      " section. Each card shows the issuer, date, credential ID, and a link to the record."
    ]);
    root.append(source, h("div", { class: "explorer-toolbar" }, [search]), filters, h("h3", { class: "cv-section-title", text: "Licenses and certifications" }), list);
    groups.forEach(function (name) {
      filters.append(h("button", {
        type: "button",
        class: "chip-btn",
        dataset: { group: name },
        onclick: function () { group = name; paint(); }
      }, [name]));
    });
    search.addEventListener("input", function () { query = search.value; paint(); });

    function paint() {
      filters.querySelectorAll(".chip-btn").forEach(function (btn) {
        btn.classList.toggle("is-on", btn.dataset.group === group);
      });
      const q = query.trim().toLowerCase();
      const items = D.certifications.filter(function (cert) {
        const groupOk = group === "All" || cert.group === group;
        const blob = (cert.title + " " + cert.issuer + " " + (cert.id || "")).toLowerCase();
        return groupOk && blob.indexOf(q) !== -1;
      }).slice().sort(function (a, b) { return monthValue(b.date) - monthValue(a.date); });
      XPD.clear(list);
      if (!items.length) list.append(h("p", { class: "empty", text: "No certificates match this view." }));
      items.forEach(function (cert) {
        const card = h("article", { class: "cert-card" }, [
          XPIcons.el("cert"),
          h("div", { class: "cert-body" }, [
            h("h3", { text: cert.title }),
            shields([
              ["Issuer", cert.issuer],
              ["Issued", cert.date],
              ["Expires", cert.expires]
            ]),
            cert.id ? h("p", { class: "repo-line" }, [
              h("span", { class: "repo-label", text: "Credential ID" }),
              h("span", { class: "repo-name", text: cert.id })
            ]) : null,
            cert.note ? h("p", { class: "note", text: cert.note }) : null,
            cert.url ? ext(cert.url, "View certificate", "xp-btn") : null
          ])
        ]);
        list.append(card);
      });
      ctx.setStatus(items.length + " certificates");
    }
    paint();
  }

  function uniqueGroups() {
    const seen = [];
    D.certifications.forEach(function (cert) {
      if (seen.indexOf(cert.group) === -1) seen.push(cert.group);
    });
    return seen;
  }

  function contact(root, ctx) {
    const info = h("div", { class: "contact-grid" }, [
      contactLink("mail", "Email", D.contact.email, "mailto:" + D.contact.email),
      contactLink("phone", "Phone", D.contact.phoneDisplay, "tel:" + D.contact.phone),
      contactLink("user", "LinkedIn", "muhammadbehramhassan", D.contact.linkedin, true),
      contactLink("github", "GitHub", "behra527", D.contact.github, true)
    ]);
    const status = h("div", { class: "form-status", role: "status", "aria-live": "polite" });
    const form = h("form", { class: "contact-form", novalidate: "novalidate" });
    const fields = [
      field("name", "Name", "text", true, "name"),
      field("email", "Email", "email", true, "email"),
      field("subject", "Subject", "text", true),
      field("phone", "Phone", "tel", false, "tel"),
      field("message", "Message", "textarea", true)
    ];
    fields.forEach(function (item) { form.append(item.wrap); });
    const submit = h("button", { type: "submit", class: "xp-btn primary", text: "Send message" });
    form.append(h("div", { class: "form-actions" }, [submit]), status);
    root.append(
      h("p", { class: "page-lead", text: D.profile.name + " · " + D.profile.title + " at SoftCodec · " + D.profile.location }),
      info,
      h("h3", { class: "cv-section-title", text: "Send a message" }),
      h("div", { class: "info-card" }, [form])
    );

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      status.textContent = "";
      status.className = "form-status";
      let invalid = false;
      const data = {};
      fields.forEach(function (item) {
        const value = item.input.value.trim();
        data[item.name] = value;
        const emailBad = item.name === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        const missing = item.required && !value;
        const bad = missing || emailBad;
        item.input.setAttribute("aria-invalid", bad ? "true" : "false");
        item.error.textContent = bad ? (emailBad && value ? "Enter a valid email address." : "This field is required.") : "";
        if (bad) invalid = true;
      });
      if (invalid) {
        status.textContent = "Check the highlighted fields.";
        status.classList.add("is-error");
        return;
      }
      submit.disabled = true;
      submit.textContent = "Sending…";
      sendMail(data).then(function () {
        status.textContent = "Message sent. Behram will reply to the email address you entered.";
        status.classList.add("is-ok");
        form.reset();
        ctx.setStatus("Message sent");
      }).catch(function (err) {
        console.error('[EmailJS] FAILED:', err);
        status.textContent = "The message could not be sent from this page.";
        status.classList.add("is-error");
        const mail = mailtoLink(data);
        status.append(document.createTextNode(" "));
        status.append(h("a", { href: mail, text: "Open an email draft instead." }));
        ctx.setStatus("Send failed");
      }).finally(function () {
        submit.disabled = false;
        submit.textContent = "Send message";
      });
    });
    ctx.setStatus("Contact");
  }

  function field(name, label, type, required, auto) {
    const input = type === "textarea"
      ? h("textarea", { id: "c-" + name, name: name, rows: "5", required: required ? "required" : null })
      : h("input", { id: "c-" + name, name: name, type: type, autocomplete: auto || null, required: required ? "required" : null });
    const error = h("span", { class: "field-error" });
    const wrap = h("label", { class: "field", for: "c-" + name }, [
      h("span", { text: label + (required ? "" : " (optional)") }),
      input,
      error
    ]);
    return { wrap: wrap, input: input, error: error, name: name, required: required };
  }

  function contactLink(icon, label, value, href, external) {
    const link = h("a", { class: "contact-link", href: href }, [
      XPIcons.el(icon),
      h("span", {}, [
        h("strong", { text: label }),
        h("span", { text: value })
      ])
    ]);
    if (external) {
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }
    return link;
  }

  function mailtoLink(data) {
    const body = "Name: " + data.name + "\nEmail: " + data.email + "\nPhone: " + (data.phone || "") + "\n\n" + data.message;
    return "mailto:" + D.contact.email + "?subject=" + encodeURIComponent(data.subject) + "&body=" + encodeURIComponent(body);
  }

  function sendMail(data) {
    return sendViaEmailJS(data).catch(function () {
      return sendViaFormspree(data);
    });
  }

  function sendViaEmailJS(data) {
    if (!window.emailjs || !D.emailjs.publicKey) {
      return Promise.reject(new Error("unconfigured"));
    }
    emailjs.init(D.emailjs.publicKey);
    var now = new Date().toLocaleString("en-PK", {
      weekday: "long", year: "numeric", month: "long",
      day: "numeric", hour: "2-digit", minute: "2-digit"
    });
    /* Main notification email to Behram */
    var params = {
      from_name:  data.name,
      from_email: data.email,
      subject:    data.subject,
      phone:      data.phone || "Not provided",
      message:    data.message,
      to_email:   D.contact.email,
      reply_to:   data.email,
      time:       now
    };
    console.log('[EmailJS] Sending with serviceID:', D.emailjs.serviceID, 'templateID:', D.emailjs.templateID, 'publicKey:', D.emailjs.publicKey);
    console.log('[EmailJS] Params:', params);
    return emailjs.send(D.emailjs.serviceID, D.emailjs.templateID, params)
      .then(function (res) {
        console.log('[EmailJS] SUCCESS:', res.status, res.text);
        /* Auto-reply email to the sender */
        var reply = {
          from_name:  data.name,
          from_email: data.email,
          subject:    data.subject,
          message:    data.message,
          to_email:   data.email,
          reply_to:   D.contact.email,
          time:       now
        };
        return emailjs.send(D.emailjs.serviceID, D.emailjs.autoReplyTemplateID, reply)
          .catch(function () { return null; });
      });
  }

  function sendViaFormspree(data) {
    if (!D.contact.formspree) return Promise.reject(new Error("unconfigured"));
    return fetch(D.contact.formspree, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        subject: data.subject,
        phone: data.phone || "",
        message: data.message
      })
    }).then(function (res) {
      if (!res.ok) throw new Error("formspree");
    });
  }

  function recycle(root, ctx) {
    root.append(h("div", { class: "empty-bin" }, [
      XPIcons.el("recycle"),
      h("h3", { text: "Recycle Bin is empty" }),
      h("p", { class: "muted", text: "There are no deleted files on this desktop." })
    ]));
    ctx.setStatus("0 objects");
  }

  function computer(root, ctx) {
    const places = [
      ["about", "About Me", "user"],
      ["resume", "My Resume", "resume"],
      ["projects", "My Projects", "folder"],
      ["github", "GitHub", "github"],
      ["skills", "Technical Skills", "skills"],
      ["certifications", "Certifications", "cert"],
      ["contact", "Contact Me", "mail"]
    ];
    root.append(h("div", { class: "computer" }, [
      h("p", { class: "page-lead", text: "System summary. Open a place below for the full page." }),
      h("section", { class: "sys" }, [
        h("div", { class: "job-top" }, [
          h("h3", { text: D.profile.name }),
          h("span", { class: "pill pill-live", text: "Working" })
        ]),
        h("p", { class: "cv-org", text: D.profile.title + " · " + D.experience[0].org }),
        h("dl", { class: "sys-list" }, [
          row("Employer", D.experience[0].org),
          row("Employed", D.experience[0].dates),
          row("Location", D.profile.location),
          row("Education", D.profile.education.degree),
          row("University", D.profile.education.school),
          row("CGPA", D.profile.education.cgpa),
          row("Email", D.contact.email, "mailto:" + D.contact.email),
          row("Phone", D.contact.phoneDisplay, "tel:" + D.contact.phone)
        ])
      ]),
      h("section", { class: "places-card" }, [
        h("h3", { class: "cv-section-title", text: "Places" }),
        h("div", { class: "places" }, places.map(function (place) {
          return h("button", {
            type: "button",
            class: "place",
            onclick: function () { ctx.open(place[0]); }
          }, [XPIcons.el(place[2]), h("span", { text: place[1] })]);
        }))
      ])
    ]));
    ctx.setStatus("My Computer");
  }

  function row(term, value, href) {
    return h("div", { class: "sys-row" }, [
      h("dt", { text: term }),
      h("dd", {}, [
        href ? h("a", { class: "text-link", href: href, text: value }) : value
      ])
    ]);
  }

  function terminal(root, ctx) {
    const out = h("div", { class: "term-out", role: "log", "aria-live": "polite" });
    const input = h("input", {
      class: "term-input",
      "aria-label": "Command",
      "data-autofocus": "true",
      spellcheck: "false",
      autocapitalize: "off"
    });
    const line = h("form", { class: "term-line" }, [
      h("span", { class: "prompt", "aria-hidden": "true", text: "C:\\Users\\Behram>" }),
      input
    ]);
    root.append(h("div", { class: "term" }, [out, line]));
    const history = [];
    let cursor = 0;
    write("Muhammad Behram Hassan — Junior Data Scientist");
    write("SoftCodec · Gujranwala");
    write("Type help and press Enter.");

    const commands = {
      help: function () {
        return [
          "Available commands:",
          "help, about, skills, projects, education, experience,",
          "certifications, github, contact, open, clear",
          "Example: open projects"
        ].join("\n");
      },
      about: function () {
        return D.profile.name + "\n" + D.profile.title + "\n" + D.profile.location + "\n\n" + D.profile.summary;
      },
      skills: function () {
        return D.skills.map(function (group) {
          return group.label + "\n  " + group.items.join(", ");
        }).join("\n\n");
      },
      projects: function () {
        return D.projects.map(function (project) {
          return project.title + "\n  " + project.description + "\n  " + project.repo;
        }).join("\n\n");
      },
      education: function () {
        const edu = D.profile.education;
        const earlier = (edu.earlier || []).map(function (item) {
          return item.qualification + "\n" + item.school + "\n" + item.period + " · " + item.result;
        }).join("\n\n");
        return edu.degree + "\n" + edu.school + "\n" + edu.period + "\nCGPA " + edu.cgpa + (earlier ? "\n\n" + earlier : "");
      },
      experience: function () {
        return D.experience.map(function (job) {
          return job.role + " — " + job.org + "\n" + job.dates + " · " + job.location + " · " + job.mode;
        }).join("\n\n");
      },
      certifications: function () {
        return D.certifications.map(function (cert) {
          return cert.issuer + " — " + cert.title + (cert.date ? " (" + cert.date + ")" : "") + (cert.expires ? " [Expires " + cert.expires + "]" : "");
        }).join("\n");
      },
      github: function () {
        return "https://github.com/behra527";
      },
      contact: function () {
        return "Email: " + D.contact.email + "\nPhone: " + D.contact.phoneDisplay + "\nLinkedIn: " + D.contact.linkedin + "\nGitHub: " + D.contact.github;
      },
      open: function (arg) {
        const key = (arg || "").toLowerCase();
        const alias = { resume: "resume", about: "about", projects: "projects", github: "github", skills: "skills", certifications: "certifications", contact: "contact", computer: "computer", recycle: "recycle", terminal: "terminal", assistant: "assistant", certs: "certifications" };
        if (!alias[key]) return "Usage: open about | resume | projects | github | skills | certifications | contact | computer | recycle | assistant";
        ctx.open(alias[key]);
        return "Opening " + key + ".";
      },
      clear: function () {
        XPD.clear(out);
        return "";
      }
    };

    function write(text) {
      if (!text) return;
      out.append(h("pre", { text: text }));
      out.scrollTop = out.scrollHeight;
    }

    line.addEventListener("submit", function (e) {
      e.preventDefault();
      const raw = input.value;
      const trimmed = raw.trim();
      write("C:\\Users\\Behram> " + raw);
      input.value = "";
      if (!trimmed) return;
      history.push(trimmed);
      cursor = history.length;
      const parts = trimmed.split(/\s+/);
      const cmd = parts[0].toLowerCase();
      const arg = parts.slice(1).join(" ");
      if (!commands[cmd]) {
        write("'" + parts[0] + "' is not recognized as a command. Type help to see available commands.");
        return;
      }
      write(commands[cmd](arg));
      ctx.setStatus(cmd);
    });
    input.addEventListener("keydown", function (e) {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        if (!history.length) return;
        cursor = Math.max(0, cursor - 1);
        input.value = history[cursor] || "";
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        cursor = Math.min(history.length, cursor + 1);
        input.value = history[cursor] || "";
      }
    });
    ctx.setStatus("Command Prompt");
  }

  function assistant(root, ctx) {
    const log = h("div", { class: "chat-log", role: "log", "aria-live": "polite" });
    const suggestions = [
      "What do you do at SoftCodec?",
      "Tell me about your strongest project.",
      "How can I contact you?"
    ];
    const suggestRow = h("div", { class: "suggest" });
    const input = h("input", { type: "text", "aria-label": "Message Behram", placeholder: "Ask me about my work" });
    const send = h("button", { type: "submit", class: "xp-btn primary", text: "Send" });
    const form = h("form", { class: "chat-form" }, [input, send]);
    const thread = [];
    root.append(
      h("div", { class: "assist-head" }, [
        h("strong", { text: "Behram" }),
        h("span", { text: "Junior Data Scientist · SoftCodec" })
      ]),
      h("p", { class: "page-lead", text: "Answers stay in English and use only the facts on this portfolio." }),
      log,
      suggestRow,
      form
    );
    suggestions.forEach(function (text) {
      suggestRow.append(h("button", {
        type: "button",
        class: "chip-btn",
        onclick: function () { ask(text); }
      }, [text]));
    });
    push("behram", "Hey, I'm Behram, a Junior Data Scientist at SoftCodec. Ask me about my work, projects, or how to reach me.");

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const text = input.value.trim();
      if (!text) return;
      input.value = "";
      ask(text);
    });

    function ask(text) {
      push("user", text);
      thread.push({ role: "user", content: text });
      const pending = push("behram", "Writing...");
      send.disabled = true;
      ctx.setStatus("Behram is typing");
      liveReply(thread).then(function (answer) {
        pending.textContent = answer;
        thread.push({ role: "assistant", content: answer });
        if (thread.length > 10) thread.splice(0, thread.length - 10);
        ctx.setStatus("Behram replied");
      }).catch(function () {
        const answer = localReply(text);
        pending.textContent = answer;
        thread.push({ role: "assistant", content: answer });
        ctx.setStatus("Replied from profile");
      }).finally(function () {
        send.disabled = false;
        log.scrollTop = log.scrollHeight;
        input.focus();
      });
    }

    function push(role, text) {
      const body = h("p", { text: text });
      log.append(h("div", { class: "bubble bubble-" + role }, [
        h("span", { class: "who", text: role === "user" ? "You" : "Behram" }),
        body
      ]));
      log.scrollTop = log.scrollHeight;
      return body;
    }
  }

  function liveReply(thread) {
    const ai = D.openrouter;
    if (!ai || !ai.key) return Promise.reject(new Error("unconfigured"));
    return fetch(ai.api, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + ai.key,
        "Content-Type": "application/json",
        "HTTP-Referer": window.location.origin || "https://behra527.github.io",
        "X-Title": "Muhammad Behram Hassan Portfolio"
      },
      body: JSON.stringify({
        model: ai.model,
        temperature: 0.7,
        max_tokens: 280,
        messages: [{ role: "system", content: behramPrompt() }].concat(thread)
      })
    }).then(function (res) {
      if (!res.ok) throw new Error("openrouter");
      return res.json();
    }).then(function (data) {
      const text = data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
      if (!text) throw new Error("empty");
      return String(text).trim();
    });
  }

  function behramPrompt() {
    const edu = D.profile.education;
    const earlier = (edu.earlier || []).map(function (item) {
      return item.qualification + " at " + item.school + ", " + item.period + ", " + item.result;
    }).join(". ");
    const jobs = D.experience.map(function (job) {
      return job.role + " at " + job.org + ", " + job.dates + ", " + job.location + ", " + job.mode + ". " + job.duties.join(" ");
    }).join("\n");
    const projects = D.projects.map(function (project) {
      return project.title + ": " + project.description + " Tech: " + project.tech.join(", ") + ". Repo: " + project.repo;
    }).join("\n");
    const certs = D.certifications.map(function (cert) {
      return cert.issuer + " — " + cert.title + (cert.date ? " (" + cert.date + ")" : "") + (cert.expires ? ", expires " + cert.expires : "") + ", ID " + cert.id;
    }).join("\n");
    const skills = D.skills.map(function (group) {
      return group.label + ": " + group.items.join(", ");
    }).join("\n");
    return [
      "You are Muhammad Behram Hassan, texting from your own portfolio. Talk in the first person, like a real person: warm, direct, and short. Two to five sentences unless the person asks for a list.",
      "Always reply in English, even if the person writes in another language.",
      "Only talk about yourself: your work, projects, education, skills, certifications, and how to contact you. If they ask about something else, say that in one line and offer something about your own work.",
      "Use only the facts below. Do not invent employers, dates, metrics, or projects. Your only job is Junior Data Scientist at SoftCodec. Never mention MeriSKILL, Upwork, or Brackets.",
      "If they ask whether you are a bot, say you are Behram's portfolio chat speaking in his voice, then keep helping.",
      "",
      "Name: " + D.profile.name,
      "Title: " + D.profile.title,
      "Location: " + D.profile.location,
      "Summary: " + D.profile.summary,
      "Email: " + D.contact.email,
      "Phone: " + D.contact.phoneDisplay,
      "LinkedIn: " + D.contact.linkedin,
      "GitHub: " + D.contact.github,
      "",
      "Experience:",
      jobs,
      "",
      "Education: " + edu.degree + " at " + edu.school + ", " + edu.period + ", CGPA " + edu.cgpa + ". " + earlier,
      "",
      "Projects:",
      projects,
      "",
      "Skills:",
      skills,
      "",
      "Certifications:",
      certs
    ].join("\n");
  }

  function localReply(text) {
    const s = text.toLowerCase();
    if (/contact|email|phone|reach|hire|linkedin|number/.test(s)) {
      return "Email me at " + D.contact.email + " or call " + D.contact.phoneDisplay + ". My LinkedIn and GitHub are on this profile too.";
    }
    if (/skill|stack|technolog|python|tool|language/.test(s)) {
      return "I work with Python, SQL, machine learning, and computer vision. TensorFlow, PyTorch, OpenCV, Flask, and LangChain are the tools I use most.";
    }
    if (/project|built|github/.test(s)) {
      return "My selected projects are " + D.projects.map(function (project) { return project.title; }).join(", ") + ". BeautyGenie, car damage detection, and the medical RAG assistant show the work best.";
    }
    if (/experience|work|job|softcodec|career/.test(s)) {
      const job = D.experience[0];
      return "I am a " + job.role + " at " + job.org + ", " + job.dates + ". I handle Python analysis, SQL, APIs, data pipelines, and AI feature testing.";
    }
    if (/educat|university|degree|cgpa|gpa|school/.test(s)) {
      const edu = D.profile.education;
      return "I earned a " + edu.degree + " from " + edu.school + ", " + edu.period + ", with a CGPA of " + edu.cgpa + ".";
    }
    if (/certif|course|ibm|credential/.test(s)) {
      return "My LinkedIn profile lists " + D.certifications.length + " certificates, mostly IBM machine learning and generative AI courses, plus Google, EC-Council, Thinkcloudly, and ULEFUSA.";
    }
    return "I'm Behram, a Junior Data Scientist in Gujranwala. I work at SoftCodec. Ask me about my projects, skills, or how to get in touch.";
  }

  function help(root, ctx) {
    const steps = [
      ["Resume", "My Resume is the full CV: education, SoftCodec, skills, projects, and certificates. Download the PDF or use Print."],
      ["Open a program", "Double-click a desktop icon. On a phone, tap the icon once."],
      ["Start menu", "Press Start for programs, Run, Help and Support, and Turn Off Computer."],
      ["Run", "Press the Windows key and R. Type resume, projects, skills, cmd, or help, then press Enter."],
      ["Recent", "Start keeps the last three programs you opened at the top of the menu."],
      ["Screen saver", "After a minute with no mouse or keyboard, the logo drifts across a black screen. Move the mouse or press a key to come back."],
      ["Turn off", "Turn Off Computer offers Stand By, Turn Off, and Restart. Restart plays the startup screen again."]
    ];
    const programs = [
      "My Computer",
      "About Me",
      "My Resume",
      "My Projects",
      "GitHub",
      "Technical Skills",
      "Certifications",
      "Contact Me",
      "Command Prompt",
      "Behram AI Assistant"
    ];
    root.append(h("p", { class: "page-lead", text: "A short tour of this desktop. Every program uses the same profile: Junior Data Scientist at SoftCodec." }));
    steps.forEach(function (step) {
      root.append(h("article", { class: "info-card help-step" }, [
        h("h3", { text: step[0] }),
        h("p", { class: "body-copy", text: step[1] })
      ]));
    });
    root.append(h("h3", { class: "cv-section-title", text: "Programs" }), chips(programs, "chips chips-lg"));
    ctx.setStatus("Help and Support");
  }

  const apps = [
    { id: "about", title: "About Me", icon: "user", width: 740, height: 540, render: about },
    { id: "resume", title: "My Resume", icon: "resume", width: 840, height: 640, render: resume },
    { id: "projects", title: "My Projects", icon: "folder", width: 880, height: 580, pad: false, render: projects },
    { id: "github", title: "GitHub", icon: "github", width: 760, height: 560, render: github },
    { id: "skills", title: "Technical Skills", icon: "skills", width: 740, height: 520, render: skills },
    { id: "certifications", title: "Certifications", icon: "cert", width: 760, height: 560, render: certifications },
    { id: "contact", title: "Contact Me", icon: "mail", width: 680, height: 620, render: contact },
    { id: "recycle", title: "Recycle Bin", icon: "recycle", width: 440, height: 340, render: recycle },
    { id: "computer", title: "My Computer", icon: "computer", width: 720, height: 640, render: computer },
    { id: "terminal", title: "Command Prompt", icon: "terminal", width: 680, height: 440, pad: false, render: terminal },
    { id: "assistant", title: "Behram AI Assistant", icon: "assistant", width: 480, height: 560, render: assistant },
    { id: "help", title: "Help and Support", icon: "info", width: 560, height: 520, render: help }
  ];

  apps.forEach(function (app) { XPWM.register(app); });
  window.XPPrint = printResume;
})();
