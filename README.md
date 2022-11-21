# Home Media Server Scripts

Home Media Server is a free DNLA (and more) media server for Windows. Made by Evgeniy Lachinov and available to download from [homemediaserver.ru](https://homemediaserver.ru/).

I tried various Media Servers to stream VR clips and found this one to be the best at being able to categorises films based on ID3 Tags, tagged with the excellent [mp3 tagger](https://www.mp3tag.de/en/). Sadly there doesn't seem to be any resource to help with making these scripts so I had to figure it out through an ass load of trial and error.

So I ended up with these Java scripts. They automatically fill folders for the following:

* All Videos located in a set of paths
* Actor
* Producer
* Rating
* Recently Added
* Recently Viewed
* Unwatched and Unrated

![Folder View](https://raw.githubusercontent.com/Trip69/Home-Media-Server-Scripts/main/img/hms-folders.jpg)

You can use them by creating folders under collections and setting those folder to Type 'Dynamic (script)'. Then paste the script to the script editor. Change the second const variable to the folder name you chose. E.G for the "Norp Actor (Dyn).js" change 'Norp Actor' to the name of your actor folder... probably actor. Change the script type from the default Pascal to JScript and then click the play button at the bottom. If no error is thrown then it worked.

I published them here to help anyone trying to do a similar thing with the very powerful but community lacking Home Media Server.
# Home Media Server Scripts

Home Media Server is a free DNLA (and more) media server for Windows. Made by Evgeniy Lachinov and available to download from [homemediaserver.ru](https://homemediaserver.ru/).

I tried various Media Servers to stream VR clips and found this one to be the best at being able to categorises films based on ID3 Tags, tagged with the excellent [mp3 tagger](https://www.mp3tag.de/en/). Sadly there doesn't seem to be any resource to help with making these scripts so I had to figure it out through an ass load of trial and error.

So I ended up with these Java scripts. They automatically fill folders for the following:

* All Videos located in a set of paths
* Actor
* Producer
* Rating
* Recently Added
* Recently Viewed
* Unwatched and Unrated

![Folder View](https://raw.githubusercontent.com/Trip69/Home-Media-Server-Scripts/main/img/hms-folders.jpg)

You can use them by creating folders under collections and setting those folder to Type 'Dynamic (script)'. Then paste the script to the script editor. Change the second const variable to the folder name you chose. E.G for the "Norp Actor (Dyn).js" change 'Norp Actor' to the name of your actor folder... probably actor. Change the script type from the default Pascal to JScript and then click the play button at the bottom. If no error is thrown then it worked.

I published them here to help anyone trying to do a similar thing with the very powerful but community lacking Home Media Server.
