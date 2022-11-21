const AllMovieFolder = HmsFindMediaFolder(mfVideoAllMoviesItemID);
const NorpVRRatings = HmsFindMediaFolder(mfVideoCollectionsItemID,'Norp Raitings');

var a = 0;
var b = 0;
var c = 0;

var sa = 0;
var sb = 0;
var sc = 0;

var sProperty='';
var oMediaItem=THmsScriptMediaItem;
var oItemList=THmsScriptediaItemList;

let iUpdateCount=0;
let bBreak=false;
let ProcessMediaResult='Cancelled.';

let oDateList=new THmsScriptMediaItemList;

function isNorpVR(oMediaItem) //THmsScriptMediaItem : bool
{
   if ((oMediaItem==nil) && (CurrentMediaItem!=nil)) oMediaItem=CurrentMediaItem;
   else if ((oMediaItem==nil) && (CurrentMediaItem==nil)) return false;
   return (Pos('Norp VR',oMediaItem.Properties[mpiFilePath])
           + Pos('ToSort',oMediaItem.Properties[mpiFilePath])
           + Pos('storage',oMediaItem.Properties[mpiFilePath]) ) > 0;
}

function SetSort(oMediaToSort,sSort,sModifer) {
   oMediaToSort.Properties[mpiFolderSortOrder]=sModifer+sSort;
   oMediaToSort.Sort(sSort);
}

function GetAvRating(oFolder,Folders) //THmsScriptMediaItem,Bool : Integer
{
   if(oFolder==nil) return 0;
   let TotalRatedItems=0;
   let TotalStars=0;
   for(sa=0;sa<oFolder.ChildCount;sa++) {
      if((Folders==false) && (oFolder.ChildItems[sa].isFolder))
         continue;
      if(oFolder.ChildItems[sa].Properties[mpiRatingInStars]<0)
         continue;
      TotalRatedItems++;
      TotalStars+=oFolder.ChildItems[sa].Properties[mpiRatingInStars];
   }
   return Round(TotalStars/TotalRatedItems);
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

//-------------------------------------------------------------------------Sort Ratings
HmsShowProgress('Norp VR Raitings');
for(a=0;a<AllMovieFolder.ChildCount;a++) {
   if(doUpdate('Norp VR Raitings',a,AllMovieFolder.ChildCount))
      break;
   if(AllMovieFolder.ChildItems[a].isFolder) continue;
   if(!isNorpVR(AllMovieFolder.ChildItems[a])) continue;
   if (AllMovieFolder.ChildItems[a].Properties[mpiRatingInStars] < 0)
      sCollectionPath = 0;
   else
      sCollectionPath = AllMovieFolder.ChildItems[a].Properties[mpiRatingInStars];
   NorpVRRatings.AddItem(sCollectionPath,AllMovieFolder.ChildItems[a]);
   if(VarToStr(AllMovieFolder.ChildItems[a].Properties[mpiLastPlaybackTime])=='')
      NorpVRRecent.AddItem(sCollectionPath + '\\UnWatched',AllMovieFolder.ChildItems[a]);
}
//Set Sort and Average Rating
for(a=0;a<NorpVRRatings.ChildCount;a++) {
   SetSort(NorpVRRatings.ChildItems[a],'mpCreateDate','-')
   NorpVRRatings.ChildItems[a].Properties[mpiRatingInStars]=GetAvRating(NorpVRRatings.ChildItems[a],true);
   NorpVRRecent.ChildItems[a].ChildItems[0].Properties[mpiRatingInStars]=GetAvRating(NorpVRRatings.ChildItems[a].ChildItems[0],true);
   NorpVRRatings.ChildItems[a].SaveMetadataToCache();
}

SetSort(NorpVRRatings,'mpFilename','-');
HmsDatabaseAutoSave();
ProcessMediaResult='Completed.';
HmsLogMessage(1,'VR Norp Raitings Update');
HmsHideProgress();