const AllMovieFolder = HmsFindMediaFolder(mfVideoAllMoviesItemID);
const oUnWaUnRa = HmsFindMediaFolder(mfVideoCollectionsItemID,"Norp UnWatched UnRated");
const oDateZero = DateTime;
var oMediaItem=THmsScriptMediaItem;
var a = 0;
var b = 0;
var iAdded=0;

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

function doUpdate(sText,iCount,iTotal)
{
   iUpdateCount++;
   if(iUpdateCount!=Int(iTotal/20)) return false;
   else iUpdateCount=0;
   if (HmsCancelPressed()) {
      HmsHideProgress();
      return true;
   }
   HmsShowProgress(sText);
   HmsSetProgress(Int((iCount / iTotal) * 100));
   return false;
}

HmsShowProgress('VR Norp Unwatched UnRated');

for(a=0;a<AllMovieFolder.ChildCount;a++) {
   if(doUpdate('All Norp VR',a,AllMovieFolder.ChildCount))
      break;
   if( (AllMovieFolder.ChildItems[a].IsFolder) ||
       (!isNorpVR(AllMovieFolder.ChildItems[a])) ) continue;
   if((AllMovieFolder.ChildItems[a].Properties[mpiLastPlaybackTime]==oDateZero) &&
      (AllMovieFolder.ChildItems[a].Properties[mpiRatinginStars]==0))
   {
      if(iAdded < 40) {
         oUnWaUnRa.AddItem("",AllMovieFolder.ChildItems[a]);
         iAdded++;
      } else break;
   }
}

oUnWaUnRa.Properties[mpiFolderSortOrder]="-mpCreateDate";
oUnWaUnRa.SaveMetadataToCache();
HmsDatabaseAutoSave();
let ProcessMediaResult='Completed';
HmsLogMessage(1,'VR Norp Unwatched UnRated Updated');
HmsHideProgress();