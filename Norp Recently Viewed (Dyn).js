const AllMovieFolder = HmsFindMediaFolder(mfVideoAllMoviesItemID);
const oRecentlyPlayedNorp = HmsFindMediaFolder(mfVideoCollectionsItemID,"Norp Recently Viewed");
const oDateZero = DateTime;
var oMediaItem=THmsScriptMediaItem;
var oMediaList=THmsScriptMediaItemList;
var a = 0;
var b = 0;

function isNorpVR(oMediaItem) //THmsScriptMediaItem : bool
{
   if ((oMediaItem==nil) && (CurrentMediaItem!=nil))
      oMediaItem=CurrentMediaItem;
   else if ((oMediaItem==nil) && (CurrentMediaItem==nil))
      return false;
   return (Pos('Norp VR',oMediaItem.Properties[mpiFilePath])
           + Pos('ToSort',oMediaItem.Properties[mpiFilePath])
           + Pos('storage',oMediaItem.Properties[mpiFilePath]) ) > 0;
}

function AddIfViewedRecently(oMediaItem) {
   for(b=0;b<20;b++) {
       if(oMediaList.Items[b].Properties[mpiLastPlaybackTime] < oMediaItem.Properties[mpiLastPlaybackTime]) {
          oMediaList.Delete(b);
          oMediaList.Add(oMediaItem);
          return true;
       }
   }
   return false;
}

for(a=0;a<AllMovieFolder.ChildCount;a++) {
   if( (AllMovieFolder.ChildItems[a].IsFolder) || (!isNorpVR(AllMovieFolder.ChildItems[a])) ) continue;
   if(AllMovieFolder.ChildItems[a].Properties[mpiLastPlaybackTime]>oDateZero)
   {
      if(oMediaList.Count < 20) oMediaList.Add(AllMovieFolder.ChildItems[a])
      else AddIfViewedRecently(AllMovieFolder.ChildItems[a]);
   }
}
for(a=0;a<20;a++)
   oRecentlyPlayedNorp.AddItem("",oMediaList.Items[a]);
oRecentlyPlayedNorp.Properties[mpiFolderSortOrder]="-mpLastPlaybackTime";
//oRecentlyPlayedNorp.Sort(mpLastPlaybackTime);
oRecentlyPlayedNorp.SaveMetadataToCache();
HmsDatabaseAutoSave();
let ProcessMediaResult='Completed';
HmsLogMessage(1,'VR Norp Recently Viewed Updated');