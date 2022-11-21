const AllMovieFolder = HmsFindMediaFolder(mfVideoAllMoviesItemID);
const NorpVRRecent = HmsFindMediaFolder(mfVideoCollectionsItemID,'Norp Recent');

var a = 0;
var b = 0;
var c = 0;

var sa = 0;
var sb = 0;
var sc = 0;

var sProperty='';
var oMediaItem=THmsScriptMediaItem;
var oItemList=THmsScriptediaItemList;

let iDays = 0;
let iMonths = 0;
let iYears = 0;

let iUpdateCount=0;
let bBreak=false;
let ProcessMediaResult='Cancelled.';

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

const RecentGroups = ['3 Days Fresh','A Week Old','After 2 Weeks','Within this Month'];

function GetAvRating(oFolder,Folders) //THmsScriptMediaItem,Bool : Integer
{
   if(oFolder==nil) return 0;
   let TotalRatedItems=0;
   let TotalStars=0;
   for(sa=0;sa<oFolder.ChildCount;sa++) {
      if((Folders==false) && (oFolder.ChildItems[sa].isFolder))
         continue;
      if(oFolder.ChildItems[sa].Properties[mpiRatingInStars]==nil)
         continue;
      if(oFolder.ChildItems[sa].Properties[mpiRatingInStars]<0)
         continue;
      TotalRatedItems++;
      TotalStars+=oFolder.ChildItems[sa].Properties[mpiRatingInStars];
   }
   return Round(TotalStars/TotalRatedItems);
}

//HmsDatabaseScanFolders;
let oDateList=new THmsScriptMediaItemList;
let dLastMonth=IncMonth(Now,-1);
//------------------------------------------------------------------------------Add New VR Norp
let iDays = 0;
let iMonths = 0;
let iYears = 0;
//-------------------------------------------------------------------------Make List of Recent
for(a=0;a<AllMovieFolder.ChildCount;a++) {
   if(AllMovieFolder.ChildItems[a].isFolder) continue;
   if(!isNorpVR(AllMovieFolder.ChildItems[a])) continue;
   if(doUpdate('Norp Recent',a,AllMovieFolder.ChildCount)) break;
   DateDiff(AllMovieFolder.ChildItems[a].Properties[mpiCreateDate],dLastMonth,iDays,iMonths,iYears);
   if(iMonths+iYears==0) {
      DateDiff(Now,AllMovieFolder.ChildItems[a].Properties[mpiCreateDate],iDays,iMonths,iYears);
      if ((iDays < 4) && (iMonths+iYears==0)) sCollectionPath = '3 Days Fresh';
      else if ((iDays < 8) && (iMonths+iYears==0)) sCollectionPath = 'A Week Old';
      else if ((iDays < 15) && (iMonths+iYears==0)) sCollectionPath = 'After 2 Weeks';
      else if ((iMonths < 1) && (iYears==0)) sCollectionPath = 'Within this Month';
      else continue;
      NorpVRRecent.AddItem(sCollectionPath,AllMovieFolder.ChildItems[a]);
      if(VarToStr(AllMovieFolder.ChildItems[a].Properties[mpiLastPlaybackTime])=='') NorpVRRecent.AddItem(sCollectionPath + '\\UnWatched',AllMovieFolder.ChildItems[a]);
   }
}
//Set Sort and Average Rating
for(a=0;a<NorpVRRecent.ChildCount;a++) {
  SetSort(NorpVRRecent.ChildItems[a],'mpCreateDate','-')
  NorpVRRecent.ChildItems[a].Properties[mpiRatingInStars]=GetAvRating(NorpVRRecent.ChildItems[a],true);
  NorpVRRecent.ChildItems[a].ChildItems[1].Properties[mpiRatingInStars]=GetAvRating(NorpVRRecent.ChildItems[a].ChildItems[1],true);
  NorpVRRecent.ChildItems[a].SaveMetadataToCache();
}

HmsDatabaseAutoSave();
ProcessMediaResult='Completed.';
HmsHideProgress();
HmsLogMessage(1,'VR Norp Recent Update');