const AllMovieFolder = HmsFindMediaFolder(mfVideoAllMoviesItemID);
const AllNorpVRFolder = HmsFindMediaFolder(mfVideoCollectionsItemID,'All Norp VR');

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
let oScriptFileTags = THmsScriptMediaItem;

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

//Do Update 20 times per operation (GUI update takes longer than processing)
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

//-------------------------------------------------------------------------Sort Genres
HmsShowProgress('All Norp VR');
for(a=0;a<AllMovieFolder.ChildCount;a++) {
   if(AllMovieFolder.ChildItems[a].isFolder) continue;
   if(!isNorpVR(AllMovieFolder.ChildItems[a])) continue;
   if(doUpdate('All Norp VR',a,AllMovieFolder.ChildCount))
      break;
   if(AllMovieFolder.ChildItems[a].Properties[mpiRatingInStars]<0) {
      oScriptFileTags = HmsCreateMediaItemTags(tpFFmpeg,AllMovieFolder.ChildItems[a]);
      if(oScriptFileTags.GetTagValue('RATING MM')<0)
         AllMovieFolder.ChildItems[a].Properties[mpiRatingInStars]=0;
      else
         AllMovieFolder.ChildItems[a].Properties[mpiRatingInStars]=oScriptFileTags.GetTagValue('RATING MM');
      AllMovieFolder.ChildItems[a].SaveMetadataToCache();
      oScriptFileTags.Free();
   }
   if(false) { //AllMovieFolder.ChildItems[a].Properties[mpiFileDate]<0
      oScriptFileTags = HmsCreateMediaItemTags(tpFFmpeg,AllMovieFolder.ChildItems[a]);
      sProperty=oScriptFileTags.GetTagValue('RELEASETIME');
      if(sProperty!='') {
         sProperty=ReplaceStr(sProperty,'/','.');
         sProperty=EncodeDate(StrToInt(ExtractWord(3,sProperty,'.')),StrToInt(ExtractWord(2,sProperty,'.')),(StrToInt(ExtractWord(1,sProperty,'.'))));
         AllMovieFolder.ChildItems[a].Properties[mpiCreateDate]=sProperty;
         AllMovieFolder.ChildItems[a].SaveMetadataToCache();
         oScriptFileTags.Free();
      } else HmsLogMessage(1,oMediaItem.ItemTitle+' has no releasetime');
   }
   AllNorpVRFolder.AddItem('',AllMovieFolder.ChildItems[a]);
}
SetSort(AllNorpVRFolder,'mpFileDate','-');
HmsDatabaseAutoSave();
HmsHideProgress();
ProcessMediaResult='Completed.';
HmsLogMessage(1,'VR All Norp Updated');