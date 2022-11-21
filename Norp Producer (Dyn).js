const AllMovieFolder = HmsFindMediaFolder(mfVideoAllMoviesItemID);
const NorpVRProducers = HmsFindMediaFolder(mfVideoCollectionsItemID,'Norp Producer');

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

//HmsDatabaseScanFolders;
let oDateList=new THmsScriptMediaItemList;
let dLastMonth=IncMonth(Now,-1);

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

//-----------------------------------------------------------------Sort Producer
for(a=0;a<AllMovieFolder.ChildCount;a++) {
   if(AllMovieFolder.ChildItems[a].isFolder) continue;
   if(!isNorpVR(AllMovieFolder.ChildItems[a])) continue;
   if(doUpdate('Norp VR Producers',a,AllMovieFolder.ChildCount))
      break;
   sCollectionPath=AllMovieFolder.ChildItems[a].Properties[mpiProducer];
   NorpVRProducers.AddItem(sCollectionPath,AllMovieFolder.ChildItems[a]);
   if(VarToStr(AllMovieFolder.ChildItems[a].Properties[mpiLastPlaybackTime])=='')
      NorpVRProducers.AddItem(sCollectionPath + '\\UnWatched',AllMovieFolder.ChildItems[a]);
}
//Set Sort and Average Rating
for(a=0;a<NorpVRProducers.ChildCount;a++) {
  SetSort(NorpVRProducers.ChildItems[a],'mpCreateDate','-');
  NorpVRProducers.ChildItems[a].Properties[mpiRatingInStars]=GetAvRating(NorpVRProducers.ChildItems[a],true);
  NorpVRProducers.ChildItems[a].SaveMetadataToCache();
}
SetSort(NorpVRProducers,'mpFilename','-');
HmsDatabaseAutoSave();
ProcessMediaResult='Completed.';
HmsLogMessage(1,'VR Norp Producers Update');
HmsHideProgress();