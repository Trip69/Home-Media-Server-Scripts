const AllMovieFolder = HmsFindMediaFolder(mfVideoAllMoviesItemID);
const NorpVRActors = HmsFindMediaFolder(mfVideoCollectionsItemID,'Norp Actor');

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
HmsShowProgress('Norp VR Actors');
let oScriptFileTags = THmsScriptFileTags;
for(a=0;a<AllMovieFolder.ChildCount;a++) {
   if(AllMovieFolder.ChildItems[a].isFolder) continue;
   if(!isNorpVR(AllMovieFolder.ChildItems[a])) continue;
   if(Length(AllMovieFolder.ChildItems[a].Properties[mpiActor])==0) {
      oScriptFileTags = HmsCreateMediaItemTags(tpFFmpeg,AllMovieFolder.ChildItems[a]);
      AllMovieFolder.ChildItems[a].Properties[mpiActor]=oScriptFileTags.GetTagValue('ARTIST');
      AllMovieFolder.ChildItems[a].SaveMetadataToCache();
      oScriptFileTags.Free();
   }
   b=WordCount(AllMovieFolder.ChildItems[a].Properties[mpiActor],',')+1;
   for(c=1;c<b;c++){
      sActor=ExtractWord(c,AllMovieFolder.ChildItems[a].Properties[mpiActor],',');
      switch(Uppercase(Copy(sActor,1,1))) {
         case 'A','B','C','D','E': {
            sProperty='A-E';
          }
         case 'F','G','H','I','J': {
            sProperty='F-J';
         }
         case 'K','L','M','N','O': {
            sProperty='K-O';
         }
         case 'P','Q','R','S','T': {
            sProperty='P-T';
         }
         case 'U','V','W','X','Y','Z': {
            sProperty='U-Z';
         }
         case '1','2','3','4','5','6','7','8','9': {
            sProperty='#';
         }
         default: {
            sProperty='Other';
         }
      }
      sCollectionPath=sProperty+'\\'+sActor;
      NorpVRActors.AddItem(sCollectionPath,AllMovieFolder.ChildItems[a]);
      if(VarToStr(AllMovieFolder.ChildItems[a].Properties[mpiLastPlaybackTime])=='')
         NorpVRActors.AddItem(sCollectionPath + '\\UnWatched',AllMovieFolder.ChildItems[a]);
   }
   if(doUpdate('Norp VR Actors',a,AllMovieFolder.ChildCount))
      break;
}
//Set Sort and Average Rating
for(a=0;a<NorpVRActors.ChildCount;a++) {
  SetSort(NorpVRActors.ChildItems[a],'mpTitle','-');
  for(b=0;b<NorpVRActors.ChildItems[a].ChildCount;b++) {
    SetSort(NorpVRActors.ChildItems[a].ChildItems[b],'mpTitle','-');
    NorpVRActors.ChildItems[a].ChildItems[b].Properties[mpiRatingInStars]=GetAvRating(NorpVRActors.ChildItems[a].ChildItems[b],true);
    NorpVRActors.ChildItems[a].ChildItems[b].SaveMetadataToCache();
  }
}
SetSort(NorpVRActors,'mpTitle','-');

HmsDatabaseAutoSave();
ProcessMediaResult='Completed.';
HmsLogMessage(1,'VR Norp Actors Update');
HmsHideProgress();