// https://bumbu.me/gapi-in-chrome-extension
// https://stackoverflow.com/questions/55477723/how-to-integrate-google-sheet-to-chrome-extension

let AUTH_TOKEN;
chrome.runtime.onInstalled.addListener(() => {
    chrome.action.setBadgeText({
      text: "OFF",
    });
  });

chrome.identity.getAuthToken({interactive: true}, function(token) {
  console.log('got the token', token);
  AUTH_TOKEN= token;
})


const url = 'https://www.seloger.com/';

chrome.action.onClicked.addListener(async (tab) => {

  if (tab.url.startsWith(url)) {
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (token, url)=>{
            console.log(document)
            const price = document.querySelector("#__next > div > main > div.pages__CWrap-sc-jd4nxp-1.kDiSWL > div > div.pages__CWrapMain-sc-jd4nxp-3.tiDIe > div.EstateResume__EstateResumeContainer-sc-5u2qj9-0.bmnduF > div.Summarystyled__ShowcaseSummaryContainer-sc-1u9xobv-0.kfyHrz > div > div.Summarystyled__Price-sc-1u9xobv-4.fAUZHl > div.Summarystyled__PriceWrapper-sc-1u9xobv-11.fsjhCR > div > span > span").textContent.replace("€","").replace(" ","");
            const neighboorhood = document.querySelector("#__next > div > main > div.pages__CWrap-sc-jd4nxp-1.kDiSWL > div > div.pages__CWrapMain-sc-jd4nxp-3.tiDIe > div:nth-child(2) > p").textContent;
            const surface = document.querySelector("#__next > div > main > div.pages__CWrap-sc-jd4nxp-1.kDiSWL > div > div.pages__CWrapMain-sc-jd4nxp-3.tiDIe > div.EstateResume__EstateResumeContainer-sc-5u2qj9-0.bmnduF > div.Summarystyled__ShowcaseSummaryContainer-sc-1u9xobv-0.kfyHrz > div > div.Summarystyled__TitleWrapper-sc-1u9xobv-2.hFWKOR > div.Summarystyled__TagsWrapper-sc-1u9xobv-13.hRURQu > div:nth-child(2)").textContent.replace(" m²","")
            const annual_charge = !!document.querySelector("#__next > div > main > div.pages__CWrap-sc-jd4nxp-1.kDiSWL > div > div.pages__CWrapMain-sc-jd4nxp-3.tiDIe > div.Coownershipstyled__Container-sc-1fk6ihs-0.jJwgiu > div > p")? document.querySelector("#__next > div > main > div.pages__CWrap-sc-jd4nxp-1.kDiSWL > div > div.pages__CWrapMain-sc-jd4nxp-3.tiDIe > div.Coownershipstyled__Container-sc-1fk6ihs-0.jJwgiu > div > p").textContent: " ";
            const today = new Date();
            const data={
              values:[[
                url,
                price,
                surface,
                neighboorhood,
                annual_charge,
                today.toLocaleDateString()
              ]]
            }
          fetch('https://sheets.googleapis.com/v4/spreadsheets/1B9F54SWBLDZABryZX73lHOuD6vom60oXu4Xb4Q9ATHs/values/RawStudioData:append?valueInputOption=USER_ENTERED', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify(data)
          }).then((document) => {
              return document.json();
          }).then((document) => {
              console.log("Document Created......", document);
          }).catch((error) => {
              console.log(error);
          })
        },
        args: [AUTH_TOKEN, tab.url]
      });
    // FOLLOWING CODE IS FROM THE EXAMPLE OF GOOGLE
    // // Retrieve the action badge to check if the extension is 'ON' or 'OFF'
    // const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
    // // Next state will always be the opposite
    // const nextState = prevState === 'ON' ? 'OFF' : 'ON'

    // // Set the action badge to the next state
    // await chrome.action.setBadgeText({
    //   tabId: tab.id,
    //   text: nextState,
    // });

    // if (nextState === "ON") {
    //     // Insert the CSS file when the user turns the extension on
    //     await chrome.scripting.insertCSS({
    //       files: ["focus-mode.css"],
    //       target: { tabId: tab.id },
    //     });
    //   } else if (nextState === "OFF") {
    //     // Remove the CSS file when the user turns the extension off
    //     await chrome.scripting.removeCSS({
    //       files: ["focus-mode.css"],
    //       target: { tabId: tab.id },
    //     });
    //   }
    } else {
        console.log("The plugin doesn't work on this url yet. Please contact the devs ;)")
    }
  });