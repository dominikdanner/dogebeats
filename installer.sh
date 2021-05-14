#! /usr/bin/bash
# Enter chmod +x installer.sh to give executen permissions.

# Software Requirerments:
#   * nodeJS 14.x
#   * typescript Compiler
echo "Installing all Libaries and Dependencies needed"
echo $'Node Version 14.x required \n'

# Clones Github repositories into subfolder.
echo $(sudo git clone https://github.com/dominikdanner/dogebeats.git)

cd dogebeats/
echo $'\nRepository Successfully cloned!'

# Installing NPM packages.
# Its recommended to use the compiled JS file and execute it with NodeJS.
echo $(sudo npm i discord.js yt-search ytdl-core typescript tsc)
echo "Dependencies succesfully installed!"
