FROM docker:stable

LABEL version="1.1.1"
LABEL repository="http://github.com/saucelabs/sauce-connect-action"
LABEL homepage="http://github.com/saucelabs/sauce-connect-action"
LABEL maintainer="Christian Bromann <christian@saucelabs.com>"
LABEL "com.github.actions.name"="Sauce Connect Proxy Action"
LABEL "com.github.actions.description"="A GitHub action to launch Sauce Connect Proxy"
LABEL "com.github.actions.icon"="server"
LABEL "com.github.actions.color"="green"

COPY "entrypoint.sh" "/entrypoint.sh"
COPY "cleanup.sh" "/cleanup.sh"
ENTRYPOINT ["sh", "/entrypoint.sh"]
