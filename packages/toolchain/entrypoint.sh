#!/bin/bash

if [ -z "$GID" -o -z "$UID" -o -z "$USER" -o -z "$GROUP" ]; then
    exec "$@"
else
  if [ ! $(getent group $GID) ]; then
    if [ $(getent group $GROUP) ]; then
      GROUP=container-group-$GID
    fi
    groupadd -g $GID $GROUP
  else
    GROUP=$(getent group $GID | cut -d: -f1)
  fi
  if [ ! $(getent passwd $UID) ]; then
    if [ $(getent passwd $USER) ]; then
      USER=container-user-$UID
    fi
    useradd -u $UID -g $GID -G $GROUP $USER
  fi
  USERNAME=$(id -nu $UID)
  export HOME=/home/$USERNAME
  mkdir -p $HOME
  chown $UID:$GID $HOME

  # Workaround for issue with su-exec tty ownership
  # Should be removed once ticket https://github.com/ncopa/su-exec/issues/33
  # is resolved, or alternative solution with reusing file descriptors is found
  # Test if stdin is associated with a terminal
  if [ -t 0 ]; then
    chown $UID:$GID $(/usr/bin/tty)
  fi

  exec /usr/local/bin/su-exec $USERNAME "$@"
fi
